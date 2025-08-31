import React, { useRef, useState } from 'react'
import dp from '../assets/dp.webp'
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../config';
import { setUserData } from '../redux/userSlice';

function Profile(){
    let {userData} = useSelector(state => state.user)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    let [name, setName] = useState(userData.name || "")
    let [frontendImage, setFrontendImage] = useState(userData.image || dp)
    let [backendImage, setBackendImage] = useState(null)
    let image = useRef()
    let [saving, setSaving] = useState(false)
    
    const handleImage = (e) => {
        let file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleProfile = async (e) => {
        setSaving(true)
        e.preventDefault()
        try{
            let formData = new FormData()
            formData.append("name", name)
            if(backendImage){
                formData.append("image", backendImage)
            }
            let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {withCredentials: true})
            setSaving(false)
            dispatch(setUserData(result.data))
            navigate("/")
        }
        catch(error){
            console.log(error)
            setSaving(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden'>
            {/* Animated background elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-200/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            {/* Back button */}
            <div className='absolute top-6 left-6 z-10'>
                <button 
                    onClick={() => navigate('/')}
                    className='group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white border border-white/20'
                >
                    <IoIosArrowRoundBack className='w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300' />
                    <span className='text-gray-600 group-hover:text-gray-800 font-medium hidden sm:block'>Back</span>
                </button>
            </div>

            {/* Main content */}
            <div className='flex flex-col items-center justify-center min-h-screen px-4 py-20'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2'>
                        Edit Profile
                    </h1>
                    <p className='text-gray-600 text-lg'>Update your information and profile picture</p>
                </div>

                {/* Profile card */}
                <div className='w-full max-w-md'>
                    <div className='bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden'>
                        {/* Card background gradient */}
                        <div className='absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 pointer-events-none'></div>
                        
                        {/* Profile image section */}
                        <div className='relative z-10 flex flex-col items-center mb-8'>
                            <div className='relative group cursor-pointer' onClick={() => image.current.click()}>
                                <div className='relative w-32 h-32 md:w-40 md:h-40'>
                                    {/* Image container with gradient border */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-full p-1 group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-indigo-500 transition-all duration-300'>
                                        <div className='w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center'>
                                            <img 
                                                src={frontendImage} 
                                                alt="Profile" 
                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Camera overlay */}
                                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full flex items-center justify-center transition-all duration-300'>
                                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                            <div className='bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg'>
                                                <IoCameraOutline className='w-6 h-6 text-gray-700' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <p className='text-sm text-gray-500 mt-3 text-center'>Click to change profile picture</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleProfile} className='relative z-10 space-y-6'>
                            <input 
                                type="file" 
                                accept='image/*' 
                                ref={image} 
                                hidden 
                                onChange={handleImage}
                            />
                            
                            {/* Name input */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 block'>Display Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name" 
                                    className='w-full h-12 px-4 bg-white/60 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl focus:border-blue-400 focus:bg-white/80 transition-all duration-300 text-gray-800 placeholder-gray-400 shadow-sm focus:shadow-md outline-none'
                                    onChange={(e) => setName(e.target.value)} 
                                    value={name}
                                />
                            </div>

                            {/* Username input (readonly) */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 block'>Username</label>
                                <input 
                                    type="text"  
                                    readOnly 
                                    className='w-full h-12 px-4 bg-gray-50/60 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl text-gray-500 shadow-sm cursor-not-allowed'
                                    value={userData?.userName}
                                />
                            </div>

                            {/* Email input (readonly) */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 block'>Email</label>
                                <input 
                                    type="email" 
                                    readOnly 
                                    className='w-full h-12 px-4 bg-gray-50/60 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl text-gray-500 shadow-sm cursor-not-allowed'
                                    value={userData?.email}
                                />
                            </div>

                            {/* Save button */}
                            <div className='pt-4'>
                                <button 
                                    type='submit'
                                    className='w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:shadow-md transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden'
                                    disabled={saving}
                                >
                                    {/* Button shine effect */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700'></div>
                                    
                                    <span className='relative z-10'>
                                        {saving ? (
                                            <div className='flex items-center justify-center gap-2'>
                                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                                Saving...
                                            </div>
                                        ) : (
                                            "Save Profile"
                                        )}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer text */}
                <p className='text-gray-500 text-sm mt-8 text-center max-w-md'>
                    Your profile information helps others recognize and connect with you
                </p>
            </div>
        </div>
    )
}

export default Profile