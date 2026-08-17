'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { fetchApi } from '@/services/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  note?: string;
}

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Konnichiwa! Welcome to IKIGAI Café. I am your AI Concierge. Ask me about our coffee menu, café timings in Kondapur, recommendations, or table reservations!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const res = await fetchApi<{ reply: string; isMockMode: boolean; note?: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userMsg }),
    });

    if (res.success && res.data) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.data!.reply,
          note: res.data!.note,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'I am experiencing a momentary connection issue. Please feel free to call our café directly at 098490 00120.',
        },
      ]);
    }

    setLoading(false);
  };

  const quickPrompts = [
    'What are your top coffee recommendations?',
    'What are the café timings and address?',
    'How do I reserve a table?',
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-espresso-900 border border-ikigai-gold text-ikigai-gold p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 group"
          title="Ask IKIGAI AI Assistant"
        >
          <div className="relative">
            <Bot size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-ikigai-gold rounded-full animate-ping" />
          </div>
          <span className="text-xs font-serif font-semibold pr-1">AI Concierge</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 bg-espresso-900 border border-ikigai-gold/40 rounded-2xl shadow-2xl flex flex-col h-[480px] overflow-hidden backdrop-blur-xl">
          
          {/* Header */}
          <div className="p-4 bg-espresso-950 border-b border-ikigai-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full border border-ikigai-gold flex items-center justify-center bg-espresso-800 text-ikigai-gold">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-ikigai-cream">IKIGAI AI Concierge</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Online • Zen Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ikigai-cream/60 hover:text-ikigai-gold p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-xl space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-ikigai-gold text-espresso-900 font-medium rounded-tr-none'
                      : 'bg-espresso-800 border border-ikigai-border text-ikigai-cream rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  {m.note && (
                    <p className="text-[9px] opacity-60 pt-1 border-t border-ikigai-border/40 italic">
                      {m.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-espresso-800 p-3 rounded-xl text-ikigai-gold flex items-center space-x-2">
                  <RefreshCw size={12} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-espresso-950 border-t border-ikigai-border flex space-x-1.5 overflow-x-auto text-[10px] no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="shrink-0 bg-espresso-800 text-ikigai-cream/80 hover:text-ikigai-gold px-2.5 py-1 rounded border border-ikigai-border whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-espresso-950 border-t border-ikigai-border flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about coffee, food, timings..."
              className="flex-1 bg-espresso-800 border border-ikigai-border rounded-lg px-3 py-2 text-xs text-ikigai-cream focus:outline-none focus:border-ikigai-gold"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-ikigai-gold text-espresso-900 p-2 rounded-lg font-bold hover:bg-ikigai-goldHover disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
