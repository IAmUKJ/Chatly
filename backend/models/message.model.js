import mongoose from "mongoose"
import User from "../models/user.model.js"
const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    }
},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)
export default Message