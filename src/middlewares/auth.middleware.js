import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
const verifyJWT = (req,_,next)=>{
  try {
      const token  = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
      if(!token) throw new ApiError(400,"Unautorized Access")
          const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECERET)
      if(!decoded)throw new ApiError(401,"Token verification failed!!")
          req.user = decoded._id
      next()
  } catch (error) {
    throw new ApiError(400,error?.message||"Something went wrong in Verifying token")
  }
}
export {verifyJWT}