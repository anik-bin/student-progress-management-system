# **Student Progress Management System**

A full-stack MERN application designed to manage, track, and analyze the progress of students on the competitive programming platform, Codeforces. This system provides a comprehensive dashboard, detailed individual profiles with data visualizations, and automated backend processes for data synchronization and student engagement.

## **📽️ Project Demonstration**

\[**INSERT YOUR DEMONSTRATION VIDEO LINK HERE**\]

## **✨ Features**

### **Main Dashboard**

* **Full Student CRUD:** Add, Edit, and Delete students from a centralized dashboard.  
* **Real-Time Data Sync:** Automatically fetches and populates user data (rating, max rating) from the Codeforces API upon student creation. If a handle is edited, data is re-synced instantly.  
* **Live Data Updates:** The UI updates in real-time without needing a page refresh after any create, update, or delete operation.  
* **CSV Data Export:** The entire student list can be downloaded as a CSV file with a single click for offline analysis or record-keeping.

### **Student Profile View**

* **Dedicated Profile Pages:** Each student has a unique, routable profile page (/student/:id).  
* **Interactive Filtering:** Profile data can be filtered to show statistics for the last 30, 90, or 365 days. All stats and charts update dynamically.  
* **Rating Progression Graph:** A visual line chart displays the student's rating changes over time, based on the selected filter period.  
* **Detailed Problem Statistics:** Displays key metrics like Total Problems Solved, Average Problems per Day, Average Problem Rating, and the Hardest Problem Solved within the filtered period.  
* **Problems-by-Rating Chart:** A bar chart visualizes the number of problems solved in different rating buckets.  
* **Submission Heatmap:** A GitHub-style calendar heatmap provides a year-long overview of a student's submission consistency.

### **Backend & Automation**

* **Automated Daily Sync:** A background cron job runs automatically every day at 2 AM to update the Codeforces data for all students in the database, ensuring data freshness.  
* **Inactivity Email Reminders:** The system automatically detects students who have been inactive for more than 7 days and sends them a gentle, encouraging email reminder.  
* **Reminder Controls:** The email reminder feature can be enabled or disabled on a per-student basis. The system also tracks and displays the number of reminders sent.  
* **Robust API:** A clean, RESTful API built with modern best practices, including organized controllers, services, and asynchronous handlers.

## **🛠️ Tech Stack**

* **Frontend:** React.js, Vite, React Router, Tailwind CSS, Shadcn UI  
* **Backend:** Node.js, Express.js  
* **Database:** MongoDB (with Mongoose)  
* **Data Visualization:** Recharts, React Calendar Heatmap  
* **Key Libraries & Services:** axios, node-cron for scheduled tasks, nodemailer for sending emails, react-hot-toast for notifications.

## **🚀 Local Deployment Guide**

To run this project on your local machine, please follow the steps below.

### **Prerequisites**

* Node.js (v18 or later)  
* npm or yarn  
* Git  
* A MongoDB account (a free Atlas cluster is recommended)

### **Backend Setup**

1. **Clone the repository:**  
   git clone \<your-repository-url\>  
   cd student-progress-system/backend

2. **Install dependencies:**  
   npm install

3. **Set up environment variables:**  
   * Create a .env file in the backend root directory.  
   * Copy the contents from .env.example into your new .env file.  
   * Fill in the required values, especially MONGO\_URI, MAIL\_USER, and MAIL\_PASS. For MAIL\_PASS, you need to generate a 16-character **App Password** from your Google Account settings (2-Step Verification must be enabled).  
4. **Start the backend server:**  
   npm start

   The server should now be running on http://localhost:8000 (or your specified PORT).

### **Frontend Setup**

1. **Open a new terminal window.**  
2. **Navigate to the frontend directory:**  
   cd student-progress-system/frontend

3. **Install dependencies:**  
   npm install

4. **Start the frontend development server:**  
   npm run dev

   The application should now be accessible at http://localhost:5173.

## **📁 API Endpoints**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/v1/students | Get a list of all students. |
| POST | /api/v1/students | Create a new student and sync initial CF data. |
| GET | /api/v1/students/:id | Get details for a single student. |
| PUT | /api/v1/students/:id | Update a student's details (re-syncs if handle changes). |
| DELETE | /api/v1/students/:id | Delete a student. |
| POST | /api/v1/students/:id/sync | Manually trigger a data sync for a student. |
| GET | /api/v1/students/:id/profile | Get detailed, processed profile data for visualizations. |

