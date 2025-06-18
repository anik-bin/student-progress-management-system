import {Student} from "../models/student.models.js";
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

    const student = await Student.create({
        name,
        email,
        phoneNumber,
        codeForcesHandle,
    });

    if (!student) {
        throw new ApiError(500, "Something went wrong while creating a student");
    }

    return res.status(201).json(
        new ApiResponse(201, student, "Student created successfully")
    );
});

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
    const student = await Student.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
    );

    if(!student) {
        throw new ApiError(404, "Student not found")
    }

    return res.status(200).json(
        new ApiResponse(200, student, "Student updated successfully")
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
}

