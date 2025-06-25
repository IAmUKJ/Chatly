import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.webp'
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import axios from 'axios';
import { serverUrl } from '../config';
import { setOtherUsersData, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import {  useNavigate } from 'react-router-dom';
function Sidebar() {
    let navigate = useNavigate()
    let {userData,otherUsers,selectedUser,onlineUsers,searchData} = useSelector(state=>state.user)
    let [search,setSearch]=useState(false)
    let [input,setInput]=useState("")
    let dispatch=useDispatch()
    const handleLogOut = async ()=>{
        try{
            let result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
            dispatch(setUserData(null))
            dispatch(setOtherUsersData(null))
            navigate("/login")
        }
        catch(error){
            console.log(error)
        }
    }
    const handleSearch = async ()=>{
        try{
            let result=await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
            console.log(result.data)
        }
        catch(error){
            console.log(error)
            dispatch(setSearchData([]));
        }
    }
    useEffect(()=>{
        if(input){
            handleSearch()
        }
        
    },[input])
  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-slate-200 ${!selectedUser?"block":"hidden"}`}>
        <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-[#20c7ff] shadow-gray-500 cursor-pointer shadow-lg fixed bottom-[20px] left-[10px] text-gray-700' onClick={handleLogOut}>
            <BiLogOutCircle className='w-[25px] h-[25px]'/>
        </div>

        {input.length > 0 && (
  <div className='flex absolute top-[250px] bg-white w-full h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-lg'>
    {searchData?.length > 0 ? (
      searchData.map((user) => (
        <div
          key={user?._id}
          className='w-[95%] h-[70px] flex justify-start items-center gap-[20px] bg-white shadow-gray-500 shadow-lg hover:bg-[#b2ccdf] cursor-pointer border-b-2 border-gray-500'
          onClick={() => {
            dispatch(setSelectedUser(user));
            setInput('');
            setSearch(false);
          }}
        >
          <div className='relative rounded-full shadow-gray-500 shadow-lg flex justify-center items-center'>
            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white '>
              <img src={user?.image || dp} alt="" className='h-[100%]' />
            </div>
            {onlineUsers?.includes(user?._id) && (
              <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>
            )}
          </div>
          <h1 className='text-gray-800 font-semibold text-[20px]'>{user?.name || user?.userName}</h1>
        </div>
      ))
    ) : (
      <div className='text-gray-600 text-[18px] font-semibold mt-[20px]'>
        No matches found
      </div>
    )}
  </div>
)}



        <div className='w-full h-[300px] bg-[#20c7ff] rounded-b-[30%] shadow-lg flex flex-col justify-center px-[20px]'>
            <div>
                <h1 className='text-white font-bold text-[25px]'>
                    Chatly
                </h1>
                <div className='w-full flex justify-between items-center'>
                    <h1 className='text-gray-800 font-bold text-[25px]'>Hii, {userData.name || "user"}</h1>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg' onClick={()=>navigate("/profile")}>
                        <img src={userData.image || dp} alt="" className='h-[100%]'/>
                    </div>
                </div>
            </div>
            <div className='w-full flex items-center gap-[20px] overflow-y-auto py-[15px]'>
                {!search && <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-gray-500 cursor-pointer shadow-lg' onClick={()=>setSearch(true)}>
                    <IoIosSearch className='w-[25px] h-[25px]'/>
                </div>}
                {search && 
                <form className='w-full h-[60px] bg-white shadow-gray-500 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px]'>
                    <IoIosSearch className='w-[25px] h-[25px]'/>
                    <input type="text" placeholder='search users...' className='w-full h-full text-[17px] p-[10px] outline-none border-0' onChange={(e)=>setInput(e.target.value)} value={input}/>
                    <RxCross2 className='cursor-pointer w-[25px] h-[25px]' onClick={()=>{setSearch(false)
                        setInput("")
                        dispatch(setSearchData([])) 
                    }}/>
                    
                </form>}

                {!search && otherUsers?.map((user)=>(onlineUsers?.includes(user._id) && 
                    <div className='relative rounded-full shadow-gray-500 shadow-lg flex justify-center items-center mt-[10px] cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white '>
                        <img src={user.image || dp} alt="" className='h-[100%]'/>
                        </div>
                        <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>
                    </div>
                ))}
            </div>
        </div>
        <div className='w-full h-[60%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]'>
            {otherUsers?.map((user)=>(
                <div className='w-[95%] h-[60px] flex justify-start items-center gap-[20px] bg-white shadow-gray-500 shadow-lg rounded-full hover:bg-[#b2ccdf] cursor-pointer' onClick={()=>dispatch(setSelectedUser(user))}>
                    <div className='relative rounded-full shadow-gray-500 shadow-lg flex justify-center items-center mt-[10px]'>
                        <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white '>
                            <img src={user.image || dp} alt="" className='h-[100%]'/>
                        </div>
                        {onlineUsers?.includes(user._id) &&
                        <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-[#3aff20] shadow-gray-500 shadow-md'></span>}
                    </div>
                    <h1 className='text-gray-800 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                </div>
            ))}
        </div>
        
    </div>
  )
}

export default Sidebar