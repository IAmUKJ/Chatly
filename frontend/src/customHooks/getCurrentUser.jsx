import { useEffect } from "react"
import axios from 'axios'
import { serverUrl } from "../config"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"
const getCurrentUser=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser=async ()=>{
            try{
                let result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                dispatch(setUserData(result.data))
            }
            catch(error){
                console.log(error)
            }
        }
        fetchUser()
    },[])
}

export default getCurrentUser