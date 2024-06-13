import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: "sk-pdfappuser-MWm4CVzhmIHIfFXNZBThT3BlbkFJJhvK0Fx9KToqtRcNbnHW",
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    console.log(result);
    return result.data[0].embedding as number[];      
    
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  } 
  
}
