import AWS from 'aws-sdk'
//we need fs to download the file from our system
import fs from 'fs'

//this function will get the filekey and download the s3 file into our local computer
export async function downloadFromS3(file_key:string){
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
        });
        //with this params we can update the S3 bucket
        const params = {
            Bucket : process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        };

        //with the filekey it is able to abstract out the unique file from S3
        //this object contains the actual file object
        const obj = await s3.getObject(params).promise();
        const file_name =  `/tmp/pdf-${Date.now()}.pdf`
        fs.writeFileSync(file_name,obj.Body as Buffer)
        return file_name
    } catch (error) {
        console.error(error)
        return null
    }
}