import { createSlice } from "@reduxjs/toolkit";

const interviewSlice = createSlice({
    name: "interview",
    initialState: {
        interviewData: null
    },
    reducers: {
        setInterviewData: (state, action) => {
            console.log("Reducer called");
            console.log(action.payload);

            state.interviewData = action.payload;

            console.log(state.interviewData);
        }
    }

})

export const { setInterviewData } = interviewSlice.actions;
export default interviewSlice.reducer;