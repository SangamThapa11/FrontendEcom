import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../services/user.service";
import type { IPaginationParams } from "../config/constants";
import type { AxiosSuccessResponse } from "../config/axios.config";

// async state management reducer implementation
export const getAllUserList = createAsyncThunk(
    "User/getAllUserList",
    async (data: IPaginationParams): Promise<AxiosSuccessResponse> => {
            const response = await userService.getAllUSers(data);
            return response as unknown as AxiosSuccessResponse; 
        // throw exception
    });
const UserSlicer = createSlice({
    name: "User",
    initialState: {
        allUserList: null, 
        pagination: null,
        userListPagination: null,
        activeUser: null, 
    },
    reducers: { 
        setActiveUser: (state, action) => {
            state.activeUser = action.payload
        }
    }, 
    extraReducers: (builder) => {
        builder.addCase(getAllUserList.fulfilled, (state, action) => {
            state.allUserList = action.payload.data 
            state.userListPagination = action.payload.options.pagination 
        });
        builder.addCase(getAllUserList.rejected, (state) => {
            state.allUserList = null 
            state.userListPagination = null 
        });
    }
})

export const { setActiveUser } = UserSlicer.actions
export default UserSlicer.reducer
