import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CirclePlus } from "lucide-react";
import { createStudent } from "../services/student.services";
import toast from "react-hot-toast";


const AddStudentDialog = ({ onStudentAdded }) => {
    const [studentData, setStudentData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        codeForcesHandle: ""
    });

    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setStudentData(prev => ({ ...prev, [id]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentData.name || !studentData.email || !studentData.codeForcesHandle) {
            toast.error("Please fill in all the required fields");
            return;
        }

        const toastId = toast.loading("Adding new student....");

        try {
            await createStudent(studentData);
            toast.success("Student added successfully", { id: toastId });
            onStudentAdded();
            setOpen(false);

            // reset the form

            setStudentData({
                name: "",
                email: "",
                phoneNumber: "",
                codeForcesHandle: ""
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to add student";
            toast.error(errorMessage, { id: toastId });
            console.error("Failed to add student: ", error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <CirclePlus className="mr-2 h-4 w-4" /> Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new student. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={studentData.name} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={studentData.email} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                            <Input id="phoneNumber" value={studentData.phoneNumber} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="codeForcesHandle" className="text-right">CF Handle</Label>
                            <Input id="codeForcesHandle" value={studentData.codeForcesHandle} onChange={handleChange} className="col-span-3" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Student</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddStudentDialog