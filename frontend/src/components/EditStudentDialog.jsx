import { useState, useEffect } from "react";
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
import { updateStudent } from "../services/student.services";
import toast from "react-hot-toast";
import { Switch } from "./ui/switch";

const EditStudentDialog = ({ student, onStudentUpdated, children }) => {
    const [formData, setFormData] = useState({ ...student });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setFormData({ ...student });
    }, [student]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Updating student...");

        try {
            await updateStudent(student._id, formData);

            toast.success("Student updated successfully!", { id: toastId });
            onStudentUpdated();
            setOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update student.";
            toast.error(errorMessage, { id: toastId });
            console.error("Failed to update student:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                    <DialogDescription>
                        Update the student's details. The data will be re-synced if the handle changes.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                            <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="codeForcesHandle" className="text-right">CF Handle</Label>
                            <Input id="codeForcesHandle" value={formData.codeForcesHandle} onChange={handleChange} className="col-span-3" required />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="remindersEnabled" className="text-right">Email Reminders</Label>
                            <Switch
                                id="remindersEnabled"
                                checked={formData.remindersEnabled}
                                onCheckedChange={(checked) => setFormData(prevState => ({ ...prevState, remindersEnabled: checked }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStudentDialog;