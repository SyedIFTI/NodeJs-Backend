import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'
const DbConnection = async()=>{
try {
 const ConnectionInstance =   await  mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
 console.log(`/n MongoDB Connected !! DB HOST:${ConnectionInstance.connection.host}`)
} catch (error) {
    console.log("ERROR: ",error)
    process.exit(1)
}
}
export default DbConnection