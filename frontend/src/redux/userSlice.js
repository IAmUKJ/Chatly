import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        otherUsers:null,
        selectedUser:null,
        socket:null,
        onlineUsers:null,
        searchData:[]
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setOtherUsersData:(state,action)=>{
            state.otherUsers=action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
        },
        setSocket:(state,action)=>{
            state.socket=action.payload
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
        },
        setSearchData: (state, action) => {
            const data = action.payload;
            if (Array.isArray(data)) {
                state.searchData = data;
            } else if (data) {
                state.searchData = [data]; // wrap single user object into array
            } else {
                state.searchData = []; // fallback to empty array
            }
        }
    }
})

export const {setUserData, setOtherUsersData, setSelectedUser, setSocket, setOnlineUsers, setSearchData}=userSlice.actions

export default userSlice.reducer