import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
export const signUp=async (req,res)=>{

    try{
        const {userName,email,password}=req.body
        const checkUserByUserName=await User.findOne({userName})
        if(checkUserByUserName){
            return res.status(400).json({message: "username already exists"})
        }
        const checkUserByEmail=await User.findOne({email})
        if(checkUserByEmail){
            return res.status(400).json({message: "email already exists"})
        }
        if(password.length<8){
            return res.status(400).json({message: "Password must be of atleast 8 characters"})
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const user=await User.create({
            userName,email,password:hashedPassword
        })

        const token=genToken(user._id)
        
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"Strict",
            secure:false
        })

        return res.status(201).json(user)
    }
    catch(error){
        return res.status(500).json({message: `signup error ${error}`})
    }
}

export const login= async (req,res)=>{
    try{
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
        }

        const token = genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"Strict",
            secure:false
        })

        return res.status(200).json(user)
    }

    catch(error){
        return res.status(500).json({message:`login error ${error}`})
    }
}

export const logOut=async (req,res)=>{
    try{
        res.clearCookie("token")
        return res.status(200).json({message:"Log Out Successfully"})
    }

    catch(error){
        return res.status(500).json({message:`logout error ${error}`})
    }
}