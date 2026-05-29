import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { text } from "stream/consumers";
import generateResponse from "../config/OpenRouter.js";
import User from "../models/user.js";
import Interview from "../models/interview.js";
// Note: If you want to use the alternative method, install pdf-parse via: npm install pdf-parse
// import * as pdfParse from "pdf-parse/lib/";


// controller for analysing the resume pdf using pdfjs-dist
const analyseResume = async (req, res) => {
    try {
        // fetch the file from the request
        const file = req.file;
        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File is not found"
            });
        }

        // find the file path 
        const filePath = req.file.path;

        // then read the file using fs from the file folder
        const fileBuffer = await fs.promises.readFile(filePath);

        // then convert the file into binary data or binary array which is accepted
        // by the pdf library
        const unint8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjsLib.getDocument({ data: unint8Array }).promise;

        let resumeText = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            // get the page from the pdf
            const page = await pdf.getPage(pageNumber);

            // get textContent from the specific page
            const textContent = await page.getTextContent();

            // get the all the text from the page (Fixed: .json to .join)
            const pageText = textContent.items.map((item) => item.str).join(" ");

            resumeText = resumeText + pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: "system",
                content: `
                    Extract structured data from resume.

                    Return strictly JSON:{
                        "role": "string",
                        "experience": "string",
                        "projects": ["project1", "project2"],
                        "skills": ["skill1", "skill2"]
                    }
                `
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const response = await generateResponse(messages);

        const parsed = JSON.parse(response);

        // delete the file from the folder
        fs.unlinkSync(filePath);

        return res.status(200).json({
            success: true,
            message: "Resume is analysed successfully",
            data: resumeText,
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills
        });

    } catch (error) {
        console.log(error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: `Something went wrong while analysing the resume ${error}`
        });
    }
};



