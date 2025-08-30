import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../config'
import { setUserData } from '../redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi'
import { BiLoaderAlt } from 'react-icons/bi'

function SignUp() {
    let navigate = useNavigate()
    let [show, setShow] = useState(false)
    let [userName, setUserName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState("")
    let dispatch = useDispatch()
    let {userData} = useSelector(state => state.user)

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`, {userName, email, password}, {withCredentials: true})
            dispatch(setUserData(result.data))
            navigate("/profile")
            setUserName("")
            setEmail("")
            setPassword("")
            setLoading(false)
            setErr("")
        } catch(error) {
            console.log(error)
            setLoading(false)
            setErr(error?.response?.data?.message)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4'>
            {/* Background Pattern */}
            <div className='absolute inset-0 bg-grid-pattern opacity-5'></div>
            
            <div className='w-full max-w-md relative z-10'>
                {/* Main Card */}
                <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm'>
                    {/* Header Section */}
                    <div className='bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center relative overflow-hidden'>
                        {/* Background Decoration */}
                        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent'></div>
                        <div className='absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full'></div>
                        <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full'></div>
                        
                        {/* Content */}
                        <div className='relative z-10'>
                            {/* Logo */}
                            <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm'>
                                <span className='text-2xl text-white'>💬</span>
                            </div>
                            
                            {/* Title */}
                            <h1 className='text-3xl font-bold text-white mb-2'>
                                Join Chatly
                            </h1>
                            <p className='text-blue-100 text-lg'>
                                Create your account to get started
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className='px-8 py-8'>
                        <form className='space-y-6' onSubmit={handleSignUp}>
                            {/* Username Input */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 block'>
                                    Username
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FiUser className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder='Choose a username' 
                                        className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300'
                                        onChange={(e) => setUserName(e.target.value)} 
                                        value={userName}
                                        required
                                    />
                                </div>
                                <p className='text-xs text-gray-500'>This will be your unique identifier</p>
                            </div>

                            {/* Email Input */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 block'>
                                    Email Address
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FiMail className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input 
                                        type="email" 
                                        placeholder='Enter your email' 
                                        className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300'
                                        onChange={(e) => setEmail(e.target.value)} 
                                        value={email}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className='space-y-2'>
                                <label className='text-sm font-medium text-gray-700 block'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FiLock className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <input 
                                        type={show ? "text" : "password"}
                                        placeholder='Create a password' 
                                        className='w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-300'
                                        onChange={(e) => setPassword(e.target.value)} 
                                        value={password}
                                        required
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200'
                                        onClick={() => setShow(prev => !prev)}
                                    >
                                        {show ? <FiEyeOff className='h-5 w-5' /> : <FiEye className='h-5 w-5' />}
                                    </button>
                                </div>
                                <p className='text-xs text-gray-500'>Must be at least 6 characters long</p>
                            </div>

                            {/* Error Message */}
                            {err && (
                                <div className='bg-red-50 border border-red-200 rounded-xl p-3'>
                                    <div className='flex items-center'>
                                        <div className='flex-shrink-0'>
                                            <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                                            </svg>
                                        </div>
                                        <div className='ml-3'>
                                            <p className='text-sm text-red-800'>{err}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit"
                                className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center'
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <BiLoaderAlt className='animate-spin h-5 w-5 mr-2' />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus className='h-5 w-5 mr-2' />
                                        Create Account
                                    </>
                                )}
                            </button>

                            {/* Login Link */}
                            <div className='text-center pt-4'>
                                <p className='text-gray-600'>
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        className='text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200'
                                        onClick={() => navigate("/login")}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Terms and Privacy */}
                <div className='text-center mt-6'>
                    <p className='text-xs text-gray-500 leading-relaxed'>
                        By creating an account, you agree to our{' '}
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium'>Terms of Service</span>{' '}
                        and{' '}
                        <span className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium'>Privacy Policy</span>
                    </p>
                </div>

                {/* Features Preview */}
                <div className='mt-8 grid grid-cols-3 gap-4'>
                    <div className='text-center p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50'>
                        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                            <span className='text-lg'>🚀</span>
                        </div>
                        <p className='text-xs text-gray-600 font-medium'>Fast Setup</p>
                    </div>
                    <div className='text-center p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50'>
                        <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                            <span className='text-lg'>🔒</span>
                        </div>
                        <p className='text-xs text-gray-600 font-medium'>Secure Chat</p>
                    </div>
                    <div className='text-center p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50'>
                        <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                            <span className='text-lg'>💬</span>
                        </div>
                        <p className='text-xs text-gray-600 font-medium'>Easy Connect</p>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className='absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse'></div>
            <div className='absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000'></div>
            <div className='absolute bottom-32 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500'></div>
        </div>
    )
}

export default SignUp