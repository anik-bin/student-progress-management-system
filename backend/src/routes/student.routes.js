import { Router } from "express";
import 
{   
    createStudent,
    getAllStudents, 
    getStudentById, 
    updateStudent, 
    deleteStudent,
    syncStudentData,
    getStudentProfile, 
} from "../controllers/student.controllers.js";

const router = Router();

router.route("/").post(createStudent).get(getAllStudents);

router.route("/:id").get(getStudentById).put(updateStudent).delete(deleteStudent);

router.route("/:id/sync").post(syncStudentData);

router.route("/:id/profile").get(getStudentProfile);

export default router;