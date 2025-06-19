import { useState, useEffect } from "react";
import StudentTable from "./components/StudentTable";
import { getAllStudents, deleteStudent } from "./services/student.services";
import toast, {Toaster} from "react-hot-toast";
import AddStudentDialog from "./components/AddStudentDialog";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);

    try {
      const response = await getAllStudents();
      setStudents(response.data.data);
    } catch (error) {
        console.error("Failed to fetch students: ", error);
        toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchStudents();
  }, [])

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this student?")) {
      const toastId = toast.loading("Deleting student....");

      try {
        await deleteStudent(id);
        toast.success("Student deleted successfully", {id: toastId});
        fetchStudents();
      } catch (error) {
        console.error("Failed to delete student: ", error);
        toast.error("Failed to delete student", {id: toastId});
      }
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage and track student progress.</p>
          </div>
          <AddStudentDialog onStudentAdded={fetchStudents} />
        </div>

        {loading ? (
          <div className="text-center p-10">Loading student data...</div>
        ) : (
          <StudentTable students={students} handleDelete={handleDelete} onStudentUpdated={fetchStudents} />
        )}
      </main>
    </div>
  )
}

export default App