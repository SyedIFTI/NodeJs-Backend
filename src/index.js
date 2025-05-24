import dotenv from 'dotenv'
import DbConnection from "./db/db_connection.js";
dotenv.config({
    path:"./env"
})
DbConnection()