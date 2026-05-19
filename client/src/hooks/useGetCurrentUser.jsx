import React from 'react'
import api from '../service/api';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function useGetCurrentUser() {

    const dispatch = useDispatch();

    const getCurrentUser = async () => {
        try {
            const result = await api.get("/user/current-user");
            console.log("current user", result.data.data);
            dispatch(setUserData(result.data.data));
        } catch (error) {
            console.log(error);
            dispatch(setUserData(null))
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, [dispatch])
}

export default useGetCurrentUser
