import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: 'filter',
    initialState: "",
    reducers: {
        changeText(state, action) {
            return action.payload
        }
    }
})

export const { changeText } = filterSlice.actions
export default filterSlice.reducer