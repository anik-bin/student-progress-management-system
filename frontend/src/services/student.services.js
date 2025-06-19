import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        'Content-Type': 'application/json'
    },
});

// fetches all students from backend

export const getAllStudents = () => {
    return apiClient.get("/students");
}

export const createStudent = (studentData) => {
    return apiClient.post("/students", studentData);
}

export const updateStudent = (id, studentData) => {
    return apiClient.put(`/students/${id}`, studentData);
}

export const deleteStudent = (id) => {
    return apiClient.delete(`/students/${id}`);
}