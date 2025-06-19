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
        const [userInfoResponse, userRatingResponse, userStatusResponse] = await Promise.all([
            fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
            fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
            fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=5000`)
        ]);

        const userInfo = await userInfoResponse.json();
        const userRating = await userRatingResponse.json();
        const userStatus = await userStatusResponse.json();

        if (userInfo.status !== 'OK' || userRating.status !== 'OK' || userStatus.status !== 'OK') {
            throw new Error(`Codeforces API FAILED for handle: ${handle}.`);
        }

        // Process problem data
        const solvedProblems = new Set();
        let hardestProblem = { name: 'N/A', rating: 0 };
        userStatus.result.forEach(sub => {
            if (sub.verdict === 'OK') {
                const problemId = `<span class="math-inline">\{sub\.problem\.contestId\}\-</span>{sub.problem.index}`;
                if (!solvedProblems.has(problemId)) {
                    solvedProblems.add(problemId);
                    if (sub.problem.rating > hardestProblem.rating) {
                        hardestProblem = { name: sub.problem.name, rating: sub.problem.rating };
                    }
                }
            }
        });

        return {
            details: userInfo.result[0],
            contestHistory: userRating.result.reverse().slice(0, 20), // Last 20 contests
            problemStats: {
                totalSolved: solvedProblems.size,
                hardestProblem: hardestProblem,
            }
        };
    } catch (error) {
        console.error(`Error in fetchDetailedProfileData for handle ${handle}:`, error.message);
        throw error;
    }
};