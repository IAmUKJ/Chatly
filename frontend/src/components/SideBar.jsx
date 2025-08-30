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
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-gradient-to-b from-slate-50 to-slate-100 relative ${!selectedUser?"block":"hidden"}`}>
        
        {/* Search Results Overlay */}
        {input.length > 0 && (
          <div className='absolute top-[200px] sm:top-[220px] md:top-[250px] left-0 bg-white/95 backdrop-blur-sm w-full h-[calc(100vh-250px)] sm:h-[500px] overflow-y-auto flex items-start pt-4 flex-col gap-2 z-[150] shadow-2xl border border-gray-200 rounded-t-xl'>
            {searchData?.length > 0 ? (
              searchData.map((user) => (
                <div
                  key={user?._id}
                  className='w-[95%] mx-auto h-[70px] flex justify-start items-center gap-4 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-blue-50/80 cursor-pointer border border-gray-100 rounded-xl transition-all duration-300 transform hover:scale-[1.02] px-4'
                  onClick={() => {
                    dispatch(setSelectedUser(user));
                    setInput('');
                    setSearch(false);
                  }}
                >
                  <div className='relative rounded-full flex justify-center items-center'>
                    <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-lg border-2 border-gray-200'>
                      <img src={user?.image || dp} alt="" className='h-[100%] w-[100%] object-cover' />
                    </div>
                    {onlineUsers?.includes(user?._id) && (
                      <span className='w-[12px] h-[12px] rounded-full absolute bottom-[2px] right-[-2px] bg-green-400 shadow-md border-2 border-white'></span>
                    )}
                  </div>
                  <h1 className='text-gray-700 font-semibold text-[16px] sm:text-[18px] md:text-[20px] truncate'>{user?.name || user?.userName}</h1>
                </div>
              ))
            ) : (
              <div className='w-full flex justify-center items-center mt-8'>
                <div className='text-gray-500 text-[16px] sm:text-[18px] font-medium'>
                  No matches found
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header Section */}
        <div className='w-full h-[200px] sm:h-[220px] md:h-[250px] bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-xl flex flex-col justify-center px-4 sm:px-6 relative overflow-hidden'>
            {/* Background decorative elements */}
            <div className='absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl'></div>
            <div className='absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl'></div>
            
            <div className='relative z-10'>
                <h1 className='text-white font-bold text-[20px] sm:text-[24px] md:text-[28px] mb-2 drop-shadow-lg'>
                    Chatly
                </h1>
                <div className='w-full flex justify-between items-center mb-4'>
                    <h1 className='text-white/90 font-semibold text-[16px] sm:text-[18px] md:text-[22px] drop-shadow-md'>
                        Hi, {userData?.name || "user"}!
                    </h1>
                    <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border-2 border-white/30' onClick={()=>navigate("/profile")}>
                        <img src={userData?.image || dp} alt="" className='h-[100%] w-[100%] object-cover'/>
                    </div>
                </div>
            </div>
            
            {/* Search and Online Users Section */}
            <div className='w-full flex items-center gap-3 overflow-x-auto py-2 relative z-10 scrollbar-hide'>
                {!search && (
                    <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0 rounded-full overflow-hidden flex justify-center items-center bg-white/90 backdrop-blur-sm shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-110' onClick={()=>setSearch(true)}>
                        <IoIosSearch className='w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] text-blue-600'/>
                    </div>
                )}
                
                {search && (
                    <div className='w-full h-[50px] sm:h-[60px] bg-white/90 backdrop-blur-sm shadow-lg flex items-center gap-3 rounded-full overflow-hidden px-4'>
                        <IoIosSearch className='w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] text-blue-600'/>
                        <input 
                            type="text" 
                            placeholder='Search users...' 
                            className='w-full h-full text-[14px] sm:text-[16px] md:text-[17px] outline-none border-0 bg-transparent placeholder-gray-500' 
                            onChange={(e)=>setInput(e.target.value)} 
                            value={input}
                        />
                        <RxCross2 
                            className='cursor-pointer w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] text-gray-500 hover:text-red-500 transition-colors' 
                            onClick={()=>{
                                setSearch(false)
                                setInput("")
                                dispatch(setSearchData([])) 
                            }}
                        />
                    </div>
                )}

                {!search && otherUsers?.map((user)=>(onlineUsers?.includes(user._id) && 
                    <div key={user._id} className='relative rounded-full flex-shrink-0 shadow-lg flex justify-center items-center cursor-pointer transition-all duration-300 transform hover:scale-110' onClick={()=>dispatch(setSelectedUser(user))}>
                        <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white border-2 border-white/30'>
                            <img src={user.image || dp} alt="" className='h-[100%] w-[100%] object-cover'/>
                        </div>
                        <span className='w-[12px] h-[12px] rounded-full absolute bottom-[2px] right-[-2px] bg-green-400 shadow-md border-2 border-white'></span>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Users List Section */}
        <div className='w-full h-[calc(100%-200px)] sm:h-[calc(100%-220px)] md:h-[calc(100%-250px)] overflow-auto flex flex-col gap-3 items-center pt-4 pb-[80px] px-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
            {otherUsers?.map((user)=>(
                <div key={user._id} className='w-full max-w-[95%] h-[70px] sm:h-[75px] flex justify-start items-center gap-4 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg rounded-xl hover:bg-blue-50/80 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 px-4' onClick={()=>dispatch(setSelectedUser(user))}>
                    <div className='relative rounded-full flex justify-center items-center flex-shrink-0'>
                        <div className='w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white shadow-md border-2 border-gray-200'>
                            <img src={user.image || dp} alt="" className='h-[100%] w-[100%] object-cover'/>
                        </div>
                        {onlineUsers?.includes(user._id) &&
                        <span className='w-[12px] h-[12px] rounded-full absolute bottom-[2px] right-[-2px] bg-green-400 shadow-md border-2 border-white'></span>}
                    </div>
                    <h1 className='text-gray-700 font-semibold text-[16px] sm:text-[18px] md:text-[20px] truncate flex-1'>{user.name || user.userName}</h1>
                </div>
            ))}
        </div>

        {/* Logout Button - Fixed position at bottom right of sidebar */}
        <div 
            className='absolute bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-[200] border-2 border-red-400/30'
            onClick={handleLogOut}
        >
            <BiLogOutCircle className='w-5 h-5 sm:w-6 sm:h-6 text-white'/>
        </div>
        
    </div>
  )
}

export default Sidebar