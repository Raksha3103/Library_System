import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/books";  // axios baseURL = https://localhost:7230/api


export const fetchBooks = createAsyncThunk("books/getAll", async (_,{ rejectWithValue }) => {
    try{
        const res = await api.get("/Library/All");
    return res.data;
    }
    catch(error){
        const msg = error.response?.data || "Unable to fetch books";
        return rejectWithValue(msg);
    }
});


export const fetchBookById = createAsyncThunk("books/getById", async (id) => {
    const res = await api.get(`/Library/id/${id}`);
    return res.data;
});

export const fetchBookByName= createAsyncThunk("books/getByName", async (name, { rejectWithValue }) => {
    try {
    const res = await api.get(`/Library/${name}`);
    return res.data;
    }
    catch (error) {
        const msg = error.response?.data || "Book not found";
        return rejectWithValue(msg);
    }
});

export const addBook = createAsyncThunk("books/add", async (book,{rejectWithValue }) => {
    try {
    const res = await api.post("/Library", book);
    return res.data;
    }
    catch (error) {
        const msg = error.response?.data || "Unable to add book";
        return rejectWithValue(msg);
    }
});

export const updateBook = createAsyncThunk("books/update", async ({ id, book },{ rejectWithValue }) => {
     try {
    const res = await api.put(`/Library/${id}`, book);
    return res.data;
     }
        catch (error) {
        const msg = error.response?.data || "Unable to update book";
        return rejectWithValue(msg);
    }
});


export const deleteBook = createAsyncThunk("books/delete", async (id,{ rejectWithValue }) => {
    try{await api.delete(`/Library/${id}`);
    return id;
}
    catch (error) {
        const msg = error.response?.data || "Unable to delete book";
        return rejectWithValue(msg);
    }
});
export const getBooksOfAuthor=createAsyncThunk("books/authorBooks",async(name,{rejectWithValue})=>{
    try{
    const res = await api.get(`/Library/AuthorByName?name=${name}`);
    return res.data;
    }
    catch(error){
        const msg = error.response?.data || "Unable to fetch books of author";
        return rejectWithValue(msg);
    }
});

const bookSlice = createSlice({
    name: "books",
    initialState: {
        list: [],
        selectedBook: null,
        loading: false,
        error: null
    },
    reducers: {
        clearMessages: (state) => {
            state.errorMessage = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder

        
        .addCase(fetchBooks.pending, (state) => { state.loading = true; })
        .addCase(fetchBooks.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload;
        })

      
        .addCase(fetchBookById.fulfilled, (state, action) => {
            state.selectedBook = action.payload;
        })

        
        .addCase(addBook.fulfilled, (state, action) => {
            state.list.push(action.payload);
            state.successMessage = "Book added successfully!";
        })

        
        .addCase(updateBook.fulfilled, (state, action) => {
            const index = state.list.findIndex(b => b.bookId === action.payload.bookId);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
             state.successMessage = "Book updated successfully!";
        })

      
        .addCase(deleteBook.fulfilled, (state, action) => {
            state.list = state.list.filter(b => b.bookId !== action.payload);
            state.successMessage = "Book deleted successfully!";
        })
        .addCase(fetchBookByName.fulfilled, (state, action) => {
             state.loading = false;
  state.error = null;
    state.list = state.list.filter(b => b.title.toLowerCase().includes(action.meta.arg.toLowerCase()));
})
.addCase(getBooksOfAuthor.fulfilled,(state,action)=>{
     state.loading = false;
  state.error = null;
        state.list=action.payload;  
})
.addCase(fetchBookByName.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Book not found!";
  state.list = [];
})

.addCase(getBooksOfAuthor.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "No books found for this author!";
  state.list = [];
})
 .addMatcher(
                (action) => action.type.endsWith("rejected"),
                (state, action) => {
                    state.loading = false;
                    state.errorMessage = action.payload;
                }
            );

        
    }
});
export const { clearMessages } = bookSlice.actions;
export default bookSlice.reducer;
