import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from '../assets/dp.webp'
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import axios from 'axios';
import { serverUrl } from '../config';
import { setOtherUsersData, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    let navigate = useNavigate()
    let {userData, otherUsers, selectedUser, onlineUsers, searchData} = useSelector(state => state.user)
    let [search, setSearch] = useState(false)
    let [input, setInput] = useState("")
    let [loading, setLoading] = useState(false)
    let dispatch = useDispatch()

    // Fetch all users on component mount
    const fetchAllUsers = async () => {
        try {
            setLoading(true)
            let result = await axios.get(`${serverUrl}/api/user/all`, {withCredentials: true})
            dispatch(setOtherUsersData(result.data))
        } catch(error) {
            console.log('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    // Initial fetch of all users
    useEffect(() => {
        fetchAllUsers()
    }, [])

    const handleLogOut = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials: true})
            dispatch(setUserData(null))
            dispatch(setOtherUsersData(null))
            navigate("/login")
        } catch(error) {
            console.log(error)
        }
    }

    const handleSearch = async () => {
        try {
            let result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, {withCredentials: true})
            dispatch(setSearchData(result.data))
            console.log(result.data)
        } catch(error) {
            console.log(error)
            dispatch(setSearchData([]));
        }
    }

    useEffect(() => {
        if(input) {
            handleSearch()
        } else {
            dispatch(setSearchData([]))
        }
    }, [input])

    return (
        <div className={`lg:w-[30%] w-full h-full flex flex-col bg-gradient-to-b from-white to-gray-50 ${!selectedUser ? "block" : "hidden"} lg:block border-r border-gray-200 relative overflow-hidden`}>
            
            {/* Logout Button - Fixed position within sidebar */}
            <div 
                className='absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex justify-center items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50'
                onClick={handleLogOut}
            >
                <BiLogOutCircle className='w-5 h-5 text-white'/>
            </div>

            {/* Search Results Overlay */}
            {input.length > 0 && (
                <div className='absolute top-0 left-0 right-0 bottom-0 bg-white z-40 flex flex-col'>
                    {/* Header with Search Bar */}
                    <div className='bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex-shrink-0'>
                        <div className='mb-4'>
                            <h1 className='text-2xl font-bold mb-1'>Chatly</h1>
                            <h3 className='text-lg font-semibold text-white mb-2'>Search Results</h3>
                        </div>

                        {/* Search Bar */}
                        <div className='relative'>
                            <IoIosSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'/>
                            <input 
                                type="text" 
                                placeholder='Search users...' 
                                className='w-full h-12 bg-white rounded-xl pl-12 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                onChange={(e) => setInput(e.target.value)} 
                                value={input}
                                autoFocus
                            />
                            <button
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                onClick={() => {
                                    setSearch(false);
                                    setInput("");
                                    dispatch(setSearchData([]));
                                }}
                            >
                                <RxCross2 className='w-5 h-5'/>
                            </button>
                        </div>

                        <div className='text-blue-100 text-sm mt-3'>
                            {searchData?.length > 0 ? `${searchData.length} users found` : 'No matches found'}
                        </div>
                    </div>
                    
                    {/* Search Results - Scrollable */}
                    <div className='flex-1 overflow-y-auto custom-scrollbar p-4'>
                        {searchData?.length > 0 ? (
                            <div className='space-y-3'>
                                {searchData.map((user) => (
                                    <div
                                        key={user?._id}
                                        className='flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200'
                                        onClick={() => {
                                            dispatch(setSelectedUser(user));
                                            setInput('');
                                            setSearch(false);
                                        }}
                                    >
                                        <div className='relative flex-shrink-0'>
                                            <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100'>
                                                <img src={user?.image || dp} alt="" className='w-full h-full object-cover'/>
                                            </div>
                                            {onlineUsers?.includes(user?._id) && (
                                                <span className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></span>
                                            )}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='font-medium text-gray-900 truncate'>{user?.name || user?.userName}</h3>
                                            <p className='text-sm text-gray-500'>
                                                {onlineUsers?.includes(user?._id) ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-12'>
                                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                    <IoIosSearch className='w-8 h-8 text-gray-400'/>
                                </div>
                                <p className='text-gray-500 font-medium'>No users found</p>
                                <p className='text-sm text-gray-400 mt-1'>Try a different search term</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Header Section - Fixed */}
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white flex-shrink-0'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold mb-1'>Chatly</h1>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-lg font-semibold truncate'>Hi, {userData?.name || "User"}!</h2>
                            <p className='text-blue-100 text-sm'>Ready to chat?</p>
                        </div>
                        <div 
                            className='w-14 h-14 rounded-full overflow-hidden bg-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-shrink-0 ml-4'
                            onClick={() => navigate("/profile")}
                        >
                            <img src={userData?.image || dp} alt="" className='w-full h-full object-cover'/>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className='relative'>
                    {!search ? (
                        <button
                            className='w-full h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 text-white hover:bg-white/30 transition-all duration-200'
                            onClick={() => setSearch(true)}
                        >
                            <IoIosSearch className='w-5 h-5'/>
                            <span className='font-medium'>Search users...</span>
                        </button>
                    ) : (
                        <div className='relative'>
                            <IoIosSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'/>
                            <input 
                                type="text" 
                                placeholder='Search users...' 
                                className='w-full h-12 bg-white rounded-xl pl-12 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                onChange={(e) => setInput(e.target.value)} 
                                value={input}
                                autoFocus
                            />
                            <button
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                onClick={() => {
                                    setSearch(false);
                                    setInput("");
                                    dispatch(setSearchData([]));
                                }}
                            >
                                <RxCross2 className='w-5 h-5'/>
                            </button>
                        </div>
                    )}
                </div>

                {/* Online Users Quick Access */}
                {!search && (
                    <div className='mt-4'>
                        <p className='text-blue-100 text-sm mb-3 font-medium'>Online Now ({otherUsers?.filter(user => onlineUsers?.includes(user._id)).length})</p>
                        <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                            {otherUsers?.filter(user => onlineUsers?.includes(user._id)).slice(0, 8).map((user) => (
                                <div 
                                    key={user._id}
                                    className='relative flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200' 
                                    onClick={() => dispatch(setSelectedUser(user))}
                                >
                                    <div className='w-12 h-12 rounded-full overflow-hidden bg-white shadow-lg'>
                                        <img src={user.image || dp} alt="" className='w-full h-full object-cover'/>
                                    </div>
                                    <span className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Users List - Scrollable with custom scrollbar */}
            <div className='flex-1 overflow-y-auto custom-scrollbar'>
                <div className='p-4 pb-20'>
                    {/* Section Header with user count */}
                    <div className='flex items-center justify-between mb-4 px-2 sticky top-0 bg-gradient-to-b from-white to-gray-50 py-2 z-10'>
                        <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>
                            All Conversations
                        </h3>
                        <span className='text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full'>
                            {otherUsers?.length || 0} users
                        </span>
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className='flex items-center justify-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                            <span className='ml-3 text-gray-500'>Loading users...</span>
                        </div>
                    )}

                    {/* Users list */}
                    <div className='space-y-2'>
                        {otherUsers?.map((user) => (
                            <div 
                                key={user._id}
                                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                    selectedUser?._id === user._id 
                                        ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                                        : 'hover:bg-gray-50 hover:shadow-sm'
                                }`}
                                onClick={() => dispatch(setSelectedUser(user))}
                            >
                                <div className='relative flex-shrink-0'>
                                    <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-100'>
                                        <img src={user.image || dp} alt="" className='w-full h-full object-cover'/>
                                    </div>
                                    {onlineUsers?.includes(user._id) && (
                                        <span className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></span>
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <h3 className={`font-medium truncate ${
                                        selectedUser?._id === user._id ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                        {user.name || user.userName}
                                    </h3>
                                    <p className={`text-sm ${
                                        selectedUser?._id === user._id ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {onlineUsers?.includes(user._id) ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                                {selectedUser?._id === user._id && (
                                    <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    {/* Empty state */}
                    {!loading && otherUsers?.length === 0 && (
                        <div className='flex flex-col items-center justify-center py-12'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <IoIosSearch className='w-8 h-8 text-gray-400'/>
                            </div>
                            <p className='text-gray-500 font-medium'>No conversations yet</p>
                            <p className='text-sm text-gray-400 mt-1 text-center'>Search for users to start chatting</p>
                            <button 
                                className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                                onClick={fetchAllUsers}
                            >
                                Refresh Users
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e0 #f7fafc;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f7fafc;
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 3px;
                    transition: background 0.2s ease;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:active {
                    background: #718096;
                }
            `}</style>
        </div>
    )
}

export default Sidebar