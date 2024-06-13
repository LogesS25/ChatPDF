//special file 
//this will map to the REST Endpoint
// /api/create-chat

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server"
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";



//then in the front end we can hit this end point and the function here will be called 
export async function POST(req: Request, res: Response) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json()
        //file key and file_name comes from FileUpload.tsx i.e, data
        const { file_key, file_name } = body;
        console.log(file_key, file_name)
        await loadS3IntoPinecone(file_key);

        //chat
        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId,
        }).returning({
            insertedId: chats.id,
        });
        return NextResponse.json(
            {
                chat_id: chat_id[0].insertedId,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error)
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );
    }
}
