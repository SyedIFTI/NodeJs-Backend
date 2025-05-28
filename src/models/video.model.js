import mongoose , {Schema} from 'mongoose'
const VideoSchema  = new Schema({
videFile:{
    type:String,
    required:true
},
thumbnail:{
    type:String,
    required:true
},
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
duration:{
    type:Number,
    required:true
},
views:{
    type:Number,
    default:0
},
isPublished:{
    type:Boolean,
    deafult: true
},
videoOwner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}


},{timestamps:true})
export const Video = mongoose.model('Video',VideoSchema)
