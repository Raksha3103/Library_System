import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api/books" 

const borrowSlice = createSlice({
    name:"borrow",
    initialState:{
        list:[],
        loading:false,
        error:"null"
    },
    reducers: {
    clearMessages(state) {
      state.successMessage = "";
      state.errorMessage = "";
    }
  },
    extraReducers:builder=>{
        builder.addCase(fetchBorrows.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(fetchBorrows.fulfilled,(state,action)=>{
            state.loading=false
            state.list=action.payload 
            state.error=''
        })
        builder.addCase(fetchBorrows.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
            state.list=null
        })
        .addCase(bookBorrowed.fulfilled, (state) => {
        state.successMessage = "Book Borrowed Successfully!";
        state.errorMessage = "";
      })
      .addCase(bookBorrowed.rejected, (state, action) => {
        state.errorMessage = action.payload;
      })

      .addCase(bookReturned.fulfilled, (state) => {
        state.successMessage = "Book Returned Successfully! ";
        state.errorMessage = "";
      })
      .addCase(bookReturned.rejected, (state, action) => {
        state.errorMessage = action.payload;
      })
       .addCase(fetchAdminBorrows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminBorrows.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = "";
      })
      .addCase(fetchAdminBorrows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      })
    }

}
)
const fetchAdminBorrows = createAsyncThunk("borrows/adminHistory",async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/Borrow/history");
      return res.data;
    } catch (error) {
      const msg = error.response?.data || "Unable to load borrow history";
      return rejectWithValue(msg);
    }
  }
);


const fetchBorrows=createAsyncThunk("borrows/history",async(userId,{rejectWithValue})=>{
    try {
    const res=await api.get(`/Borrow?userId=${userId}`);
    return res.data
    }
    catch (error) {
         const msg = error.response?.data || "Unable to load borrow history";
    return rejectWithValue(msg);
  }
});

const bookBorrowed=createAsyncThunk("borrows/borrowBook",async({ bookId, userId },{rejectWithValue})=>{
  
  try {  const res = await api.post("/Borrow", { BookId: bookId, UserId: userId });

    return res.data
}
catch (error) {
      const msg = error.response?.data || "Unable to borrow book";
    return rejectWithValue(msg);
    }
})

const bookReturned=createAsyncThunk("borrows/returnBook",async({ bookId, userId },{rejectWithValue})=>{
  try {
    const res = await api.post("/Borrow/return", { BookId: bookId, UserId: userId });

    return res.data}
    catch (error) {
      const msg = error.response?.data || "Unable to borrow book";
    return rejectWithValue(msg);
    }

})
export default borrowSlice.reducer;
export {fetchBorrows};
export {bookBorrowed};
export {bookReturned};
export const { clearMessages } = borrowSlice.actions;
export { fetchAdminBorrows };