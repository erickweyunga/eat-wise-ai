import { Send } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ChatInput = ({ input, setInput, handleSend, enable_input }: { input: string; setInput: (input: string) => void; handleSend: () => void, enable_input?: boolean }) => {
    return (
        <div className="p-4 bg-white border-t">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 h-full">
                <Input
                    value={input}
                    disabled={enable_input || false}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your health question..."
                    className="flex-1 border-none outline-none shadow-none focus:ring-0 focus-visible:ring-transparent "
                />
                <Button type="submit" className='rounded-sm'>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </form>
        </div>
    )
}

export default ChatInput
