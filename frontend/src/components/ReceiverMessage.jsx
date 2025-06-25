import React, { useEffect, useRef } from 'react'
import dp from '../assets/dp.webp'
import { useSelector } from 'react-redux'
function ReceiverMessage({image,message}) {
    let scroll=useRef()
    let {selectedUser}=useSelector(state=>state.user)
    useEffect(()=>{
        scroll?.current.scrollIntoView({behavior:"smooth"})
    },[message,image])
    const handleImageScroll=()=>{
        scroll?.current.scrollIntoView({behavior:"smooth"})
    }
  return (
    <div className='flex items-start gap-[10px]'>
        <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg' >
            <img src={selectedUser.image || dp} alt="" className='h-[100%]'/>
        </div> 
        <div className='w-fit max-[500px] px-[20px] py-[20px] bg-[#20c7ff] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0  shadow-gray-400 shadow-lg gap-[10px] flex flex-col' ref={scroll}>
            {image && <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll}/> }
            {message && <span >{message}</span> }
        </div>
        
        
    </div>
  )
}

export default ReceiverMessage