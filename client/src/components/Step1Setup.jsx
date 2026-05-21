import React, { useState } from 'react';
import { motion } from "motion/react";
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import api from '../service/api';

function Step1Setup({ onStart }) {
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) {
            return
        };
        setAnalyzing(true);
        const formData = new FormData();
        formData.append("resume", resumeFile);
        try {
            ;
            const result = await api.post("/interview/resume", formData);
            console.log("result ", result.data);
            setRole(result.data.role);
            setExperience(result.data.experience);
            setProjects(result.data.projects);
            setSkills(result.data.skills);
            setResumeText(result.data.data)
            setAnalysisDone(true);
            setAnalyzing(false);
        } catch (error) {
            console.log(error);
            setAnalyzing(false);
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex justify-center items-center
                bg-gradient-to-br from-gray-100 to-gray-200 px-4"
        >
            <div className=' w-full max-w-6xl bg-white rounded-3xl 
                  shadow-2xl grid md:grid-cols-2 overflow-hidden'
            >
                {/* left part */}
                <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-gradient-to-br from-green-50 to-green-100
                        p-12 flex flex-col justify-center'
                >
                    <h2 className='text-4xl text-gray-600 font-semibold mb-6'>
                        Start your Ai Interview
                    </h2>
                    <p className='text-gray-600 mb-10' >
                        Practice real world scenarios powered by Ai.
                        Improve communication, technical sckills and confidence.
                    </p>

                    <div className='space-y-5'>
                        {
                            [
                                {
                                    icon: <FaUserTie className="text-green-600 text-xl" />,
                                    text: "Choose Role & Experience",
                                },
                                {
                                    icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                                    text: "Smart Voice Interview",
                                },
                                {
                                    icon: <FaChartLine className="text-green-600 text-xl" />,
                                    text: "Performance Analytics",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    whileHover={{ scale: 1.03 }}
                                    className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer'>
                                    {item.icon}
                                    <span className='text-gray-700 font-medium'>{item.text}</span>

                                </motion.div>
                            ))
                        }

                    </div>

                </motion.div>

                {/* right part */}
                <motion.div
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className='p-12 bg-white'
                >
                    <h2 className='text-3xl text-gray-800 font-bold mb-8'>
                        Interview Setup
                    </h2>

                    <div className='space-y-6'>
                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4 text-gray-400' />
                            <input
                                type="text"
                                placeholder='Enter role'
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                className='w-full pl-12 px-4 py-3 border border-gray-200
                                    rounded-xl focus:ring-2 focus:ring-green-500 outline-none
                                    transition-all'

                            />
                        </div>
                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4 text-gray-400' />
                            <input
                                type="text"
                                placeholder='Experience (e.g 2 year)'
                                value={experience}
                                onChange={(event) => setExperience(event.target.value)}
                                className='w-full pl-12 px-4 py-3 border border-gray-200
                                    rounded-xl focus:ring-2 focus:ring-green-500 outline-none
                                    transition-all'

                            />
                        </div>

                        <select value={mode}
                            onChange={(event) => setMode(event.target.value)}
                            className='w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2
                                   focus:ring-green-500 outline-none transition-all'
                        >
                            <option value="Technical">Technical Interview</option>
                            <option value="HR">HR Interview</option>

                        </select>

                        {
                            !analysisDone && (
                                <motion.div
                                    onClick={() => document.getElementById("resumeUpload").click()}
                                    whileHover={{ scale: 1.03 }}
                                    className='border-2 border-dashed border-gray-300
                                        rounded-lg p-8 text-center cursor-pointer
                                      hover:border-green-500 hover:bg-green-50 transition-all'
                                >
                                    <FaFileUpload
                                        className='text-4xl mx-auto text-green-600
                                            mb-3'
                                    />
                                    <input
                                        type="file"
                                        id='resumeUpload'
                                        accept='application/pdf'
                                        onChange={(event) => setResumeFile(event.target.files[0])}
                                        className='hidden'
                                    />
                                    <p className='text-gray-600 font-medium'>
                                        {
                                            resumeFile ? resumeFile.name :
                                                "Click to upload resume (Optional)"
                                        }

                                    </p>
                                    {
                                        resumeFile && (
                                            <motion.button
                                                whileHover={{ scale: 1.03 }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleUploadResume();
                                                }}
                                                className='mt-4 bg-gray-900 text-white px-5 py-2 
                                                rounded-lg hover:bg-gray-800 transition-all'
                                            >
                                                {
                                                    analyzing ? "analyzing..." : "Analyze Resume"
                                                }

                                            </motion.button>
                                        )
                                    }

                                </motion.div>
                            )
                        }

                        {
                            analysisDone && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='bg-gray-50 border border-gray-200 
                                        rounded-xl p-5 space-y-4'
                                >
                                    <h3 className='text-lg text-gray-800 font-semibold'>
                                        Resume Analysis Result
                                    </h3>

                                    {
                                        projects.length > 0 && (
                                            <div>
                                                <p className='font-medium text-gray-700 mb-1'>
                                                    Projects :
                                                </p>
                                                <ul className='list-disc list-inside text-gray-600 space-y-1'>
                                                    {projects.map((project, index) => (
                                                        <li key={index}>
                                                            {project}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )
                                    }

                                    {
                                        skills.length > 0 && (
                                            <div>
                                                <p className='font-medium text-gray-700 mb-1'>
                                                    Skills :
                                                </p>

                                                <div className='flex flex-wrap gap-2'>
                                                    {skills.map((skill, index) => (
                                                        <span className='bg-green-100 text-green-700
                                                            px-3 py-1 rounded-full text-sm'>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    }

                                </motion.div>
                            )
                        }

                        <motion.button
                            disabled={!role || !experience}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            className='w-full disabled:bg-gray-600
                                bg-green-600 hover:bg-green-700 text-white py-3 rounded-full
                                text-lg font-semibold transition-all duration-300 shadow-2xl
                                cursor-pointer'
                        >
                            Start Interview

                        </motion.button>

                    </div>

                </motion.div>

            </div>

        </motion.div>


    )
}

export default Step1Setup
