"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Send, Menu } from 'lucide-react'
import Sidebar from '@/components/base/side-bar'

export default function HealthChat() {
  const [messages, setMessages] = useState([
    { id: 1, message: "Hello! How can I assist you with your health today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      // Add user's message
      const userMessage = { id: messages.length + 1, message: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        const response = await fetch(`${process.env.BACKEND_URL}/afya/respond`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message) {
            const aiMessage = { id: messages.length + 2, message: data.message, sender: "ai" };
            console.log('AI Response:', aiMessage.message);
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
          } else {
            console.error('No reply in response:', data);
          }
        } else {
          console.error('Error fetching AI response:', response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">EATWISE AI</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`px-[20px] flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              className="flex-1"
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
          HealthChat AI is not a substitute for professional medical advice, diagnosis, or treatment.
        </footer>
      </div>
    </div>
  )
}
