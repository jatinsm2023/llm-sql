"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Avatar } from "../components/ui/Avatar";
import { Textarea } from "../components/ui/Textarea";
import { LogOut, Send, User } from "../components/icons";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [executedMessages, setExecutedMessages] = useState({});
  const [retryMessages, setRetryMessages] = useState({});
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSendMessage = async (e, customInput = null, isRetry = false) => {
    e?.preventDefault?.();

    const messageToSend = customInput || input.trim();
    if (!messageToSend) return;

    // Only add user message if it's not a retry
    if (!isRetry) {
      const userMessage = {
        id: Date.now().toString(),
        content: messageToSend,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
    }
    
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://94cf-34-82-249-73.ngrok-free.app/generate_sql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: messageToSend }),
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const responseText = data?.sql_query || "Couldn't parse SQL query";

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setRetryMessages((prev) => ({
        ...prev,
        [aiMessage.id]: messageToSend,
      }));
    } catch (error) {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ Server error. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      // Make sure to store the original message for retry even in case of errors
      setRetryMessages((prev) => ({
        ...prev,
        [aiMessage.id]: messageToSend,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const cleanSqlQuery = (query) => {
    console.log("Original query:", query);
  
    // Extract SQL part if query starts with prefixes like "query:"
    if (query.toLowerCase().includes("query:")) {
      const queryStartIndex = query.toLowerCase().indexOf("query:") + 6;
      query = query.substring(queryStartIndex).trim();
    }
  
    // Remove surrounding quotes if present
    if (
      (query.startsWith('"') && query.endsWith('"')) ||
      (query.startsWith("'") && query.endsWith("'"))
    ) {
      query = query.substring(1, query.length - 1);
    }
  
    // Replace escaped newlines/tabs and literal ones with space
    query = query
      .replace(/\\n/g, " ")
      .replace(/\\t/g, " ")
      .replace(/\n/g, " ")
      .replace(/\t/g, " ");
  
    // Replace escaped quotes with actual quotes
    query = query.replace(/\\"/g, '"').replace(/\\'/g, "'");
  
    // Convert double-quoted string literals to single quotes
    query = query.replace(/"([^"]*?)"/g, "'$1'");
  
    // Replace multiple spaces with a single space
    query = query.replace(/\s+/g, " ").trim();
  
    // Ensure query ends with semicolon
    if (!query.endsWith(";")) {
      query += ";";
    }
  
    console.log("Cleaned query:", query);
    return query;
  };

  function ResultTable({ rows }) {
    if (!rows || !Array.isArray(rows) || rows.length === 0) return <p>No data available.</p>;
  
    const isAggregate = rows.length === 1 && rows[0].length === 1;
  
    if (isAggregate) {
      return <p><strong>Result:</strong> {rows[0][0]}</p>;
    }
  
    const headers = rows[0].map((_, i) => `Column ${i + 1}`);
  
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-left">
          {/* <thead className="bg-muted font-semibold">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="border px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead> */}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-background even:bg-muted/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border px-4 py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  const handleExecuteQuery = async (message) => {
    setExecutedMessages((prev) => ({
      ...prev,
      [message.id]: "yes",
    }));

    const userExecuteMsg = {
      id: Date.now().toString(),
      content: "Execute query",
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userExecuteMsg]);

    setIsLoading(true);

    try {
      const cleanedQuery = cleanSqlQuery(message.content);
      console.log(cleanedQuery)

      const res = await fetch(
        "https://94cf-34-82-249-73.ngrok-free.app/execute_query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sql_query: cleanedQuery }),
        }
      );

      const data = await res.json();

      const resultMessage = {
        id: (Date.now() + 1).toString(),
        content: <ResultTable rows={data?.result} /> || "Query executed, but no output was returned.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, resultMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ Error executing the query.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (message) => {
    setExecutedMessages((prev) => ({
      ...prev,
      [message.id]: "yes",
    }));

    const userRetryMsg = {
      id: Date.now().toString(),
      content: "Try again",
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userRetryMsg]);

    // Get the original query that resulted in this message
    const originalQuery = retryMessages[message.id];
    if (originalQuery) {
      // Pass isRetry=true to prevent duplicating the user message
      handleSendMessage(null, originalQuery, true);
    }
  };

  const handleReject = (message) => {
    setExecutedMessages((prev) => ({
      ...prev,
      [message.id]: "no",
    }));
  };

  const handleLogout = () => {
    navigate("/");
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const shouldRetry = (content) =>
    !content ||
    (typeof content === "string" &&
      (
        content.toLowerCase().includes("couldn't parse") ||
        content.toLowerCase().includes("server error")
      ));
  
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">NL2SQL App</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden">
        <div className="grid h-full md:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full flex-col gap-2 p-4">
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-4">
                <User className="h-5 w-5" />
                <span>Chat</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4 max-w-10xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div
                      className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : ""
                        }`}
                    >
                      {message.sender === "ai" && (
                        <Avatar className="h-8 w-8">
                          <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-sm">
                            AI
                          </div>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                          }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="mt-1 text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <div className="bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center rounded-full text-sm">
                            U
                          </div>
                        </Avatar>
                      )}
                    </div>

                    {/* Conditional prompt */}
                    {message.sender === "ai" &&
                      message.id !== "1" &&
                      (shouldRetry(message.content) ? (
                        <div className="ml-11 text-sm flex items-center gap-2">
                          <span className="text-muted-foreground">Try again?</span>
                          {executedMessages[message.id] !== "no" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleRetry(message)}
                              disabled={executedMessages[message.id] === "yes"}
                            >
                              Yes
                            </Button>
                          )}
                          {executedMessages[message.id] !== "yes" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(message)}
                              disabled={executedMessages[message.id] === "no"}
                            >
                              No
                            </Button>
                          )}
                        </div>
                      ) : typeof message.content === 'string' && message.content.toLowerCase().includes("select") && (
                        <div className="ml-11 text-sm flex items-center gap-2">
                          <span className="text-muted-foreground">Do you want to execute this query?</span>
                          {executedMessages[message.id] !== "no" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleExecuteQuery(message)}
                              disabled={executedMessages[message.id] === "yes"}
                            >
                              Yes
                            </Button>
                          )}
                          {executedMessages[message.id] !== "yes" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(message)}
                              disabled={executedMessages[message.id] === "no"}
                            >
                              No
                            </Button>
                          )}
                        </div>
                      ))}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full text-sm">
                        AI
                      </div>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                        <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 max-w-7xl mx-auto"
              >
                <Textarea
                  className="min-h-[10px] flex-1 resize-none"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatPage;