import React from 'react'
import Sidebar from '../components/SideBar'
import MessageArea from '../components/MessageArea'
import { useSelector } from 'react-redux'
import getMessage from '../customHooks/getMessages'

const Home = () => {
    let {selectedUser}=useSelector(state=>state.user)
    getMessage()
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
        <Sidebar/>
        <MessageArea/>
    </div>
  )
}

export default Home