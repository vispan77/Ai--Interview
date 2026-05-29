import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import interviewSlice from "./interviewSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        interview: interviewSlice
    }
})

export default store;