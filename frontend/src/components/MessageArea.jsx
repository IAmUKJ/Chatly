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
    let messagesEndRef = useRef(null)
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        socket.on("newMessage", (mess) => {
            dispatch(setMessages([...messages, mess]))
        })
        return () => socket.off("newMessage")
    }, [messages, setMessages])

    return (
        <div className={`lg:w-[70%] ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-gradient-to-b from-gray-50 to-white border-l border-gray-200`}>
            {selectedUser && 
                <div className='w-full h-screen flex flex-col relative overflow-hidden'>
                    {/* Header - Fixed */}
                    <div className='w-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg backdrop-blur-sm border-b border-blue-500/20 flex-shrink-0 z-10'>
                        <div className='flex items-center gap-4 px-4 py-4'>
                            {/* Back Button */}
                            <button 
                                className='lg:hidden p-2 rounded-full hover:bg-white/20 transition-colors duration-200 flex-shrink-0'
                                onClick={() => dispatch(setSelectedUser(null))}
                            >
                                <IoIosArrowRoundBack className='w-6 h-6 text-white'/>
                            </button>

                            {/* User Info */}
                            <div 
                                className='flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors duration-200 flex-1 min-w-0'
                                onClick={() => navigate("/profile")}
                            >
                                <div className='relative flex-shrink-0'>
                                    <div className='w-12 h-12 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-white/20'>
                                        <img src={selectedUser?.image || dp} alt="" className='w-full h-full object-cover'/>
                                    </div>
                                </div>
                                <div className='flex flex-col min-w-0'>
                                    <h1 className='text-white font-semibold text-lg leading-tight truncate'>{selectedUser?.name || "User"}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area - Scrollable */}
                    <div className='flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50 relative'>
                        {/* Emoji Picker */}
                        {showPicker && (
                            <div className='absolute bottom-4 left-4 z-50 shadow-2xl rounded-lg overflow-hidden'>
                                <EmojiPicker 
                                    width={280} 
                                    height={400} 
                                    onEmojiClick={onEmojiClick}
                                    theme="light"
                                />
                            </div>
                        )}

                        {/* Messages Container */}
                        <div className='p-4 space-y-3 min-h-full flex flex-col justify-end'>
                            {/* Empty State */}
                            {(!messages || messages.length === 0) && (
                                <div className='flex flex-col items-center justify-center flex-1 text-center py-12'>
                                    <div className='w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-lg'>
                                        <span className='text-3xl'>💬</span>
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-700 mb-3'>Start a conversation</h3>
                                    <p className='text-gray-500 max-w-sm leading-relaxed'>Send a message to begin chatting with <span className='font-medium text-blue-600'>{selectedUser?.name}</span></p>
                                    <div className='mt-6 flex items-center gap-2 text-sm text-gray-400'>
                                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                        <span>Messages are end-to-end encrypted</span>
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            {messages && messages.map((mess, index) => (
                                <div key={index} className='animate-fadeIn'>
                                    {mess.sender == userData._id ? 
                                        <SenderMessage image={mess.image} message={mess.message}/> : 
                                        <ReceiverMessage image={mess.image} message={mess.message}/>
                                    }
                                </div>
                            ))}
                            
                            {/* Scroll anchor */}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Area - Fixed */}
                    <div className='bg-white border-t border-gray-200 flex-shrink-0'>
                        {/* Image Preview */}
                        {frontendImage && (
                            <div className='px-4 pt-4'>
                                <div className='flex justify-end'>
                                    <div className='relative inline-block'>
                                        <img 
                                            src={frontendImage} 
                                            alt="Preview" 
                                            className='w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-blue-200'
                                        />
                                        <button
                                            className='absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg'
                                            onClick={() => {
                                                setFrontendImage(null);
                                                setBackendImage(null);
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input Form */}
                        <div className='p-4'>
                            <form 
                                className='flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 focus-within:border-blue-300 focus-within:shadow-md transition-all duration-200' 
                                onSubmit={handleSendMessage}
                            >
                                {/* Emoji Button */}
                                <button
                                    type="button"
                                    className='p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 flex-shrink-0'
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
                                    className='flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 py-1 text-sm'
                                    onChange={(e) => setInput(e.target.value)} 
                                    value={input}
                                />

                                {/* Image Button */}
                                <button
                                    type="button"
                                    className='p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 flex-shrink-0'
                                    onClick={() => image.current.click()}
                                >
                                    <FaImages className='w-5 h-5 text-gray-600 hover:text-blue-600'/>
                                </button>

                                {/* Send Button */}
                                {(input.length > 0 || backendImage != null) && (
                                    <button
                                        type="submit"
                                        className='p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex-shrink-0'
                                    >
                                        <RiSendPlane2Fill className='w-4 h-4'/>
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            }

            {/* Welcome Screen */}
            {!selectedUser && 
                <div className='w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 overflow-hidden relative'>
                    {/* Background Elements */}
                    <div className='absolute inset-0 overflow-hidden'>
                        <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-xl'></div>
                        <div className='absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-200/20 rounded-full blur-xl'></div>
                        <div className='absolute top-1/2 right-1/3 w-24 h-24 bg-pink-200/20 rounded-full blur-xl'></div>
                    </div>

                    <div className='text-center space-y-8 p-8 relative z-10 max-w-2xl mx-auto'>
                        {/* Logo/Icon */}
                        <div className='w-28 h-28 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-blue-100'>
                            <span className='text-5xl text-white'>💬</span>
                        </div>
                        
                        {/* Welcome Text */}
                        <div className='space-y-4'>
                            <h1 className='text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight'>
                                Welcome to Chatly
                            </h1>
                            <p className='text-xl lg:text-2xl text-gray-600 font-medium'>
                                Chat Friendly & Stay Connected
                            </p>
                        </div>
                        
                        {/* Description */}
                        <div className='max-w-lg mx-auto space-y-6'>
                            <p className='text-gray-500 leading-relaxed text-lg'>
                                Select a conversation from the sidebar to start chatting with your friends and colleagues.
                            </p>
                            
                            {/* Features */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12'>
                                <div className='text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                    <div className='w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                                        <span className='text-2xl'>🚀</span>
                                    </div>
                                    <h3 className='font-semibold text-gray-800 mb-2'>Fast Messaging</h3>
                                    <p className='text-sm text-gray-600'>Lightning-fast delivery</p>
                                </div>
                                <div className='text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                    <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                                        <span className='text-2xl'>🔒</span>
                                    </div>
                                    <h3 className='font-semibold text-gray-800 mb-2'>Secure & Private</h3>
                                    <p className='text-sm text-gray-600'>End-to-end encryption</p>
                                </div>
                                <div className='text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                                    <div className='w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                                        <span className='text-2xl'>📱</span>
                                    </div>
                                    <h3 className='font-semibold text-gray-800 mb-2'>Mobile Friendly</h3>
                                    <p className='text-sm text-gray-600'>Works on any device</p>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className='mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50'>
                                <p className='text-sm text-gray-600 mb-2'>💡 Pro Tip</p>
                                <p className='text-gray-700 font-medium'>Use keyboard shortcuts: Press 'Ctrl + K' to quickly search for users!</p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                /* Custom scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div> 
    )
}

export default MessageArea