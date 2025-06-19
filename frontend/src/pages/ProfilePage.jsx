import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentProfileData } from '../services/student.services';
import { Button } from '../components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

const ProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState(365);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await getStudentProfileData(id, period);
                setProfile(res.data.data);
            } catch (err) {
                setError('Failed to load profile data. The Codeforces handle may be invalid or the API is down.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, period]); // Refetch when period changes

    if (loading) return <div className="text-center p-10">Loading Profile...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    const ratingChartData = profile.contestHistory.map(c => ({
        name: c.contestName.substring(0, 15) + '...',
        rating: c.newRating,
    }));

    const ratingBucketsData = Object.entries(profile.problemStats.ratingBuckets).map(([bucket, count]) => ({
        name: `<span class="math-inline">\{bucket\}\-</span>{parseInt(bucket)+199}`,
        problems: count
    })).sort((a, b) => parseInt(a.name.split('-')[0]) - parseInt(b.name.split('-')[0]));


    return (
        <div className="container mx-auto p-4 md:p-8">
            <ReactTooltip />
            <Link to="/" className="text-blue-500 hover:underline mb-6 block">&larr; Back to Dashboard</Link>

            <div className="mb-8">
                <h1 className="text-4xl font-bold">{profile.details.handle}</h1>
                <p className="text-xl text-gray-600">Current Rating: {profile.details.rating} (Max: {profile.details.maxRating})</p>
                <p className="text-md text-gray-500">Rank: {profile.details.rank}</p>
            </div>

            <div className="my-6">
                <h2 className="text-2xl font-semibold mb-2">Filter Data by Period</h2>
                <div className="flex space-x-2">
                    {[30, 90, 365].map(p => (
                        <Button key={p} variant={period === p ? 'default' : 'outline'} onClick={() => setPeriod(p)}>
                            Last {p} Days
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-12">
                {/* Contest History Section */}
                <section>
                    <h2 className="text-3xl font-bold mb-4">Contest History</h2>
                    <div className="p-4 border rounded-lg h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ratingChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} />
                                <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Problem Solving Data Section */}
                <section>
                    <h2 className="text-3xl font-bold mb-4">Problem Solving Data</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                        <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold">{profile.problemStats.totalSolved}</p>
                            <p className="text-gray-500">Problems Solved</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold">{profile.problemStats.averageProblemsPerDay}</p>
                            <p className="text-gray-500">Problems / Day</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold">{profile.problemStats.averageRating}</p>
                            <p className="text-gray-500">Avg. Problem Rating</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold">{profile.problemStats.hardestProblem.rating}</p>
                            <p className="text-gray-500">Hardest Problem</p>
                        </div>
                    </div>

                    <div className="p-4 border rounded-lg h-96 mb-8">
                        <h3 className="font-semibold mb-4">Problems by Rating</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ratingBucketsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="problems" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Submission Heatmap (Last Year)</h3>
                        <CalendarHeatmap
                            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                            endDate={new Date()}
                            values={profile.heatmapData}
                            classForValue={(value) => {
                                if (!value) return 'color-empty';
                                return `color-scale-${Math.min(value.count, 4)}`;
                            }}
                            tooltipDataAttrs={value => ({ 'data-tip': `${value.date}: ${value.count} submissions` })}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;