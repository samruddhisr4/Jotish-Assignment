import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';

const Performance = () => {
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'test', password: '123456' })
        })
            .then(res => res.json())
            .then(result => {
                const rawData = result.TABLE_DATA?.data || [];

                // Process Growth by Year
                const years = {};
                rawData.forEach(item => {
                    // Extract year from "2008/11/28" or similar format
                    const dateStr = item[4] || '';
                    const yearMatch = dateStr.match(/\d{4}/);
                    if (yearMatch) {
                        const year = yearMatch[0];
                        years[year] = (years[year] || 0) + 1;
                    }
                });

                const sortedYears = Object.keys(years).sort().map(year => ({
                    year,
                    hires: years[year]
                }));

                setGrowthData(sortedYears);
                setLoading(false);
            })
            .catch(err => {
                console.error("Data fetch error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loader">Syncing Performance Data...</div>;

    return (
        <div className="performance-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate('/list')}>
                    <ArrowLeft size={20} /> Dashboard
                </button>
                <h1>Growth Analytics</h1>
            </header>

            <div className="main-chart-card">
                <div className="card-header">
                    <h3><TrendingUp size={22} color="#84fab0" /> Hiring Trajectory</h3>
                    <p>Hiring trends and workforce expansion over time</p>
                </div>

                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#84fab0" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#84fab0" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="year" stroke="rgba(255,255,255,0.4)" fontSize={12} tickMargin={10} />
                            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
                            <Tooltip
                                contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="hires"
                                stroke="#84fab0"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorHires)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="stats-footer">
                    <div className="footer-stat">
                        <Calendar size={16} />
                        <span>Data spanning {growthData[0]?.year} - {growthData[growthData.length - 1]?.year}</span>
                    </div>
                </div>
            </div>

            <style>{`
                .performance-container { padding: 3rem; max-width: 1000px; margin: 0 auto; color: white; min-height: 100vh; background: #1a1a1a; font-family: 'Inter', sans-serif; }
                .page-header { margin-bottom: 3rem; position: relative; text-align: center; }
                .back-btn { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #667eea; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
                .back-btn:hover { transform: translateX(-4px); }
                
                h1 { margin: 0; font-size: 2.2rem; background: linear-gradient(to right, #84fab0, #8fd3f4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }
                
                .main-chart-card { background: rgba(255, 255, 255, 0.02); border-radius: 24px; padding: 2.5rem; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }
                .card-header { margin-bottom: 3rem; }
                .card-header h3 { display: flex; align-items: center; gap: 12px; margin: 0; font-size: 1.4rem; color: #fff; }
                .card-header p { margin: 8px 0 0; opacity: 0.5; font-size: 0.95rem; }
                
                .chart-wrapper { margin-bottom: 2rem; }
                
                .stats-footer { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; margin-top: 1rem; }
                .footer-stat { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.4); font-size: 0.85rem; }

                .loader { height: 100vh; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; color: #84fab0; letter-spacing: 1px; }

                @media (max-width: 768px) {
                    .performance-container { padding: 1.5rem; }
                    .main-chart-card { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default Performance;
