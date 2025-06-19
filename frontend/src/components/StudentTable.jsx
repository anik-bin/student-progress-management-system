import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

import { Button } from "./ui/button";
import { Trash2, Edit, Eye } from 'lucide-react';
import EditStudentDialog from "./EditStudentDialog";


const StudentTable = ({ students, handleDelete, onStudentUpdated }) => {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Email</TableHead>
            <TableHead className="font-bold">Codeforces Handle</TableHead>
            <TableHead className="text-center font-bold">Rating</TableHead>
            <TableHead className="text-center font-bold">Last Updated</TableHead>
            <TableHead className="text-center font-bold">Actions</TableHead>
            <TableHead className="text-center font-bold">Reminders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.codeForcesHandle}</TableCell>
                <TableCell className="text-center">{student.currentRating}</TableCell>
                <TableCell className="text-center">
                  {student.lastUpdated ? new Date(student.lastUpdated).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-center">{student.reminderCount}</TableCell>
                <TableCell className="flex justify-center items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <EditStudentDialog student={student} onStudentUpdated={onStudentUpdated}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </EditStudentDialog>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(student._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No students found. Add a new student to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default StudentTable