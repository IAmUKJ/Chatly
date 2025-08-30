import React, { useRef, useState } from 'react'
import dp from '../assets/dp.webp'
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FiUser, FiMail, FiEdit3, FiSave } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../config';
import { setUserData } from '../redux/userSlice';

function Profile(){
    let {userData} = useSelector(state => state.user)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    let [name, setName] = useState(userData?.name || "")
    let [frontendImage, setFrontendImage] = useState(userData?.image || dp)
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
        try {
            let formData = new FormData()
            formData.append("name", name)
            if(backendImage) {
                formData.append("image", backendImage)
            }
            let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {withCredentials: true})
            setSaving(false)
            dispatch(setUserData(result.data))
            navigate("/")
        } catch(error) {
            console.log(error)
            setSaving(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center p-4'>
            {/* Background Pattern */}
            <div className='absolute inset-0 bg-grid-pattern opacity-5'></div>
            
            {/* Back Button */}
            <div className='fixed top-6 left-6 z-20'>
                <button 
                    className='w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 border border-gray-100'
                    onClick={() => navigate('/')}
                >
                    <IoIosArrowRoundBack className='w-6 h-6 text-gray-600'/>
                </button>
            </div>

            {/* Main Content */}
            <div className='w-full max-w-md mt-16 relative z-10'>
                {/* Profile Card */}
                <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm'>
                    {/* Header */}
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center relative overflow-hidden'>
                        {/* Background Decoration */}
                        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent'></div>
                        <div className='absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full'></div>
                        <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full'></div>
                        
                        <div className='relative z-10'>
                            <h1 className='text-2xl font-bold text-white mb-2'>Edit Profile</h1>
                            <p className='text-blue-100'>Update your information</p>
                        </div>
                    </div>

                    {/* Profile Picture Section */}
                    <div className='px-8 py-6 flex flex-col items-center -mt-16 relative z-10'>
                        <div className='relative group'>
                            <div 
                                className='w-32 h-32 rounded-full overflow-hidden bg-white shadow-2xl ring-4 ring-white cursor-pointer transition-all duration-300 group-hover:scale-105'
                                onClick={() => image.current.click()}
                            >
                                <img 
                                    src={frontendImage} 
                                    alt="Profile" 
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            
                            {/* Camera Overlay */}
                            <div 
                                className='absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all duration-200 group-hover:from-blue-600 group-hover:to-blue-700'
                                onClick={() => image.current.click()}
                            >
                                <IoCameraOutline className='w-5 h-5 text-white'/>
                            </div>

                            {/* Hover Overlay */}
                            <div className='absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer'>
                                <div className='text-white text-center'>
                                    <IoCameraOutline className='w-8 h-8 mx-auto mb-1'/>
                                    <p className='text-sm font-medium'>Change Photo</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4 text-center'>
                            <h2 className='text-xl font-semibold text-gray-900'>{userData?.name || 'User'}</h2>
                            <p className='text-gray-500'>@{userData?.userName || 'username'}</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className='px-8 pb-8'>
                        <form className='space-y-6' onSubmit={handleProfile}>
                            <input 
                                type="file" 
                                accept='image/*' 
                                ref={image} 
                                hidden 
                                onChange={handleImage}
                            />

                            {/* Name Input */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 flex items-center'>
                                    <FiEdit3 className='w-4 h-4 mr-2 text-blue-600'/>
                                    Display Name
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FiUser className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name" 
                                        className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300'
                                        onChange={(e) => setName(e.target.value)} 
                                        value={name}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Username Input (Read Only) */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 flex items-center'>
                                    <FiUser className='w-4 h-4 mr-2 text-gray-400'/>
                                    Username
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <span className='text-gray-400'>@</span>
                                    </div>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        className='w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed'
                                        value={userData?.userName || ''}
                                    />
                                </div>
                                <p className='text-xs text-gray-500'>Username cannot be changed</p>
                            </div>

                            {/* Email Input (Read Only) */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 flex items-center'>
                                    <FiMail className='w-4 h-4 mr-2 text-gray-400'/>
                                    Email Address
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FiMail className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input 
                                        type="email" 
                                        readOnly 
                                        className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed'
                                        value={userData?.email || ''}
                                    />
                                </div>
                                <p className='text-xs text-gray-500'>Email address cannot be changed</p>
                            </div>

                            {/* Save Button */}
                            <button 
                                type="submit"
                                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mt-8'
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <BiLoaderAlt className='animate-spin h-5 w-5 mr-2' />
                                        Saving Changes...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className='h-5 w-5 mr-2' />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Additional Info */}
                <div className='mt-6 text-center'>
                    <p className='text-sm text-gray-500'>
                        Profile changes will be visible to all your contacts
                    </p>
                </div>
            </div>

            {/* Floating Elements */}
            <div className='absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse'></div>
            <div className='absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000'></div>
            <div className='absolute bottom-32 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500'></div>
        </div>
    )
}

export default Profile