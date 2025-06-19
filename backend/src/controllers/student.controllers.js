import {Student} from "../models/student.models.js";
import { fetchCodeforcesData } from "../services/codeforces.service.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {AsyncHandler} from "../utils/asyncHandler.js";
import { fetchDetailedProfileData } from "../services/codeforces.service.js";

// create a student

const createStudent = AsyncHandler(async (req, res)=>{
    const {name, email, phoneNumber, codeForcesHandle} = req.body;

    if(!name || !email || !codeForcesHandle) {
        throw new ApiError(400, "Name, email and Codeforces handle are required");
    }

    const existingStudent = await Student.findOne({$or: [{email}, {codeForcesHandle}]});

    if(existingStudent) {
        throw new ApiError(409, "Student with this email or Codeforces handle already exists");
    }

    let cfData;
    try {
        cfData = await fetchCodeforcesData(codeForcesHandle);
    } catch (error) {
        throw new ApiError(400, `Failed to verify Codeforces handle: ${codeForcesHandle}. Please check for typos.`);
    }

    const student = await Student.create({
        name,
        email,
        phoneNumber,
        codeForcesHandle,
        currentRating: cfData.currentRating,
        maxRating: cfData.maxRating,
        lastUpdated: cfData.lastUpdated,
    });

    if (!student) {
        throw new ApiError(500, "Something went wrong while creating a student");
    }

    return res.status(201).json(
        new ApiResponse(201, student, "Student created successfully")
    );
});

const syncStudentData = AsyncHandler(async (req, res) => {
    const {id} = req.params;
    const student = await Student.findById(id);

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    let cfData;
    try {
        cfData = await fetchCodeforcesData(student.codeForcesHandle);
    } catch (error) {
        throw new ApiError(500, `Could not sync data for handle: ${student.codeForcesHandle}.`);
    }

    student.currentRating = cfData.currentRating;
    student.maxRating = cfData.maxRating;
    student.lastUpdated = cfData.lastUpdated;

    const updatedStudent = await student.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, updatedStudent, "Student data synced successfully.")
    );
})

// get all students

const getAllStudents = AsyncHandler(async (req, res)=>{
    const students = await Student.find({})

    return res.status(200).json(
        new ApiResponse(200, students, "Students retreived successfully")
    );
});

// fetch a student by id

const getStudentById = AsyncHandler(async (req, res)=>{
    const student = await Student.findById(req.params.id);

    if(!student) {
        throw new ApiError(404, "Student not found")
    }

    return res.status(200).json(
        new ApiResponse(200, student, "Student retrived successfully")
    );
});

// update student

const updateStudent = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    const oldHandle = student.codeForcesHandle;
    const newHandle = req.body.codeForcesHandle;

    Object.assign(student, req.body);

    // If the Codeforces handle has changed, we must re-fetch the data
    if (newHandle && oldHandle !== newHandle) {
        try {
            const cfData = await fetchCodeforcesData(newHandle);
            student.currentRating = cfData.currentRating;
            student.maxRating = cfData.maxRating;
            student.lastUpdated = cfData.lastUpdated;
        } catch (error) {
            throw new ApiError(400, `Failed to sync data for new handle: ${newHandle}. Please check the handle and try again.`);
        }
    }

    const updatedStudent = await student.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, updatedStudent, "Student updated successfully.")
    );
});

const deleteStudent = AsyncHandler(async (req, res)=>{
    const student = await Student.findByIdAndDelete(req.params.id);

    if(!student) {
        throw new ApiError(404, "Student not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Student deleted successfully")
    );
});

// get student profile

const getStudentProfile = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const period = parseInt(req.query.period, 10); // Get period from query, e.g., ?period=30

    const student = await Student.findById(id);
    if (!student) throw new ApiError(404, "Student not found");

    // Fetch the raw, complete data once
    const rawData = await fetchDetailedProfileData(student.codeForcesHandle);

    const now = new Date();
    const filterDate = new Date();
    if (period) {
        filterDate.setDate(now.getDate() - period);
    }

    // --- FILTER AND PROCESS DATA ---

    // 1. Filter Contest History
    const filteredContestHistory = period
        ? rawData.contestHistory.filter(c => new Date(c.ratingUpdateTimeSeconds * 1000) > filterDate)
        : rawData.contestHistory;

    // 2. Filter Submissions and calculate stats
    const solvedProblems = new Map();
    const ratingBuckets = {};
    const submissionHeatmapData = [];
    let totalRatingSum = 0;

    rawData.submissionHistory.forEach(sub => {
        const submissionDate = new Date(sub.creationTimeSeconds * 1000);
        const problemId = `<span class="math-inline">\{sub\.problem\.contestId\}\-</span>{sub.problem.index}`;

        // Only consider submissions within the filtered period for stats
        if (!period || submissionDate > filterDate) {
            if (sub.verdict === 'OK' && !solvedProblems.has(problemId)) {
                solvedProblems.set(problemId, sub.problem);
                const rating = sub.problem.rating || 0;
                totalRatingSum += rating;
                const bucket = Math.floor(rating / 200) * 200;
                ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
            }
        }
        // For heatmap, we usually consider the last year regardless of filter
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        if(submissionDate > oneYearAgo) {
             submissionHeatmapData.push({
                date: submissionDate.toISOString().split('T')[0],
                count: 1 // Simple count, can be aggregated later
            });
        }
    });

    const hardestProblem = [...solvedProblems.values()].reduce((max, p) => (p.rating > max.rating ? p : max), {rating: 0, name: 'N/A'});

    const totalSolved = solvedProblems.size;
    const averageRating = totalSolved > 0 ? Math.round(totalRatingSum / totalSolved) : 0;
    const averageProblemsPerDay = period > 0 ? (totalSolved / period).toFixed(2) : 0;

    // --- FINAL PROCESSED DATA ---
    const processedProfile = {
        details: rawData.details,
        contestHistory: filteredContestHistory.reverse(),
        problemStats: {
            totalSolved,
            hardestProblem: { name: hardestProblem.name, rating: hardestProblem.rating },
            averageRating,
            averageProblemsPerDay,
            ratingBuckets,
        },
        heatmapData: submissionHeatmapData
    };

    return res.status(200).json(new ApiResponse(200, processedProfile));
});

export {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    syncStudentData,
    getStudentProfile,
}

