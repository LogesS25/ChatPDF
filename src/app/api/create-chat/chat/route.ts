import { Configuration, OpenAIApi } from "openai-edge";

//vercel gives us to get string from the openai response stream and convert it to normal stream 
import { Message, OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = 'edge'

const config = new Configuration({
    apiKey: "sk-pdfappuser-MWm4CVzhmIHIfFXNZBThT3BlbkFJJhvK0Fx9KToqtRcNbnHW",    
  });

const openai = new OpenAIApi(config)

export async function POST(req : Request){
    try {
        const {messages} = await req.json()
        const respone = await openai.createChatCompletion({
            model : 'gpt-3.5-turbo',
            messages,
            stream:true
        })
        const stream = OpenAIStream(respone)
        //passing the stream to frontend
        return new StreamingTextResponse(stream)
    } catch (error) {
        throw error;
    }
}