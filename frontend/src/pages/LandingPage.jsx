import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">NL2SQL App</span>
          </div>
          <div className="flex items-center gap-4">
            
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Get SQL queries for all your needs, simplified
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Experience seamless conversations with our advanced AI chat
                platform. Provide queries in natural language and get SQL queries
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/chat">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] sm:h-[500px] sm:w-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                <div className="relative h-full w-full rounded-xl border bg-background p-4 shadow-xl">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary" />
                        <span className="font-medium">NL2SQL App</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto py-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />
                        <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                          <p>Hello! How can I help you today?</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary p-3 rounded-lg text-primary-foreground max-w-[80%]">
                          <p>I want to know the number of employees in the company</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-secondary flex-shrink-0" />
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                            placeholder="Type your message..."
                            disabled
                          />
                        </div>
                        <Button size="icon" disabled>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} NL2SQL App. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
