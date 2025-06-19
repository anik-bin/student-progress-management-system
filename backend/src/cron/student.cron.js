import cron from 'node-cron';
import { Student } from '../models/student.models.js';
import { fetchCodeforcesData } from '../services/codeforces.service.js';

// A helper function to add a delay between API calls to avoid rate limiting

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * This function fetches all students from the DB and syncs their CF data.
 */
const syncAllStudentsData = async () => {
    console.log('-------------------------------------');
    console.log('Starting daily student data sync job...');
    const startTime = Date.now();

    const students = await Student.find({});
    if (!students || students.length === 0) {
        console.log('No students in the database to sync.');
        return;
    }

    console.log(`Found ${students.length} students to sync.`);
    let successCount = 0;
    let failureCount = 0;

    for (const student of students) {
        try {
            console.log(`Syncing data for: ${student.codeForcesHandle}...`);
            const lastSyncDate = student.lastUpdated || student.createdAt;
            const cfData = await fetchCodeforcesData(student.codeForcesHandle);
            
            // --- INACTIVITY CHECK LOGIC ---
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            // If last update was more than 7 days ago and reminders are enabled
            if (student.remindersEnabled && lastSyncDate < sevenDaysAgo) {
                console.log(`Student ${student.name} is inactive. Sending reminder...`);
                await sendInactivityEmail(student.name, student.email);
                student.reminderCount = (student.reminderCount || 0) + 1;
            }

            // Update student record
            student.currentRating = cfData.currentRating;
            student.maxRating = cfData.maxRating;
            student.lastUpdated = new Date();
            await student.save({ validateBeforeSave: false });
            
            successCount++;
            console.log(`Successfully synced: ${student.codeForcesHandle}`);
            
            // IMPORTANT: Add a delay to respect Codeforces API rate limits
            
            await delay(2000); // 2-second delay between each student

        } catch (error) {
            failureCount++;
            console.error(`Failed to sync data for ${student.codeForcesHandle}: ${error.message}`);
        }
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log('-------------------------------------');
    console.log('Student data sync job finished.');
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    console.log(`Successfully synced: ${successCount}`);
    console.log(`Failed to sync: ${failureCount}`);
    console.log('-------------------------------------');
};


/**
 * Schedules the cron job.
 */
export const startStudentSyncCron = () => {
    // This schedule runs the job at 2:00 AM every day.
    // Syntax: 'minute hour day-of-month month day-of-week'
    const schedule = '0 2 * * *'; 

    // FOR TESTING: Use this schedule to run the job every minute
    // const schedule = '* * * * *'; 
    
    cron.schedule(schedule, () => {
        syncAllStudentsData();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Set your timezone
    });

    console.log(`[CRON] Student data sync job scheduled. Running next at 2:00 AM.`);
};