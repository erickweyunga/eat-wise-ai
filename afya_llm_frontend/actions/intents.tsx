import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

// Define types for our response structures
type TextResponse = {
    text: string
    props: "enable_input" | "disable_input"
}

type ButtonResponse = {
    props?: "disable_input" | "enable_input"
    onButtonClick: (id: number, title: string) => void,
    button_response: {
        text: string
        actions: Array<{
            id: number
            title: string
        }>
    }
}

type InputResponse = {
    text: string
    props: "enable_input" | "disable_input"
}

export type ResponseType = TextResponse | ButtonResponse | InputResponse

export const TextResponseComponent: React.FC<TextResponse> = ({ text }) => {
    return (
        <div className=" p-3 bg-white prose ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text}
            </ReactMarkdown>
        </div>
    )
}

export const ButtonResponseComponent: React.FC<ButtonResponse> = ({ button_response, onButtonClick }) => {
    return (
        <div className={cn("max-w-md overflow-hidden")}>
            <div className='w-full p-3 bg-white'>
                <p className="mb-2">{button_response.text}</p>
            </div>
            <div className={cn("grid grid-cols-2 gap-2 py-3 w-full")}>
                {button_response.actions.map((action) => (
                    <Button
                        key={action.id}
                        onClick={() => onButtonClick(action.id, action.title)}
                        variant="outline"
                        className="justify-between rounded-sm bg-white text-blue-600 transition-colors"
                    >
                        {action.title}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                ))}
            </div>
        </div>
    )
}

export const InputResponseComponent: React.FC<InputResponse & { onSubmit: (text: string) => void }> = ({ text, onSubmit }) => {
    const [input, setInput] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(input)
        setInput("")
    }

    return (
        <div className="mb-4 w-full">
            <div className="flex justify-start mb-2">
                <div className="bg-white rounded-lg p-3 !w-full md:max-w-[70%] shadow-sm">
                    <p className="text-gray-800">{text}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    className="flex-1 rounded-full bg-white border-gray-300"
                />
                <Button type="submit" className="rounded-full bg-blue-500 hover:bg-blue-600">
                    Send
                </Button>
            </form>
        </div>
    )
}

