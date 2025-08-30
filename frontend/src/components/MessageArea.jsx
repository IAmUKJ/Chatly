import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from '../assets/dp.webp'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react'
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import { serverUrl } from '../config';
import { useRef } from 'react';
import axios from 'axios';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
    let navigate = useNavigate()
    let {selectedUser, userData, socket} = useSelector(state => state.user)
    let dispatch = useDispatch()
    let [showPicker, setShowPicker] = useState(false)
    let [input, setInput] = useState("")
    let [frontendImage, setFrontendImage] = useState(null)
    let [backendImage, setBackendImage] = useState(null)
    let image = useRef()
    let {messages} = useSelector(state => state.message)

    const handleImage = (e) => {
        let file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if(input.length == 0 && backendImage == null) {
            return
        }
        try {
            let formData = new FormData()
            formData.append("message", input)
            if(backendImage) {
                formData.append("image", backendImage)
            }
            let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, {withCredentials: true})
            dispatch(setMessages([...messages, result.data]))
            console.log(result.data)
            setInput("")
            setFrontendImage(null)
            setBackendImage(null)
        } catch(error) {
            console.log(error)
        }
    }

    const onEmojiClick = (emojiData) => {
        setInput(prevInput => prevInput + emojiData.emoji)
        setShowPicker(false)
    }

    useEffect(() => {
        socket.on("newMessage", (mess) => {
            dispatch(setMessages([...messages, mess]))
        })
        return () => socket.off("newMessage")
    }, [messages, setMessages])

    return (
        <div className={`lg:w-[70%] ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200`}>
            {selectedUser && 
                <div className='w-full h-[100vh] flex flex-col relative'>
                    {/* Header */}
                    <div className='w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg backdrop-blur-sm border-b border-blue-500/20'>
                        <div className='flex items-center gap-4 px-4 py-4'>
                            {/* Back Button */}
                            <button 
                                className='lg:hidden p-2 rounded-full hover:bg-white/20 transition-colors duration-200'
                                onClick={() => dispatch(setSelectedUser(null))}
                            >
                                <IoIosArrowRoundBack className='w-6 h-6 text-white'/>
                            </button>

                            {/* User Info */}
                            <div 
                                className='flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors duration-200'
                                onClick={() => navigate("/profile")}
                            >
                                <div className='relative'>
                                    <div className='w-12 h-12 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-white/20'>
                                        <img src={selectedUser?.image || dp} alt="" className='w-full h-full object-cover'/>
                                    </div>
                                    <div className='absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm'></div>
                                </div>
                                <div className='flex flex-col'>
                                    <h1 className='text-white font-semibold text-lg leading-tight'>{selectedUser?.name || "User"}</h1>
                                    <p className='text-blue-100 text-sm'>Online</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className='flex-1 overflow-auto p-4 space-y-2 bg-gradient-to-b from-gray-50/50 to-white/50'>
                        {/* Emoji Picker */}
                        {showPicker && (
                            <div className='absolute bottom-24 left-4 z-50 shadow-2xl rounded-lg overflow-hidden'>
                                <EmojiPicker 
                                    width={280} 
                                    height={400} 
                                    onEmojiClick={onEmojiClick}
                                    theme="light"
                                />
                            </div>
                        )}

                        {/* Messages */}
                        {messages && messages.map((mess, index) => (
                            <div key={index}>
                                {mess.sender == userData._id ? 
                                    <SenderMessage image={mess.image} message={mess.message}/> : 
                                    <ReceiverMessage image={mess.image} message={mess.message}/>
                                }
                            </div>
                        ))}

                        {/* Empty State */}
                        {(!messages || messages.length === 0) && (
                            <div className='flex flex-col items-center justify-center h-full text-center py-12'>
                                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                                    <span className='text-2xl'>💬</span>
                                </div>
                                <h3 className='text-lg font-medium text-gray-700 mb-2'>Start a conversation</h3>
                                <p className='text-gray-500'>Send a message to begin chatting with {selectedUser?.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className='p-4 bg-white border-t border-gray-200'>
                        {/* Image Preview */}
                        {frontendImage && (
                            <div className='mb-3 flex justify-end'>
                                <div className='relative inline-block'>
                                    <img 
                                        src={frontendImage} 
                                        alt="Preview" 
                                        className='w-20 h-20 object-cover rounded-lg shadow-lg border-2 border-blue-200'
                                    />
                                    <button
                                        className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors'
                                        onClick={() => {
                                            setFrontendImage(null);
                                            setBackendImage(null);
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Input Form */}
                        <form 
                            className='flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 shadow-sm border border-gray-200 focus-within:border-blue-300 focus-within:shadow-md transition-all duration-200' 
                            onSubmit={handleSendMessage}
                        >
                            {/* Emoji Button */}
                            <button
                                type="button"
                                className='p-2 rounded-full hover:bg-gray-200 transition-colors duration-200'
                                onClick={() => setShowPicker(prev => !prev)}
                            >
                                <RiEmojiStickerLine className='w-5 h-5 text-gray-600 hover:text-blue-600'/>
                            </button>

                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                accept='image/*' 
                                ref={image} 
                                hidden 
                                onChange={handleImage}
                            />

                            {/* Text Input */}
                            <input 
                                type="text" 
                                placeholder='Type a message...' 
                                className='flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 py-2'
                                onChange={(e) => setInput(e.target.value)} 
                                value={input}
                            />

                            {/* Image Button */}
                            <button
                                type="button"
                                className='p-2 rounded-full hover:bg-gray-200 transition-colors duration-200'
                                onClick={() => image.current.click()}
                            >
                                <FaImages className='w-5 h-5 text-gray-600 hover:text-blue-600'/>
                            </button>

                            {/* Send Button */}
                            {(input.length > 0 || backendImage != null) && (
                                <button
                                    type="submit"
                                    className='p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'
                                >
                                    <RiSendPlane2Fill className='w-5 h-5'/>
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            }

            {/* Welcome Screen */}
            {!selectedUser && 
                <div className='w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50'>
                    <div className='text-center space-y-6 p-8'>
                        {/* Logo/Icon */}
                        <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg'>
                            <span className='text-4xl text-white'>💬</span>
                        </div>
                        
                        {/* Welcome Text */}
                        <div className='space-y-2'>
                            <h1 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                                Welcome to Chatly
                            </h1>
                            <p className='text-xl text-gray-600 font-medium'>
                                Chat Friendly & Stay Connected
                            </p>
                        </div>
                        
                        {/* Description */}
                        <div className='max-w-md mx-auto space-y-4'>
                            <p className='text-gray-500 leading-relaxed'>
                                Select a conversation from the sidebar to start chatting with your friends and colleagues.
                            </p>
                            
                            {/* Features */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8'>
                                <div className='text-center p-4'>
                                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                                        <span className='text-xl'>🚀</span>
                                    </div>
                                    <p className='text-sm text-gray-600 font-medium'>Fast Messaging</p>
                                </div>
                                <div className='text-center p-4'>
                                    <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                                        <span className='text-xl'>🔒</span>
                                    </div>
                                    <p className='text-sm text-gray-600 font-medium'>Secure & Private</p>
                                </div>
                                <div className='text-center p-4'>
                                    <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                                        <span className='text-xl'>📱</span>
                                    </div>
                                    <p className='text-sm text-gray-600 font-medium'>Mobile Friendly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div> 
    )
}

export default MessageArea