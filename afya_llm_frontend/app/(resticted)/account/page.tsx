"use client"

import { useState } from 'react'
import { getResponse } from '@/actions/response'
import { ChatPlayground } from '@/components/base/chat-playground'
import ChatInput from '@/components/base/input'

type Message = {
  id: number
  sender: string
  text?: string,
  button_response?: { text: string; actions: Array<{ id: number; title: string }> },
  props: "enable_input" | "disable_input"
}

const initialMessages: Message[] = [
  { id: 1, text: "Hello! I'm Afya, your health assistant. How can I assist you today?", sender: "ai", props: "enable_input" },
];

export default function HealthChat() {
  const [messages, setMessages] = useState<Message[]>([...initialMessages]);
  const [input, setInput] = useState("");
  const [disableInput, setDisableInput] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { id: messages.length + 1, text: input, sender: "user", props: "disable_input" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setDisableInput(true);

      try {
        const response: string = await getResponse(input);
        if (response) {
          const aiMessage: Message = { id: messages.length + 2, text: response, sender: "ai", props: "enable_input" };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
          setDisableInput(false);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        const errorMessage: Message = {
          id: messages.length + 2,
          text: "Sorry, there was an error processing your request. Please try again.",
          sender: "ai",
          props: "enable_input"
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setDisableInput(false);
      }
    }
  }

  const handleButtonClick = (_: number, title: string) => {
    setInput(title);
    handleSend();
  }

  return (
    <div className='flex flex-col h-full'>
      <ChatPlayground messages={messages} handleButtonClick={handleButtonClick} />
      <ChatInput handleSend={handleSend} input={input} setInput={setInput} enable_input={disableInput} />
    </div>
  )
}