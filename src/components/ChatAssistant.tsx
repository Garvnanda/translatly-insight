import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAssistantProps {
  bookTitle: string;
  selectedText?: string;
  onClose: () => void;
}

export const ChatAssistant = ({ bookTitle, selectedText, onClose }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your reading assistant for "${bookTitle}". I can help explain concepts, summarize passages, or answer questions about what you're reading. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedText) {
      setInput(`Explain this passage: "${selectedText}"`);
    }
  }, [selectedText]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // This would call your chat edge function
      // For now, simulating AI response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const assistantMessage: Message = {
        role: "assistant",
        content: `I understand you're asking about: "${input}". In the context of "${bookTitle}", this relates to the core themes of understanding and knowledge across cultures. 

[This is a simulated response. In the full implementation, this would use AI to provide contextual explanations based on the book content and your question.]

Would you like me to elaborate on any specific aspect?`,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-[calc(100vh-16rem)] flex flex-col rounded-2xl overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Reading Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask me anything about the book</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              {message.role === "assistant" && (
                <div className="p-2 rounded-xl bg-primary/10 h-fit">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {message.role === "user" && (
                <div className="p-2 rounded-xl bg-primary/10 h-fit">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="p-2 rounded-xl bg-primary/10 h-fit">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl p-4">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="rounded-xl"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-xl shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
