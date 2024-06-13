import { Pinecone, PineconeRecord} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'
import { getEmbeddings } from "./embeddings";
import md5 from 'md5';
import { convertToAscii } from "./utils";

export const getPineconeClient = async () => {
    //this function returns the pinecone with its api configurations 
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

//by looking at console log , this PDFPage type is created with its attributes
type PDFPage = {
    pageContent: string;
    metadata: {
        loc: { pageNumber: number };
    };
};

export async function loadS3IntoPinecone(fileKey: string) {
    //obtain the PDF -> download and read from the pdf
    console.log('downloding s3 into file system')
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error('could not download from s3')
    }
    const loader = new PDFLoader(file_name)
    //this pages variable is the record of the page content 
    const pages = (await loader.load()) as PDFPage[];

    //2.
    const documents = await Promise.all(pages.map(prepareDocument))

    //3.
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    //4. upload to pinecone
    const client = await getPineconeClient()
    const pineconeIndex = client.Index('chatpdf-ai')

    console.log('inserting vecctors into pinecone')
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);
    return documents[0];
}

// 3. vectorize and embed individual documents
async function embedDocument(doc: Document) {
    try {
        //converting page content into vector
        const embeddings = await getEmbeddings(doc.pageContent)
        //md5 hash function
        const hash = md5(doc.pageContent)

        //returing the vector
        return {
            id: hash,
            values: embeddings,
            metadata: {
            text: doc.metadata.text,
            pageNumber: doc.metadata.pageNumber,
            },
        } as PineconeRecord;

    } catch (error) {
        console.log('error embedding documents', error)
        throw error
    }
}

// 2. split and segment the pdf
export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    //this makes sures that string we are passing is within the size
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

//this function takes in a single page
async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page
    pageContent = pageContent.replace(/\n/g, '')
    //split docs
    const splitter = new RecursiveCharacterTextSplitter()
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])
    return docs
}




