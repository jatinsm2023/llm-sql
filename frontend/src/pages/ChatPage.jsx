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
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response - replace with actual backend call
    try {
      const res = await fetch(
        "https://5a7a-34-87-2-220.ngrok-free.app/generate_sql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: input }),
        }
      );

      const data = await res.json();
      console.log(data);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: data?.sql_query || "No response from backend 😢",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ Error fetching response from server.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    // Implement logout logic here
    navigate("/");
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen flex-col">
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

      <main className="flex-1 overflow-hidden">
        <div className="grid h-full md:grid-cols-[280px_1fr]">
          {/* Sidebar - can be expanded with conversation history */}
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full flex-col gap-2 p-4">
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-4">
                <User className="h-5 w-5" />
                <span>Your Profile</span>
              </div>
              {/* Conversation history would go here */}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4 max-w-10xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user" ? "justify-end" : ""
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
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender === "user"
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