//controller for generateing question from the ai
const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;
        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();
        if (!role || !experience || !mode) {
            return res.status(404).json({
                success: false,
                message: "Role, experience and mode os required"
            })
        }

        const user = await User.findById({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if (user.credits < 50) {
            return res.status(500).json({
                success: false,
                message: "User not have enough credist"
            })
        }

        const projectText = Array.isArray(projects) && projects.length > 0 ?
            projects.join(", ") : "None";

        const skillText = Array.isArray(skills) && skills.length > 0 ?
            skills.join(", ") : "None";

        const safeResume = resumeText.trim() || "None"

        const userPrompt = `
                                Role:${role}
                                Experience:${experience}
                                InterviewMode:${mode}
                                Projects:${projectText}
                                Skills:${skillText},
                                Resume:${safeResume}
                                `;

        if (!userPrompt.trim()) {
            console.log("Prompt content is empty")
            return res.status(500).json({
                success: false,
                message: "Prompt content is empty"
            })
        }

        const messages = [

            {
                role: "system",
                content: `
                You are a real human interviewer conducting a professional interview.

                Speak in simple, natural English as if you are directly talking to the candidate.

                Generate exactly 5 interview questions.

                Strict Rules:
                - Each question must contain between 15 and 25 words.
                - Each question must be a single complete sentence.
                - Do NOT number them.
                - Do NOT add explanations.
                - Do NOT add extra text before or after.
                - One question per line only.
                - Keep language simple and conversational.
                - Questions must feel practical and realistic.

                Difficulty progression:
                Question 1 → easy  
                Question 2 → easy  
                Question 3 → medium  
                Question 4 → medium  
                Question 5 → hard  

                Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
                `
            },
            {
                role: "user",
                content: userPrompt
            }
        ];

        const aiResponse = await generateResponse(messages);

        if (!aiResponse || !aiResponse.trim()) {
            console.log("AI response is empty")
            return res.status(500).json({
                success: false,
                message: "AI response is empty"
            })
        }

        const questionsArray = aiResponse.split("\n").
            map((question) => question.trim()).
            filter((question) => question.length > 0).slice(0, 5);

        if (questionsArray.length === 0) {
            console.log("No questions generated")
            return res.status(500).json({
                success: false,
                message: "No questions generated"
            })
        }

        user.credits = user.credits - 50;
        await user.save();

        const interview = await Interview.create({
            user: user._id,
            role,
            experience,
            mode,
            resumeText: safeResume,
            questions: questionsArray.map((q, index) => ({
                question: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
                timeLimit: [60, 60, 90, 90, 120][index],
            }))
        })

        return res.status(200).json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while generating questions ${error}`
        })
    }
}

//controller for submitting the answer
const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body;

        const interview = await Interview.findById(interviewId);
        const question = interview.questions[questionIndex];

        if (!answer) {
            question.score = 0;
            question.feedback = "You did not submit an answer";
            question.answer = "";

            await interview.save();

            return res.json({
                success: false,
                message: "Answer is required",
                feedback: question.feedback
            })
        }

        //if the time exceeds
        if (timeTaken > question.timeLimit) {
            question.score = 0;
            question.feedback = "Time limit exceeded.";
            question.answer = answer;

            await interview.save();

            return res.json({
                success: false,
                message: "Time Limit Exceeded",
                feedback: question.feedback
            })
        }

        const messages = [
            {
                role: "system",
                content: `
                    You are a professional human interviewer evaluating a candidate's answer in a real interview.

                    Evaluate naturally and fairly, like a real person would.

                    Score the answer in these areas (0 to 10):

                    1. Confidence – Does the answer sound clear, confident, and well-presented?
                    2. Communication – Is the language simple, clear, and easy to understand?
                    3. Correctness – Is the answer accurate, relevant, and complete?

                    Rules:
                    - Be realistic and unbiased.
                    - Do not give random high scores.
                    - If the answer is weak, score low.
                    - If the answer is strong and detailed, score high.
                    - Consider clarity, structure, and relevance.

                    Calculate:
                    finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

                    Feedback Rules:
                    - Write natural human feedback.
                    - 10 to 15 words only.
                    - Sound like real interview feedback.
                    - Can suggest improvement if needed.
                    - Do NOT repeat the question.
                    - Do NOT explain scoring.
                    - Keep tone professional and honest.

                    Return ONLY valid JSON in this format:

                    {
                    "confidence": number,
                    "communication": number,
                    "correctness": number,
                    "finalScore": number,
                    "feedback": "short human feedback"
                    }
                    `
            }
            ,
            {
                role: "user",
                content: `
                    Question: ${question.question}
                    Answer: ${answer}
                    `
            }
        ];

        const aiResponse = await generateResponse(messages);

        const parsed = JSON.parse(aiResponse);

        question.answer = answer;
        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;

        await interview.save();

        return res.status(200).json({
            success: true,
            message: 'Answer submitted successfully and feedback is genearted',
            feedback: parsed.feedback
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Failed to submit the answer ${error}`
        })
    }
}


//controller for get the score of the interview
const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
            })
        }

        const toatalQuestions = interview.questions.length;

        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((question) => {
            totalScore = totalScore + question.score || 0;
            totalConfidence = totalConfidence + question.confidence || 0;
            totalCommunication = totalCommunication + question.communication || 0;
            totalCorrectness = totalCorrectness + question.correctness || 0;
        })

        const finalScore = toatalQuestions ? totalScore / toatalQuestions : 0;
        const averageConfidence = toatalQuestions ? totalConfidence / toatalQuestions : 0;
        const averageCommunication = toatalQuestions ? totalCommunication / toatalQuestions : 0;
        const averageCorrectness = toatalQuestions ? totalCorrectness / toatalQuestions : 0;

        interview.finalScore = finalScore;
        interview.status = "completed";

        await interview.save();

        return res.status(200).json({
            success: true,
            message: "Interview finished successfully",
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(averageConfidence.toFixed(1)),
            communication: Number(averageCommunication.toFixed(1)),
            correctness: Number(averageCorrectness.toFixed(1)),
            questionsWiseScore: interview.questions.map((q) => ({
                question: q.question,
                score: q.score || 0,
                feedback: q.feedback || "",
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0
            }))
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Something went wrong while finishing the interview ${error}`
        })
    }
}



export {
    analyseResume,
    generateQuestions,
    submitAnswer,
    finishInterview
}



