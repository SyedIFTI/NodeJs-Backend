import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECERET_KEY,
    });
const uploadResult = async(LocalFilePath)=>{
    try {
        if(!LocalFilePath) return null
    //upload file on Cloudinary
      const response =   await cloudinary.uploader
       .upload(
          LocalFilePath, {
               resource_type:"auto"
           }
       )
       console.log("File Uploaded Scucessfuly ",response.url)
       return response
        } catch (error) {
        fs.unlinkSync(LocalFilePath) // remove the locally saved temporary file
    return null
    }
 
}
export default uploadResult
   