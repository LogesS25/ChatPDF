//special wild card app router

import React from 'react'
import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ChatSideBar from '@/components/ui/ChatSideBar';
import PDFViewer from '@/components/ui/PDFViewer';
import ChatComponent from '@/components/ui/ChatComponent';


type Props = {
  params: {
    chatId: string
  }
}

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  //select from chat where chat.userId = userId
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
  if (!_chats) {
    return redirect('/')
  }
  if (!_chats.find(chat => chat.id === parseInt(chatId))) {
    return redirect('/')
  }

  const currentChat = _chats.find((chat)=> chat.id === parseInt(chatId))
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
        <ChatComponent chatId={parseInt(chatId)}/> 
        </div>
      </div>
    </div>
  );

};

export default ChatPage;