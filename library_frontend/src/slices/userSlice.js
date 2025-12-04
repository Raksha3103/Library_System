import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api/books" 
const userSlice=createSlice({
    name:"user",
    initialState:{
        loading:false,
        list:[],
        error:"",
        users:null,
        successMessage: "",
    errorMessage: ""
    },
     reducers: {
    clearMessages(state) {
      state.successMessage = "";
      state.errorMessage = "";
    }
  },
    extraReducers:builder=>{
        builder.addCase(fetchUsers.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(fetchUsers.fulfilled,(state,action)=>{
            state.loading=false
            state.list=action.payload
            state.error=''
        })
        builder.addCase(fetchUsers.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
            state.list=null     
        })
        .addCase(addUser.fulfilled,(state,action)=>{
            //state.list.push(action.payload);
            state.successMessage = "User added successfully!";
            state.errorMessage = "";
        })
        .addCase(addUser.rejected,(state,action)=>{
            state.errorMessage = action.payload;
            state.successMessage = "";
        } )  
    }
})

const fetchUsers=createAsyncThunk("users/getAll",async()=>{
    const res=await api.get("/Users/All");
    return res.data;
})
export const addUser = createAsyncThunk("users/add", async (users,{rejectWithValue}) => {
    try{const res = await api.post("/Register", users);
    return res.data;
    }
    catch (error) {
        const msg = error.response?.data || "Unable to add user";
        return rejectWithValue(msg);
    }   
});
export const { clearMessages } = userSlice.actions; 
export default userSlice.reducer;
export { fetchUsers }; 
