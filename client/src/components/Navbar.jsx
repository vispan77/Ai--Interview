import React from 'react'
import { motion } from "motion/react";
import { BsRobot } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from "react-icons/hi";
import api from '../service/api';
import { setUserData } from '../redux/userSlice';
import AuthModal from './AuthModal';


function Navbar() {
    const { userData } = useSelector((state) => state.user);
    const [showCreditsPopup, setShowCreditsPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await api.get('/auth/logout');
            dispatch(setUserData(null));
            setShowCreditsPopup(false);
            setShowUserPopup(false);
            navigate("/")

        } catch (error) {
            console.log("logout error", error)
        }
    }
    return (
        <div className='bg-[#f3f3f3] flex justify-center px-6 pt-6'>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className='w-full max-w-6xl bg-white rounded-[24px] 
                shawdow-sm border border-gray-200 px-8 py-4 flex justify-between items-center
                 relative'
            >
                {/* left side */}
                <div className='flex items-center gap-3 cursor-pointer'>
                    <div className='bg-black text-white rounded-lg p-2'>
                        <BsRobot size={18} />
                    </div>
                    <h1 className='hidden md:block font-semibold text-lg'>
                        Ai Interview
                    </h1>

                </div>

                {/* right side */}
                <div className='flex items-center gap-6 relative'>
                    <div className='relative'>
                        <button
                            onClick={() => {
                                if(!userData){
                                    setShowAuth(true)
                                    // navigate("/auth")
                                }
                                setShowCreditsPopup(!showCreditsPopup);
                                setShowUserPopup(false)
                            }}
                            className='flex items-center bg-gray-100 hover:bg-gray-200
                            px-4 py-2 gap-2 rounded-full text-md transition cursor-pointer'>
                            <BsCoin size={20} />
                            {userData?.credits || 0}
                        </button>
                        {
                            userData && showCreditsPopup && (
                                <div className='absolute right-5 mt-3 w-60
                                bg-white shadow-xl border border-gray-200 rounded-2xl
                                p-5 z-50'>
                                    <p className='text-sm text-gray-600 mb-4'>
                                        Need more credits to continue interview ?
                                    </p>
                                    <button onClick={() => navigate("/pricing")}
                                        className='bg-black hover:bg-black/75 text-white w-full py-2
                                        rounded-lg text-sm cursor-pointer'>
                                        Buy more credits
                                    </button>

                                </div>
                            )
                        }
                    </div>
                    <div className='relative'>
                        <button 
                        onClick={() => { 
                            if(!userData){
                                setShowAuth(true)
                                // navigate("/auth")
                            }
                            setShowUserPopup(!showUserPopup); 
                            setShowCreditsPopup(false) 
                        }}
                            className='w-9 h-9 bg-black text-white rounded-full
                            flex items-center justify-center font-semibold cursor-pointer'>
                            {
                                userData ? userData?.name.charAt(0).toUpperCase() : <FaUserAstronaut size={16} />

                            }

                        </button>
                        {
                            userData && showUserPopup && (
                                <div className='absolute right-0 mt-3 w-48 bg-white
                                shadow-xl border border-gray-200 rounded-xl p-4 z-50'>
                                    <p className='text-md text-blue-500 font-medium mb-1'>
                                        {userData?.name}
                                    </p>
                                    <button onClick={() => navigate("/history")}
                                        className='w-full text-left text-sm py-2 
                                        hover:text-blacktext-gray-600'
                                    >
                                        Interview history

                                    </button>
                                    <button onClick={handleLogout}
                                        className='w-full text-left text-sm py-2
                                    flex items-center gap-2 text-red-500 cursor-pointer'>
                                        <HiOutlineLogout size={16} />
                                        Logout
                                    </button>

                                </div>
                            )
                        }

                    </div>
                </div>

            </motion.div>

            {
                showAuth && <AuthModal onClose={() => setShowAuth(false)} />
            }


        </div>
    )
}

export default Navbar
