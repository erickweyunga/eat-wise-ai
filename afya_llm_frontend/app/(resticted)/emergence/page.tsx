"use client"

import { getIntents } from '@/actions/response'
import { ChatPlayground } from '@/components/base/chat-playground'
import ChatInput from '@/components/base/input'
import React, { useState } from 'react'

export type Message = {
  id: number
  sender: string
  text?: string
  button_response?: { text: string; actions: Array<{ id: number; title: string }> }
  props: "enable_input" | "disable_input"
}

export const EmergencyPage = () => {
  const initialMessages: Message[] = [
    { id: 1, sender: "ai", text: "Hello, how can I assist you with your health concern?", props: "enable_input" },
  ]

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [disableInput, setDisableInput] = useState(false)

  const handleSend = async (message: string) => {
    if (message.trim()) {
      const userMessage: Message = { id: messages.length + 1, text: message, sender: "user", props: "disable_input" }
      setMessages((prevMessages) => [...prevMessages, userMessage])
      setInput("")
      setDisableInput(true)

      try {
        const response: Message = await getIntents({ message: message, intents_type: "emergency" })
        setDisableInput(response.props !== "enable_input")
        setMessages((prevMessages) => [...prevMessages, response])
      } catch (error) {
        console.error('Fetch error:', error)
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: messages.length + 2, sender: "ai", text: "Sorry, there was an error processing your request. Please try again.", props: "enable_input" }
        ])
        setDisableInput(false)
      }
    }
  }

  const handleButtonClick = (_: number, title: string) => {
    handleSend(title)
  }

  return (
    <div className='flex flex-col h-full'>
      <ChatPlayground messages={messages} handleButtonClick={handleButtonClick} />
      <ChatInput handleSend={() => handleSend(input)} input={input} setInput={setInput} enable_input={disableInput} />
    </div>
  )
}

export default EmergencyPage