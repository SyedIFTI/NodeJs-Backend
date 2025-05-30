import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApirResponse.js'
import {User} from '../models/user.model.js'
import uploadResult from '../utils/Cloudinary.js'

const userRegister = asyncHandler(async(req,res)=>{
 const {username,fullname,email,password}= req.body
//Check there is no empty string
 if([username,fullname,email,password].some((filed)=> filed?.trim()==="")){
throw new ApiError(400,"All fields are reqired")
}
//Check if the user is exists
const isUserExist  = await User.findOne({$or:[{email},{username}]})
if(isUserExist){
    throw new ApiError(400,"user is already exists")
}
//give instance to avatar send by user
// console.log(req.files)
const localavatarpath = req.files?.avatar[0]?.path
// const localcoverImagepath = req.files?.coverImage[0]?.path
let localcoverImagepath

if(req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
    localcoverImagepath = req.files.coverImage[0].path
}//need to understand by chatgpt
//check is there is avatar or not
if(!localavatarpath){
    throw new ApiError(400,"Avatar file is required")
}
//upload the avatar and coverImage on cloudinary
const avatar = await uploadResult(localavatarpath)
const coverImage = await uploadResult(localcoverImagepath)
if(!avatar){
        throw new ApiError(400,"Avatar  is required")
}
//Create user
const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar:avatar.url,
    coverImage:coverImage?.url || ""

})
//return user without password and refreseh token
const createdUser = await User.findById(user._id).select(
    "-password -refereshToken"
)
if(!createdUser){

    throw new ApiError(400,"Something went wrong while creating user")
}
return res.status(200).json( new ApiResponse(201,createdUser,"User registered successfuly!"))
})
export {userRegister}