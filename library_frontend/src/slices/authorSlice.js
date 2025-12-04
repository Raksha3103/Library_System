import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/books"; // axios baseURL = https://localhost:7230/api



export const fetchAuthors = createAsyncThunk("authors/getAll", async (_,{rejectWithValue}) => {
    try{
    const res = await api.get("/Author/All");
    return res.data;
    }
    catch (error) {
        const msg = error.response?.data || "Unable to fetch authors";
        return rejectWithValue(msg);
    }
});



export const fetchAuthorById = createAsyncThunk("authors/getById", async (id,{rejectWithValue}) => {
    try
    {const res = await api.get(`/Author/${id}`);
    return res.data;
}
    catch (error) {
        const msg = error.response?.data || "Author not found";
        return rejectWithValue(msg);
    }
});



export const addAuthor = createAsyncThunk("authors/add", async (author,rejectWithValue) => {
   try{
    const res = await api.post("/Author", author);
    return res.data;
   }
    catch (error) {
        const msg = error.response?.data || "Unable to add author";
        return rejectWithValue(msg);
    }
});



export const updateAuthor = createAsyncThunk("authors/update", async ({ id, author },{rejectWithValue}) => {
    try{
    const res = await api.put(`/Author/${id}`, author);
    return res.data;
    }
    catch (error) {
        const msg = error.response?.data || "Unable to update author";
        return rejectWithValue(msg);
    }
});



export const deleteAuthor = createAsyncThunk("authors/delete", async (id,{rejectWithValue}) => {
    try{
    await api.delete(`/Author/${id}`);
    return id;
    }
    catch (error) {
        const msg = error.response?.data || "Unable to delete author";
        return rejectWithValue(msg);
    }
});


const authorSlice = createSlice({
    name: "authors",
    initialState: {
        list: [],
        selectedAuthor: null,
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

           
            .addCase(fetchAuthors.pending, (state) => { state.loading = true; })
            .addCase(fetchAuthors.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchAuthors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

          
            .addCase(fetchAuthorById.fulfilled, (state, action) => {
                state.selectedAuthor = action.payload;
            })

          
            .addCase(addAuthor.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.successMessage = "Author added successfully!";
            })

            .addCase(updateAuthor.fulfilled, (state, action) => {
                const index = state.list.findIndex(a => a.authorId === action.payload.authorId);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
                state.successMessage = "Author updated successfully!";
            })

          
            .addCase(deleteAuthor.fulfilled, (state, action) => {
                state.list = state.list.filter(a => a.authorId !== action.payload);
                state.successMessage = "Author deleted successfully!";
            })
            .addCase(addAuthor.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(updateAuthor.rejected, (state, action) => {
                state.errorMessage = action.payload;
            })
            .addCase(deleteAuthor.rejected, (state, action) => {
                state.errorMessage = action.payload;
            }); 

    }
});
export const { clearMessages } = authorSlice.actions;
export default authorSlice.reducer;
