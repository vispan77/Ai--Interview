import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,

    },
    timeLimit: {
        type: Number
    },
    answer: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    confidence: {
        type: Number,
        default: 0
    },
    communication: {
        type: Number,
        default: 0
    },
    correctness: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const interviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true,
        enum: ["HR", "Technical"]
    },
    resumeText: {
        type: String
    },

    questions: [questionsSchema],

    finalScore: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["incompleted", "completed"],
        default: "incompleted"
    }
}, { timestamps: true })

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;