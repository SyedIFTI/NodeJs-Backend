import dotenv from 'dotenv'
import DbConnection from "./db/db_connection.js";
import app from './app.js';
dotenv.config({
    path:"./env"
})
DbConnection().then(()=>{
    app.on('error',(error)=>{
console.log("ERRR: ",error)
throw error
    })
    app.listen(process.env.PORT||8000 , ()=>{
        console.log(`Server is running on PORT ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log('DB CONNECTION ERROR !!!!', error)
})