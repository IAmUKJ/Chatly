import React, { useRef, useEffect } from 'react'
import dp from '../assets/dp.webp'
import { useSelector } from 'react-redux'

function SenderMessage({image, message}) {
    let scroll = useRef()
    let {userData} = useSelector(state => state.user)
    
    useEffect(() => {
        scroll?.current?.scrollIntoView({behavior: "smooth"})
    }, [message, image])
    
    const handleImageScroll = () => {
        scroll?.current?.scrollIntoView({behavior: "smooth"})
    }
    
    return (
        <div className='flex items-end justify-end gap-3 mb-4 group' ref={scroll}>
            {/* Message Bubble */}
            <div className='flex flex-col items-end max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl'>
                {/* Message Content */}
                <div className='relative bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02] transform'>
                    {/* Message Tail */}
                    <div className='absolute top-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-blue-600 transform translate-x-[12px]'></div>
                    
                    {/* Image Content */}
                    {image && (
                        <div className='mb-2 last:mb-0'>
                            <div className='relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm'>
                                <img 
                                    src={image} 
                                    alt="" 
                                    className='w-full max-w-[200px] sm:max-w-[250px] h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer' 
                                    onLoad={handleImageScroll}
                                    loading="lazy"
                                />
                                {/* Image Overlay for Better Visibility */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg'></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Text Content */}
                    {message && (
                        <div className='text-sm sm:text-base leading-relaxed break-words'>
                            {message}
                        </div>
                    )}
                    
                    {/* Subtle glow effect */}
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-2xl rounded-tr-md blur-sm -z-10 opacity-50'></div>
                </div>
                
                {/* Timestamp (you can add this later if needed) */}
                <div className='text-xs text-gray-400 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    {/* You can add timestamp here: new Date().toLocaleTimeString() */}
                </div>
            </div>
            
            {/* User Avatar */}
            <div className='flex-shrink-0 relative'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ring-2 ring-white hover:ring-blue-200'>
                    <img 
                        src={userData?.image || dp} 
                        alt="" 
                        className='w-full h-full object-cover hover:scale-110 transition-transform duration-200'
                    />
                </div>
                
                {/* Online indicator (optional) */}
                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm'></div>
            </div>
        </div>
    )
}

export default SenderMessage