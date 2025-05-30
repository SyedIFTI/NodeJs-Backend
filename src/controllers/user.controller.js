import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApirResponse.js'
import {User} from '../models/user.model.js'
import uploadResult from '../utils/Cloudinary.js'
import { options } from "../constants.js";
import jwt from 'jsonwebtoken'
const generateAccessTokenRefereshToken = async(userId)=>{
    const user  =  await User.findById(userId)
    if(!user) throw new ApiError(400,"User not found while generating token")
    const accessToken = user.generateAccessToken()
    const refereshToken = user.generateRefereshToken()
    // console.log(`accessToken:${accessToken} \n refereshToken:${refereshToken}`)
    user.refereshToken = refereshToken
    await user.save({validateBeforeSave:false})
    return {accessToken,refereshToken}

}
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
const userLogin = asyncHandler(async(req,res)=>{
    //get email, username , password  -> req.body
    //check id user not send any empty field
    //find on the basis of email($or) or username if the user is exists if not throw error
    // check passowrd by calling the method we declare in user model 
    //generate access and referesh token
    //set referesh token in db and retrun access and referesh token
    //find the loggedIn user (Optional) and remove password and referesh filed unnecessary
    //set cookies
    //return response


    console.log(req.body)
    const { email,username, password} = req.body
   
    
    if(!email || !username){
        throw new ApiError(400,"username or email is required")
    }
   const findUser  = await User.findOne({$or:[{email},{username}]})
   if(!findUser) throw new ApiError(400,"User is not exists")
    const checkPassword  =  await findUser.isPasswordCorrect(password)
if(!checkPassword) throw new ApiError(400,"Invalid Creditentials")

    const {accessToken,refereshToken} = await generateAccessTokenRefereshToken(findUser._id)
   
const LoggedInUser = await User.findById(findUser._id).select("-password -refereshToken")
if(!LoggedInUser) throw new ApiError(400,"Fail in LoggedIn")


return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refereshToken",refereshToken,options).json(
    new ApiResponse(200,
        {user:LoggedInUser,accessToken:accessToken,refereshToken:refereshToken}
    ,"User LoggedIn Sucessfuly")
)
})
const userLogout  = asyncHandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,{$set:{refereshToken:undefined}},{new:true})
return res.
status(200).
clearCookie("accessToken",options).
clearCookie("refereshToken",options).json(new ApiResponse(200,{},"User is logged Out"))
})
const AccessrefereshToken = asyncHandler(async(req,res)=>{
const refereshToken  = req.cookie?.refereshToken || req.body.refereshToken
if(!refereshToken) throw new ApiError(401,"Refersh token not found")
    try {
        const decoded = jwt.verify(refereshToken,process.env.REFRESH_TOKEN_SECERET)
    const user  = await User.findById(decoded._id)
    if(!user) throw new ApiError("Invalid referesh token")
    if(user?.refereshToken!==refereshToken) throw new ApiError(401,"Referesh token is expired!")
    const {accessToken,newRefereshToken} = await generateAccessTokenRefereshToken(user._id)
    
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refereshToken",newRefereshToken,options)
    .json(new ApiResponse(200,{
        accessToken,
        refereshToken:newRefereshToken
    },"Access token refereshed"))
    } catch (error) {
        throw new ApiError(400,"Error in Refereshing Token")
    }
})
export {userRegister,userLogin,userLogout,AccessrefereshToken}