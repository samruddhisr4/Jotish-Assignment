import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, TrendingUp } from 'lucide-react';

const Charts = () => {
    const [chartData, setChartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data specifically for the chart
        fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'test', password: '123456' })
        })
            .then(res => res.json())
            .then(result => {
                const rawData = result.TABLE_DATA?.data || [];
                // Get first 10 employees and format for Recharts
                const formatted = rawData.slice(0, 10).map(item => ({
                    name: item[0],
                    // Safety check: ensure item[5] is a string before replacement
                    salary: parseInt(String(item[5] || '0').replace(/[$,]/g, '')) || 0
                }));
                setChartData(formatted);
            })
            .catch(err => console.error("Chart fetch error:", err));
    }, []);

    const COLORS = ['#667eea', '#764ba2', '#6B8DD6', '#8E37D7', '#4facfe', '#00f2fe', '#a18cd1', '#fbc2eb', '#84fab0', '#8fd3f4'];

    return (
        <div className="chart-container">
            <header className="chart-header">
                <button className="back-btn" onClick={() => navigate('/list')}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h1>Salary Analytics</h1>
                <p>Top 10 Employees Comparison</p>
            </header>

            <div className="chart-wrapper">
                <h3><TrendingUp size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Annual Salary ($)</h3>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="name"
                                stroke="#fff"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={60}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#fff" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ background: '#333', border: '1px solid #444', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#667eea' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="salary" radius={[10, 10, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <style>{`
                .chart-container { padding: 2rem; max-width: 900px; margin: 0 auto; color: white; min-height: 100vh; background: #242424; }
                .chart-header { text-align: center; margin-bottom: 3rem; position: relative; }
                .back-btn { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #667eea; cursor: pointer; font-weight: 600; }
                
                .chart-header h1 { margin: 0; font-size: 2rem; background: linear-gradient(to right, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .chart-header p { margin: 0.5rem 0 0; opacity: 0.6; }

                .chart-wrapper { 
                    background: rgba(255, 255, 255, 0.03); 
                    border-radius: 20px; 
                    padding: 2rem; 
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .chart-wrapper h3 { margin-top: 0; margin-bottom: 2rem; color: rgba(255,255,255,0.8); font-weight: 500; font-size: 1.1rem; }
            `}</style>
        </div>
    );
};

export default Charts;
