//special file 
//this will map to the REST Endpoint
// /api/create-chat

import { NextResponse } from "next/server"

//then in the front end we can hit this end point and the function here will be called 
export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json()
        //file key and file_name comes from FileUpload.tsx i.e, data
        const {file_key,file_name}=body;
        console.log(file_key,file_name)
        return NextResponse.json({message:"success"})
    } catch (error) {
        console.error(error)
        console.error(error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );
    }
}
