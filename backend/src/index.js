import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { startStudentSyncCron } from "./cron/student.cron.js";

dotenv.config({
    path: "./.env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    });

    // start the cron job

    startStudentSyncCron();
})
.catch((err)=>{
    console.log("MongoDB connection failed: ", err);
})