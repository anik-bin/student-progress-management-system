import { Router } from "express";
import 
{   
    createStudent,
    getAllStudents, 
    getStudentById, 
    updateStudent, 
    deleteStudent 
} from "../controllers/student.controllers.js";

const router = Router();

router.route("/").post(createStudent).get(getAllStudents);

router.route("/:id").get(getStudentById).put(updateStudent).delete(deleteStudent);

export default router;