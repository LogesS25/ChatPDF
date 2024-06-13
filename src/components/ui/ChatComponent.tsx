'use client'
import React from 'react'
import { Input } from './input'
import { useChat } from "@ai-sdk/react";
import { Button } from './button';
import { Send } from 'lucide-react';
import MessageList from '../MessageList';


type Props = {chatId: number};

const ChatComponent = ({chatId}: Props) => {
    //this useChat() comes from vercel
    const { input, handleInputChange, handleSubmit, messages } = useChat({
        //whenever we hit the message it will send our message to chatgpt endpoint
        //and it will return us with a output fro chatgpt
        api : "/api/create-chat/chat",
        body: {
            chatId,
          },
        
    })
    return (
        <div className="relative max-h-screen overflow-scroll"
            id="message-container"
        >
            {/* header */}
            <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
                <h3 className="text-xl font-bold">Chat</h3>
            </div>
            {/* message list */}
            <MessageList messages={messages}/>
            <form
                onSubmit={handleSubmit}
                className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
            >
                <div className="flex">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask any question..."
                        className="w-full"
                    />
                    <Button className="bg-blue-600 ml-2">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>

            </form>

        </div>
    )
}

export default ChatComponent