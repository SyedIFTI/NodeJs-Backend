const asyncHandler  = (handlerequest)=>{
return (req,res,next)=>{
    Promise.resolve(handlerequest(req,res,next)).catch((err)=>next(err))
}
}

export default asyncHandler