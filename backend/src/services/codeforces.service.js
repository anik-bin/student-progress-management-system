/**
 * Fetches user info and rating history from the Codeforces API.
 * @param {string} handle - The Codeforces handle of the user.
 * @returns {Promise<object>} An object containing the processed data.
 */

export const fetchCodeforcesData = async (handle) => {
    try {
        
        const [userInfoResponse, userRatingResponse] = await Promise.all([
            fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
            fetch(`https://codeforces.com/api/user.rating?handle=${handle}`)
        ]);

        if (!userInfoResponse.ok || !userRatingResponse.ok) {
            throw new Error(`Failed to fetch data for handle: ${handle}`);
        }

        const userInfo = await userInfoResponse.json();
        const userRatingHistory = await userRatingResponse.json();

        if (userInfo.status !== 'OK' || userRatingHistory.status !== 'OK') {
            throw new Error(`Codeforces API returned FAILED for handle: ${handle}. The handle might be invalid.`);
        }

        const userData = userInfo.result[0];
        
        const processedData = {
            currentRating: userData.rating || 0,
            maxRating: userData.maxRating || 0,
            lastUpdated: new Date(),
        };

        return processedData;

    } catch (error) {
        console.error(`Error in fetchCodeforcesData for handle ${handle}:`, error.message);
        throw error;
    }
};

export const fetchDetailedProfileData = async (handle) => {
    try {
        // Fetch everything we could possibly need in parallel
        const [userInfoResponse, userRatingResponse, userStatusResponse] = await Promise.all([
            fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
            fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
            fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`)
        ]);

        const userInfo = await userInfoResponse.json();
        const userRating = await userRatingResponse.json();
        const userStatus = await userStatusResponse.json();

        if (userInfo.status !== 'OK' || userRating.status !== 'OK' || userStatus.status !== 'OK') {
            throw new Error(`Codeforces API FAILED for handle: ${handle}.`);
        }

        // This object will hold ALL data, which we will filter later in the controller
        return {
            details: userInfo.result[0],
            contestHistory: userRating.result, // Send all contests
            submissionHistory: userStatus.result, // Send all submissions
        };
    } catch (error) {
        console.error(`Error in fetchDetailedProfileData for handle ${handle}:`, error.message);
        throw error;
    }
};