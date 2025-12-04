import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import authorReducer from "./slices/authorSlice";
import borrowReducer from "./slices/BorrowSlice";
import userReducer from "./slices/userSlice";
import loginReducer from"./slices/loginSlice";
import requestReducer from "./slices/RequestSlice";
export const store = configureStore({
    reducer: {
        // auth: authReducer,
        books: bookReducer,
        authors: authorReducer,
         borrow: borrowReducer,
            user: userReducer,
            login:loginReducer,
            requests: requestReducer,
    },
});
