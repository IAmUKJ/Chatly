import { useEffect } from "react"
import axios from 'axios'
import { serverUrl } from "../config"
import { useDispatch, useSelector } from "react-redux"
import { setOtherUsersData, setUserData } from "../redux/userSlice"
const getOtherUsers=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser=async ()=>{
            try{
                let result=await axios.get(`${serverUrl}/api/user/others`,{withCredentials:true})
                dispatch(setOtherUsersData(result.data))
            }
            catch(error){
                console.log(error)
            }
        }
        fetchUser()
    },[userData])
}

export default getOtherUsers