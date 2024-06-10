import AWS from 'aws-sdk'

//standard web api file type
export async function uploadToS3(file:File){
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        })
        const s3 = new AWS.S3({
            params:{
                Bucket:process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region:'eu-north-1'
        })

        //to upload file to the uploads folder in AWS
        const file_key='uploads/'+Date.now().toString()+file.name.replace(' ','-')
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body:file
        }

        const upload = s3.putObject(params).on('httpUploadProgress',evt=>{
            console.log('uploading to s3 ...',parseInt(((evt.loaded*100)/evt.total).toString()))+"%"
        }).promise()

        //this call back function will be called whenever the upload in completed
        await upload.then(data =>{
            console.log("Successfully uploaded to s3!",file_key)
        })

        //will use these two parameters to save into database later
        return Promise.resolve({
            file_key,
            file_name:file.name
        })
    } catch (error) {
        
    }
}

export function getS3Url(file_key:string){
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
    return url;
}