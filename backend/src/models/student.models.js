import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
        },
        codeForcesHandle: {
            type: String,
            required: true,
            unique: true
        },
        currentRating: {
            type: Number,
            default: 0
        },
        maxRating: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date
        },
        remindersEnabled: {
            type: Boolean,
            default: true
        },
        reminderCount: {
            type: Number,
            default: 0
        }
    }, {
    timestamps: true
})

export const Student = mongoose.model("Student", studentSchema);