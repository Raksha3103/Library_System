
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000/requests";

export const fetchRequests = createAsyncThunk(
  "requests/fetchRequests",
  async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
  }
);


export const addRequest = createAsyncThunk(
  "requests/addRequest",
  async (newReq, { getState, rejectWithValue }) => {
   // const { userId, bookId, bookTitle, type } = newReq;

   
    const res = await axios.post("http://localhost:5000/requests", {
      ...newReq,
      status: "Pending",
      reqId: Date.now(),
    });

    return res.data;
  }
);


export const approveRequest = createAsyncThunk("requests/approveRequest",async (req,{ rejectWithValue }) => {
   try {
    const res = await axios.patch(`${BASE_URL}/${req.id}`, { status: "Approved" });
    return { ...res.data, req };
   }
   catch (err) {
      return rejectWithValue(err.response?.data || "Approval failed");
    }
  }
);


export const rejectRequest = createAsyncThunk(
  "requests/rejectRequest",
  
  async (req,{ rejectWithValue }) => {
    try{
    const res = await axios.patch(`${BASE_URL}/${req.id}`, { status: "Rejected" });
   return { ...res.data, req };
  }
  catch(err)
  {
    return rejectWithValue(err.response?.data || "Rejection failed");
  }
  }
);

const requestsSlice = createSlice({
  name: "requests",
  initialState: { requests: [], notifications: [] },
  reducers: {
     clearUserNotifications: (state, action) => {
    state.notifications = state.notifications.filter(n => n.userId !== action.payload);
     },clearMessages: (state) => {
            state.errorMessage = null;
            state.successMessage = null;
        }
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
        // state.successMessage = "Request added successfully!";
      })
      .addCase(addRequest.rejected, (state, action) => {
  state.notifications.push({
    userId: action.meta.arg.userId,
    
  }); 
})
      .addCase(approveRequest.fulfilled, (state, action) => {
        const idx = state.requests.findIndex(r => r.id === action.payload.id);
        state.requests[idx] = action.payload;
         state.notifications.push({
        userId: action.meta.arg.userId,
      
        error: false
      })
       state.successMessage=`Request for "${action.meta.arg.bookTitle}" has been approved`;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const idx = state.requests.findIndex(r => r.id === action.payload.id);
        state.requests[idx] = action.payload;
        state.notifications.push({
        userId: action.meta.arg.userId,
     
        error: false
      })
      state.errorMessage=`Request for "${action.meta.arg.bookTitle}" has been rejected`;
      })
      .addCase(approveRequest.rejected, (state, action) => {
  state.notifications.push({
    userId: action.meta.arg.userId,
    message: ` Approval failed for "${action.meta.arg.bookTitle}"`,
    error: true
  })
   state.errorMessage=` Approval failed for "${action.meta.arg.bookTitle}"`;
})

.addCase(rejectRequest.rejected, (state, action) => {
  state.notifications.push({
    userId: action.meta.arg.userId,
    message: ` Rejection failed for "${action.meta.arg.bookTitle}"`,
    error: true
  })
  state.errorMessage=` Rejection failed for "${action.meta.arg.bookTitle}"`;
});

  },
});

export default requestsSlice.reducer;

export const {clearUserNotifications} = requestsSlice.actions;
export const { clearMessages } = requestsSlice.actions;


// import { createSlice } from "@reduxjs/toolkit";

// const requestsSlice = createSlice({
//   name: "requests",
//   initialState: {
//       requests: JSON.parse(localStorage.getItem("requests")) || [],
//     notifications: [],// {reqId, userId, bookId, type, status}
//   },
//   reducers: {
//     addRequest: (state, action) => {
//       state.requests.push({
//         ...action.payload,
//         reqId: Date.now(),
//         status: "Pending",
//          bookTitle: action.payload.bookTitle, 
//          userName: action.payload.userName,
//       });
//       localStorage.setItem("requests", JSON.stringify(state.requests));
//     },
//     approveRequest: (state, action) => {
//       const req = state.requests.find(r => r.reqId === action.payload.reqId);
//       if (req) req.status = "Approved";
//         state.notifications.push({
//           userId: req.userId,
//           message: `${req.type} request for "${req.bookTitle}" has been approved!`,
//         });
//          localStorage.setItem("requests", JSON.stringify(state.requests));
//     },
//     rejectRequest: (state, action) => {
//       const req = state.requests.find(r => r.reqId === action.payload.reqId);
//       if (req) req.status = "Rejected";
//       localStorage.setItem("requests", JSON.stringify(state.requests));
//         state.notifications.push({
//           userId: req.userId,
//           message: `${req.type} request for "${req.bookTitle}" has been rejected!`,
//         });
//     },
//      clearUserNotifications: (state, action) => {
//       const userId = action.payload;
//       state.notifications = state.notifications.filter(n => n.userId !== userId);
//     },
//   },
// });

// export const { addRequest, approveRequest, rejectRequest,clearUserNotifications } = requestsSlice.actions;
// export default requestsSlice.reducer;