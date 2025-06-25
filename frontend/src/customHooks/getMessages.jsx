import { useEffect } from "react"
import axios from 'axios'
import { serverUrl } from "../config"
import { useDispatch, useSelector } from "react-redux"
import { setMessages } from "../redux/messageSlice"

const getMessage=()=>{
    let dispatch=useDispatch()
    let {userData,selectedUser}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchMessages=async ()=>{
            // Reset messages before fetching
            dispatch(setMessages([]))
            try{
                let result=await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`,{withCredentials:true})
                dispatch(setMessages(result.data))
            }
            catch(error){
                console.log(error)
            }
        }
        fetchMessages()
    },[selectedUser,userData])
}

export default getMessage