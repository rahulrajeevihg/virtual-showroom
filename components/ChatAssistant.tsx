"use client";

import { useState } from 'react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your LED World assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'What\'s the best LED for my office?',
    'How do I choose color temperature?',
    'What are your shipping options?',
    'Do you offer installation?'
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: input }]);
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Let me help you with that.',
        'Based on your needs, I recommend checking out our Zone sections.',
        'For more detailed information, please contact our support team.',
        'I can help guide you to the right products. What\'s your application?'
      ];
      setMessages(prev => [...prev, {
        type: 'bot',
        text: responses[Math.floor(Math.random() * responses.length)]
      }]);
    }, 1000);

    setInput('');
  };

  const handleQuickQuestion = (question: string) => {
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Let me help you with that! For personalized recommendations, please browse our zones or contact our experts.'
      }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
          !
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-black border-2 border-white/20 rounded-2xl shadow-2xl flex flex-col animate-slide-up">
      {/* Header */}
      <div className="bg-white text-black p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="font-bold">LED Assistant</div>
            <div className="text-xs opacity-70">Online</div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-black hover:opacity-70 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white border border-white/20'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-white/60 text-sm">Quick questions:</p>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                className="block w-full text-left p-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/60"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
