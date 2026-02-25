import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ArrowLeft, Users, Globe } from 'lucide-react';

const Demographics = () => {
    const [officeData, setOfficeData] = useState([]);
    const [ageData, setAgeData] = useState([]);
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

                // Process Office Distribution
                const offices = {};
                rawData.forEach(item => {
                    const office = item[2] || 'Remote';
                    offices[office] = (offices[office] || 0) + 1;
                });
                setOfficeData(Object.keys(offices).map(key => ({ name: key, value: offices[key] })));

                // Process Age Ranges
                const ageRanges = { '20-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '60+': 0 };
                rawData.forEach(item => {
                    const age = parseInt(item[3]) || 0;
                    if (age >= 20 && age <= 30) ageRanges['20-30']++;
                    else if (age >= 31 && age <= 40) ageRanges['31-40']++;
                    else if (age >= 41 && age <= 50) ageRanges['41-50']++;
                    else if (age >= 51 && age <= 60) ageRanges['51-60']++;
                    else if (age > 60) ageRanges['60+']++;
                });
                setAgeData(Object.keys(ageRanges).map(key => ({ range: key, count: ageRanges[key] })));
                setLoading(false);
            })
            .catch(err => {
                console.error("Data fetch error:", err);
                setLoading(false);
            });
    }, []);

    const PIE_COLORS = ['#667eea', '#764ba2', '#4facfe', '#00f2fe', '#84fab0', '#8fd3f4'];

    if (loading) return <div className="loader">Analyzing Workforce...</div>;

    return (
        <div className="demographics-container">
            <header className="page-header">
                <button className="back-btn" onClick={() => navigate('/list')}>
                    <ArrowLeft size={20} /> Dashboard
                </button>
                <h1>Workforce Demographics</h1>
            </header>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3><Globe size={20} /> Office Distribution</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={officeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {officeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3><Users size={20} /> Age Diversity</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ background: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#764ba2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <style>{`
                .demographics-container { padding: 3rem; max-width: 1200px; margin: 0 auto; color: white; min-height: 100vh; background: #1a1a1a; font-family: 'Inter', sans-serif; }
                .page-header { margin-bottom: 3rem; position: relative; text-align: center; }
                .back-btn { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #667eea; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
                .back-btn:hover { transform: translateX(-4px); }
                
                h1 { margin: 0; font-size: 2.2rem; background: linear-gradient(to right, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; }
                
                .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
                .chart-card { background: rgba(255, 255, 255, 0.03); border-radius: 20px; padding: 2rem; border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                .chart-card h3 { display: flex; align-items: center; gap: 10px; margin-top: 0; margin-bottom: 2rem; font-size: 1.1rem; color: #rgba(255,255,255,0.8); }
                
                .loader { height: 100vh; display: flex; justify-content: center; align-items: center; font-size: 1.2rem; color: #667eea; letter-spacing: 1px; }

                @media (max-width: 900px) {
                    .charts-grid { grid-template-columns: 1fr; }
                    .demographics-container { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default Demographics;
