import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api/books" 
const loginSlice=createSlice({
    name:"login",
    initialState:{
        loading:false,
        
        error:"",
        loggedInUser:null
    },
    reducers: {
    logoutUser: (state) => {
      state.loggedInUser = null;
      state.token = null;
      state.role = null;
      state.error = "";
    },
    clearLoginError: (state) => {
    state.error = null;
  }
  },
    
    extraReducers:builder=>{
        builder.addCase(LoginUser.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(LoginUser.fulfilled,(state,action)=>{
            state.loading=false
           
            state.loggedInUser=action.payload
              state.token = action.payload.token;
              state.role = action.payload.user.role;
            state.error=null;
            localStorage.setItem("userId", action.payload.user.userId);
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("name",action.payload.user.name);
  localStorage.setItem("role", action.payload.user.role.trim());
        })
        builder.addCase(LoginUser.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
            state.loggedInUser=null
        })
        
    }
})
const LoginUser=createAsyncThunk("Login",async(credentials,{rejectWithValue})=>{
    try{
    const res=await api.post("Login",credentials)
    return res.data;
    }
    catch(error)
    {
        const msg = error.response?.data || "Login failed";
      return rejectWithValue(msg); 
    }
})
export default  loginSlice.reducer;
export {LoginUser};
export const { logoutUser } = loginSlice.actions;
export const { clearLoginError } = loginSlice.actions;
