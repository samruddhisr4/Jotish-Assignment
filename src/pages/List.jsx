import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ChevronRight, LogOut, AlertCircle, Map as MapIcon } from 'lucide-react';

const List = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Auth check
        if (!localStorage.getItem('isAuthenticated')) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'test', password: '123456' })
                });

                if (!response.ok) throw new Error('Failed to fetch data');

                const result = await response.json();
                console.log("API Result:", result);

                // The screenshot shows the data is at TABLE_DATA.data and is an array of arrays
                const listData = result.TABLE_DATA?.data || [];
                setData(listData);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to load data. Please check your connection or API status.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) return (
        <div className="status-container">
            <div className="spinner"></div>
            <p>Fetching Employee Records...</p>
        </div>
    );

    if (error) return (
        <div className="status-container">
            <AlertCircle size={48} color="#ff4d4d" />
            <p className="error-text">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
        </div>
    );

    return (
        <div className="list-container">
            <header className="list-header">
                <div>
                    <h1>Employee Directory</h1>
                    <p>{data.length} records found</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => navigate('/charts')} className="chart-btn">
                        <BarChart2 size={18} /> Salaries
                    </button>
                    <button onClick={() => navigate('/map')} className="map-btn">
                        <MapIcon size={18} /> Map
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div className="table-wrapper">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            <tr key={index} onClick={() => navigate(`/details/${index}`, { state: { employee: item, id: index } })}>
                                <td>{item[0] || 'N/A'}</td>
                                <td>{item[1] || 'N/A'}</td>
                            </tr>
                        ) : (
                            <tr><td colSpan="2" style={{ textAlign: 'center', padding: '2rem' }}>No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .list-container { padding: 2rem; max-width: 1100px; margin: 0 auto; color: white; min-height: 100vh; background: #242424; }
                .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; }
                .list-header h1 { margin: 0; font-size: 1.8rem; }
                .list-header p { margin: 0; opacity: 0.6; font-size: 0.9rem; }
                .header-actions { display: flex; gap: 1rem; }
                
                .chart-btn, .logout-btn, .retry-btn { 
                    display: flex; align-items: center; gap: 8px; padding: 10px 20px; 
                    border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: all 0.2s;
                }
                .chart-btn { background: #667eea; color: white; }
                .logout-btn { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; border: 1px solid #ff4d4d; }
                .logout-btn:hover { background: #ff4d4d; color: white; }
                .retry-btn { background: white; color: #242424; margin-top: 1rem; }
                
                .table-wrapper { background: rgba(255, 255, 255, 0.03); border-radius: 15px; overflow-hidden; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                .employee-table { width: 100%; border-collapse: collapse; text-align: left; }
                th, td { padding: 1.2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
                th { background: rgba(255, 255, 255, 0.05); color: #667eea; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
                tr:hover { background: rgba(255, 255, 255, 0.07); cursor: pointer; transform: scale(1.002); }
                
                .status-container { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #242424; color: white; gap: 1rem; }
                .error-text { color: #ff4d4d; font-size: 1.1rem; max-width: 400px; text-align: center; }
                
                .spinner {
                    width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-left-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default List;