//to feed pdf details into chatgpt
import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

//takes query vector and search through pinecone for similar vector and returns the similar vectors
export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    try {
        const client = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
        const pineconeIndex = await client.index("chatpdf-ai");
        const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
        //pineconeIndex has a fuction called query
        const queryResult = await namespace.query({
            //return top 5 similar vectors that matches the query
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
        });
        return queryResult.matches || [];

    }
    catch (error) {
        console.log("error querying embeddings", error);
        throw error;
    }
}
//function to get the context of the query 
export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    const qualifyingDocs = matches.filter(
        (match) => match.score && match.score > 0.7
    );
    type Metadata = {
        text: string;
        pageNumber: number;
    };
    let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
    // 5 vectors
    return docs.join("\n").substring(0, 3000);
}
