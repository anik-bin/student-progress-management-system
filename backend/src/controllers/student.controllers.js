import {Student} from "../models/student.models.js";
import { fetchCodeforcesData } from "../services/codeForces.service.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {AsyncHandler} from "../utils/asyncHandler.js";

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

export {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    syncStudentData,
}

