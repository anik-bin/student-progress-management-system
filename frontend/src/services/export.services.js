/**
 * Converts an array of student objects into a CSV formatted string and triggers a download.
 * @param {Array<object>} students - The array of student data.
 * @param {string} filename - The desired name for the downloaded file.
 */

export const exportToCsv = (students, filename = 'students.csv') => {
    if (!students || students.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = [
        "ID",
        "Name",
        "Email",
        "PhoneNumber",
        "CodeforcesHandle",
        "CurrentRating",
        "MaxRating",
        "LastUpdated",
        "CreatedAt",
    ];

    const csvRows = [
        headers.join(','), // The header row
    ];

    // Generate a row for each student
    for (const student of students) {
        const values = [
            student._id,
            `"${student.name.replace(/"/g, '""')}"`,
            student.email,
            student.phoneNumber,
            student.codeForcesHandle,
            student.currentRating,
            student.maxRating,
            student.lastUpdated ? new Date(student.lastUpdated).toISOString() : '',
            student.createdAt ? new Date(student.createdAt).toISOString() : '',
        ];
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Create a link and trigger the download
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};