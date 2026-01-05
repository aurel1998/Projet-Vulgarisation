"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/Card";
import Button from "@/components/Button";
import chatbotData from "@/data/chatbot_intents.json";
import { findBestIntent } from "@/lib/chatbot";
import { Send, Bot, User } from "lucide-react";
import Link from "next/link";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  links?: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Salut ! 👋 Je suis là pour répondre à tes questions sur le BUT Science des Données. Tu veux savoir quoi ?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastConfidence, setLastConfidence] = useState<number>(10); // Par défaut, confiance élevée
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Utilise la fonction améliorée de matching
  const handleFindIntent = (text: string): { response: string; links: string[]; confidence: number } => {
    try {
      const match = findBestIntent(text);
      return {
        response: match.response || chatbotData.default || "Je ne suis pas sûr de comprendre. Peux-tu reformuler ?",
        links: match.links || [],
        confidence: match.confidence || 0,
      };
    } catch (error) {
      console.error("Erreur dans handleFindIntent:", error);
      return {
        response: chatbotData.default || "Je ne suis pas sûr de comprendre. Peux-tu reformuler ?",
        links: [],
        confidence: 0,
      };
    }
  };

  const handleSend = () => {
    const currentInput = input.trim();
    if (!currentInput) return;

    const userMessage: Message = {
      id: messages.length,
      text: currentInput,
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simuler une réponse du bot
    setTimeout(() => {
      try {
        const { response, links, confidence } = handleFindIntent(currentInput);
        setLastConfidence(confidence);
        setMessages(prev => {
          const botMessage: Message = {
            id: prev.length + 1,
            text: response,
            sender: "bot",
            links,
          };
          return [...prev, botMessage];
        });
        setIsTyping(false);
      } catch (error) {
        console.error("Erreur dans handleSend:", error);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Désolé, j'ai eu un problème. Peux-tu reformuler ta question ?",
          sender: "bot",
        }]);
        setIsTyping(false);
        setLastConfidence(0);
      }
    }, 800);
  };

  const handleQuickReply = (text: string) => {
    const currentInput = text.trim();
    if (!currentInput) return;

    const userMessage: Message = {
      id: messages.length,
      text: currentInput,
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      try {
        const { response, links, confidence } = handleFindIntent(currentInput);
        setLastConfidence(confidence);
        setMessages(prev => {
          const botMessage: Message = {
            id: prev.length + 1,
            text: response,
            sender: "bot",
            links,
          };
          return [...prev, botMessage];
        });
        setIsTyping(false);
      } catch (error) {
        console.error("Erreur dans handleQuickReply:", error);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "Désolé, j'ai eu un problème. Peux-tu reformuler ta question ?",
          sender: "bot",
        }]);
        setIsTyping(false);
        setLastConfidence(0);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Chatbot Étudiant
        </h1>
        <p className="text-xl text-foreground-muted">
          Parle avec {chatbotData.botName}
        </p>
      </div>

      <Card className="flex flex-col h-[600px] p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center flex-shrink-0">
                    <Bot size={20} className="text-background" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-accent-cyan text-background"
                      : "bg-background-tertiary text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {message.links && message.links.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap gap-2">
                      {message.links.map((link, idx) => {
                        const labels: Record<string, string> = {
                          "/missions": "Missions",
                          "/careers": "Débouchés",
                          "/program": "Formation",
                          "/faq": "FAQ",
                          "/apply": "Candidater",
                        };
                        return (
                          <Link
                            key={idx}
                            href={link}
                            className="text-sm underline opacity-80 hover:opacity-100"
                          >
                            {labels[link] || link}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent-violet flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-background" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center">
                <Bot size={20} className="text-background" />
              </div>
              <div className="bg-background-tertiary rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 border-t border-border pt-4">
            <p className="text-sm text-foreground-muted mb-3">Questions rapides :</p>
            <div className="flex flex-wrap gap-2">
              {chatbotData.quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-background-tertiary text-foreground rounded-lg text-sm hover:bg-background hover:border-accent-cyan border border-border transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fallback quick replies (quand aucune correspondance - confiance faible) */}
        {messages.length > 1 && messages[messages.length - 1].sender === "bot" && 
         lastConfidence < 5 && chatbotData.fallback && chatbotData.fallback.quickReplies && (
          <div className="px-6 pb-4 border-t border-border pt-4">
            <p className="text-sm text-foreground-muted mb-3">Ou pose une de ces questions :</p>
            <div className="flex flex-wrap gap-2">
              {chatbotData.fallback.quickReplies.map((reply: {label: string; value: string}, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply.value)}
                  className="px-4 py-2 bg-background-tertiary text-foreground rounded-lg text-sm hover:bg-background hover:border-accent-cyan border border-border transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pose ta question..."
              className="flex-1 bg-background-tertiary border border-border rounded-lg px-4 py-3 text-foreground placeholder-foreground-muted focus:outline-none focus:border-accent-cyan"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-accent-cyan text-background rounded-lg hover:bg-accent-cyan-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

