"use client";
//this component is rendered on client side
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'
import { error } from 'console';

const FileUpload = () => {
    const router = useRouter()

    const [uploading, setUploading] = useState(false)
    //mutation is a function that allows you to hit the backend API
    //we need axios to actually make the call to backend
    const { mutate, isPending } = useMutation({
        //this mutate will then take the endpoint and pass it back to the endpoint=create-chat
        mutationFn: async (
            { file_key, file_name }: {
                file_key: string; file_name: string;
            }) => {
            const response = await axios.post('/api/create-chat', { file_key, file_name });
            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {

            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                //if size is bigger than 10mb
                toast.error('File too large')
                //alert('please upload a smaller file');
                return
            }

            try {
                setUploading(true)
                //when we try to upload the file , it will call this uplpoadToS3
                //uploadToS3 return the data
                //then we call the mutate
                const data = await uploadToS3(file)
                if (!data?.file_key || !data.file_name) {
                    toast.error('Something went wrong')
                    //alert("Something went wrong");
                    return;
                }
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        //console.log(data)
                        toast.success("Chat has been created");
                        router.push(`/chat/${chat_id}`)
                    },
                    onError: (err) => {
                        toast.error('Error creating chat')
                        console.error(err)
                    }
                })
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false)
            }
        },
    });
    //this will return getRootProps,getInputProps
    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className:
                        "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
                })}
            >
                <input {...getInputProps()} />
                {(uploading || isPending) ? (
                    <>
                        {/* loading state*/}
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                            Spilling Tea to GPT...
                        </p>
                    </>
                ) : (
                    <>
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
                    </>
                )}

            </div>
        </div >
    );
};

export default FileUpload