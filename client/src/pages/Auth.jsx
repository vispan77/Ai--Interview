import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/fireBase';
import api from '../service/api';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';


function Auth({ isModal = false }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleAuth = async () => {
        try {

            const response = await signInWithPopup(auth, provider);
            const result = await api.post("/auth/google", {
                name: response.user.displayName,
                email: response.user.email,
                avatar: response.user.photoURL
            });
            dispatch(setUserData(result.data.data));
        } catch (error) {
            console.log(error);
            dispatch(setUserData(null))
        }
    }
    return (
        <div className={`w-full ${isModal ? "py-4" :
            "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20"}`}
        >
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-full ${isModal ? "max-w-md p-8 rounded-3xl" :
                    "max-w-lg p-12 rounded-[32px]"} bg-white shadow-2xl border border-gray-200`
                }
            >
                <div className='flex items-center justify-center mb-6 gap-3'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={18} />
                    </div>
                    <h2 className='font-semibold text-lg'>Ai Interview</h2>
                </div>
                <h1 className='text-2xl md-3xl font-semibold text-center leading-snug mb-4'>
                    Countinue with
                    <span className='bg-green-100 text-green-600 px-3 py-1
                    rounded-full inline-flex items-center gap-2'>
                        <IoSparkles size={16} /> AI Smart Interview
                    </span>
                </h1>
                <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                    Sign in to start  AI-Powered mock interview, track your progress,
                    and unlock detail performance insights.
                </p>
                <motion.button
                    onClick={handleGoogleAuth}
                    whileHover={{ opacity: 0.9, scale: 1.03 }}
                    whileTap={{ opacity: 1, scale: 0.98 }}
                    className='w-full flex items-center justify-center py-3 gap-3 bg-black
                    text-white rounded-full shadow-md cursor-pointer'
                >
                    <FcGoogle size={20} />
                    Continue with google


                </motion.button>

            </motion.div>
        </div>
    )
}

export default Auth
