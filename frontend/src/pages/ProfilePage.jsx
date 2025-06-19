import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentProfileData } from '../services/student.services'; // We will add this function
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getStudentProfileData(id);
                setProfile(res.data.data);
            } catch (err) {
                setError('Failed to load profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="text-center p-10">Loading Profile...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <Link to="/" className="text-blue-500 hover:underline mb-6 block">&larr; Back to Dashboard</Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold">{profile.details.handle}</h1>
                <p className="text-xl text-gray-600">Current Rating: {profile.details.rating} (Max: {profile.details.maxRating})</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Problem Stats</h2>
                    <div className="p-4 border rounded-md">
                        <p><strong>Total Solved:</strong> {profile.problemStats.totalSolved}</p>
                        <p><strong>Hardest Problem:</strong> {profile.problemStats.hardestProblem.name} ({profile.problemStats.hardestProblem.rating})</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Recent Contests</h2>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contest</TableHead>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Rating Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profile.contestHistory.map(contest => (
                                    <TableRow key={contest.contestId}>
                                        <TableCell>{contest.contestName}</TableCell>
                                        <TableCell>{contest.rank}</TableCell>
                                        <TableCell className={contest.newRating > contest.oldRating ? 'text-green-500' : 'text-red-500'}>
                                            {contest.newRating - contest.oldRating > 0 ? '+' : ''}{contest.newRating - contest.oldRating}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;