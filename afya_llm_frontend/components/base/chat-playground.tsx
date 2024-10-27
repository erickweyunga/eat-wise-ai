import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { ButtonResponseComponent, TextResponseComponent } from '@/actions/intents'
import { Message } from '@/app/(resticted)/emergence/page'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bot } from 'lucide-react'

export const ChatPlayground = ({ messages, handleButtonClick }: { messages: Message[], handleButtonClick?: (id: number, title: string) => void }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <ScrollArea className="flex-1 px-8 scroll-smooth">
            <div className='flex-1 py-3 scroll-smooth' ref={scrollAreaRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-end space-x-2 mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.sender !== 'user' && (
                            <Avatar className="w-8 h-8">
                                <AvatarImage src="/bot-avatar.png" alt="Bot" />
                                <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={` rounded-lg  ${message.sender === 'user' ? '' : ''}`}>
                                {typeof message.text === 'string' ? (
                                    <TextResponseComponent text={message.text} props='enable_input' />
                                ) : (
                                    message.button_response && handleButtonClick && (
                                        <ButtonResponseComponent
                                            button_response={message.button_response}
                                            onButtonClick={handleButtonClick}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                        {message.sender === 'user' && (
                            <Avatar className="w-8 h-8 rounded-full bg-blue-500">
                                <AvatarImage src="/user-avatar.png" alt="User" />
                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}