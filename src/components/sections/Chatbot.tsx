"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { TbMessageChatbot } from "react-icons/tb";
import { IoSend, IoClose } from "react-icons/io5";
import { GiClothes } from "react-icons/gi";
import { CiImageOn } from "react-icons/ci";
import { v4 as uuidv4 } from 'uuid';

export default function FashionChatbot() {
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: number }[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use useMemo to memoize the welcome message
  const welcomeMessage = useMemo(() => ({
    sender: "bot",
    text: "?? Hi there! I'm your fashion assistant. How can I help style you today?",
    timestamp: Date.now()
  }), []);

  useEffect(() => {
    const existingSessionId = localStorage.getItem("fashionBotSessionId");
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem("fashionBotSessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const chatbotElement = document.getElementById("fashion-chatbot-container");
      if (chatbotElement && !chatbotElement.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          sessionId: sessionId 
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      setIsTyping(false);
      
      const botMessage = { 
        sender: "bot", 
        text: data.reply, 
        timestamp: Date.now() 
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "bot", 
          text: "Sorry, I'm having trouble connecting. Please try again.", 
          timestamp: Date.now() 
        }
      ]);
    }
  };

  // Handle image upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show image preview in chat
    setMessages(prev => [
      ...prev, 
      { 
        sender: "user", 
        text: `?? I've uploaded an image for styling advice`, 
        timestamp: Date.now() 
      }
    ]);

    setIsTyping(true);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', sessionId);

    try {
      // You'd need to implement this endpoint
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Image upload failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: data.reply ?? "I've analyzed your image and can provide styling advice based on it. What are you looking for?", 
          timestamp: Date.now() 
        }
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: "Sorry, I couldn't process your image. Could you try again?", 
          timestamp: Date.now() 
        }
      ]);
    }
  };

  // Format time for message timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="z-50">
      <button
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center z-1000"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <IoClose size={24} />
        ) : (
          <TbMessageChatbot size={24} />
        )}
      </button>

      {isOpen && (
        <div
          id="fashion-chatbot-container"
          className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-1000"
          style={{ maxHeight: "70vh" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-black text-white">
            <div className="flex items-center">
              <GiClothes className="text-xl mr-2" />
              <h2 className="text-lg font-bold">Style Assistant</h2>
            </div>
            <button
              className="text-white hover:text-gray-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <IoClose size={20} />
            </button>
          </div>
          
          {/* Messages container*/}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg) => {
              // Create unique key using timestamp and message text hash
              const messageKey = `${msg.timestamp}-${msg.sender}-${msg.text.substring(0, 10).replace(/\s+/g, '')}`;
              
              return (
                <div
                  key={messageKey}
                  className={`mb-3 ${
                    msg.sender === "user" ? "flex justify-end" : "flex justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3/4 px-4 py-2 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-gray-200 text-black rounded-tl-none"
                    }`}
                  >
                    <div className="text-sm">{msg.text}</div>
                    <div className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 text-black rounded-2xl rounded-tl-none px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Upload hidden input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={uploadImage}
          />
          
          <div className="flex-shrink-0 flex items-center p-3 border-t border-gray-200 bg-white">
            <button
              onClick={handleImageUpload}
              className="p-2 text-gray-500 hover:text-black transition-colors"
              title="Upload an image"
            >
              <CiImageOn size={24} />
            </button>
            
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full mx-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Ask about fashion styling..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`p-2 rounded-full ${
                !input.trim() 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-black hover:bg-gray-100"
              } transition-colors`}
            >
              <IoSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}