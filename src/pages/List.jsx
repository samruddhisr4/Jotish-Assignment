import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ChevronRight, LogOut, AlertCircle, Map as MapIcon, PieChart as PieChartIcon, LineChart as GrowthIcon } from 'lucide-react';

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
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="brand-section">
                    <h1>Enterprise Hub</h1>
                    <p>Internal Employee Management System</p>
                </div>
                <button onClick={handleLogout} className="logout-pill">
                    <LogOut size={16} /> SIGN OUT
                </button>
            </header>

            <main className="dashboard-grid">
                {/* Left Column: Directory */}
                <section className="directory-column">
                    <div className="section-header">
                        <h2>Employee Directory</h2>
                        <span className="count-badge">{data.length} Records</span>
                    </div>
                    <div className="table-card">
                        <table className="employee-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index} onClick={() => navigate(`/details/${index}`, { state: { employee: item, id: index } })}>
                                            <td>
                                                <div className="name-cell">
                                                    <div className="mini-avatar">{item[0]?.charAt(0)}</div>
                                                    {item[0] || 'N/A'}
                                                </div>
                                            </td>
                                            <td><span className="position-tag">{item[1] || 'N/A'}</span></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="2" className="empty-state">No records found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Right Column: Analytics Hub */}
                <aside className="analytics-column">
                    <div className="section-header">
                        <h2>Analytics Hub</h2>
                    </div>

                    <div className="stats-row">
                        <div className="stat-card">
                            <label>HEADCOUNT</label>
                            <div className="stat-value">{data.length}</div>
                        </div>
                        <div className="stat-card">
                            <label>CHANNELS</label>
                            <div className="stat-value">GLOBAL</div>
                        </div>
                    </div>

                    <div className="creative-actions">
                        <button onClick={() => navigate('/charts')} className="creative-btn salary">
                            <div className="btn-icon"><BarChart2 size={24} /></div>
                            <div className="btn-text">
                                <h3>Salary Analytics</h3>
                                <p>View distribution & trends</p>
                            </div>
                            <ChevronRight className="arrow" size={16} />
                        </button>

                        <button onClick={() => navigate('/map')} className="creative-btn map">
                            <div className="btn-icon"><MapIcon size={24} /></div>
                            <div className="btn-text">
                                <h3>Global Reach</h3>
                                <p>Interactive presence map</p>
                            </div>
                            <ChevronRight className="arrow" size={16} />
                        </button>

                        <button onClick={() => navigate('/demographics')} className="creative-btn demographics">
                            <div className="btn-icon"><PieChartIcon size={24} /></div>
                            <div className="btn-text">
                                <h3>Workforce Insights</h3>
                                <p>Office & Age distribution</p>
                            </div>
                            <ChevronRight className="arrow" size={16} />
                        </button>

                        <button onClick={() => navigate('/performance')} className="creative-btn growth">
                            <div className="btn-icon"><GrowthIcon size={24} /></div>
                            <div className="btn-text">
                                <h3>Growth Analytics</h3>
                                <p>Hiring trends over time</p>
                            </div>
                            <ChevronRight className="arrow" size={16} />
                        </button>
                    </div>

                </aside>
            </main>

            <style>{`
                .dashboard-container { 
                  padding: 1.5rem 3rem; 
                  width: 100%; 
                  margin: 0; 
                  color: white; 
                  min-height: 100vh; 
                  background: #1a1a1a; 
                  font-family: 'Inter', sans-serif;
                }
                
                .dashboard-header { 
                  display: flex; 
                  justify-content: space-between; 
                  align-items: center; 
                  margin-bottom: 2.5rem; 
                  padding: 1rem 0;
                  border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .brand-section h1 { 
                  margin: 0; 
                  font-size: 3.1rem; 
                //   letter-spacing: -0.5px; 
                  background: linear-gradient(to right, #667eea, #764ba2);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
                .brand-section p { margin: 2px 0 0;  font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; }

                .logout-pill {
                   background: rgba(255,255,255,0.05);
                   border: 1px solid rgba(255,255,255,0.1);
                   color: #ff4d4d;
                   padding: 8px 16px;
                   border-radius: 20px;
                   font-size: 0.75rem;
                   font-weight: 700;
                   cursor: pointer;
                   display: flex;
                   align-items: center;
                   gap: 8px;
                   transition: all 0.2s;
                }
                .logout-pill:hover { background: #ff4d4d; color: white; border-color: #ff4d4d; }

                .dashboard-grid {
                  display: grid;
                  grid-template-columns: 2.2fr 1fr;
                  gap: 3rem;
                }

                .section-header { 
                  display: flex; 
                  justify-content: space-between; 
                  align-items: center; 
                  margin-bottom: 2rem; 
                }
                .section-header h2 { margin: 0; font-size: 1.3rem; font-weight: 600; color: #fff; }
                .count-badge { background: #667eea; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }

                /* Directory Styles */
                .table-card { 
                  background: rgba(255, 255, 255, 0.03); 
                  border-radius: 16px; 
                  border: 1px solid rgba(255,255,255,0.08);
                  overflow: hidden;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .employee-table { width: 100%; border-collapse: collapse; text-align: left; }
                th { 
                  padding: 1.2rem 1.5rem; 
                  font-size: 0.75rem; 
                  text-transform: uppercase; 
                  letter-spacing: 1.5px; 
                  color: rgba(255,255,255,0.5);
                  background: rgba(255,255,255,0.04);
                }
                td { padding: 1.2rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
                tr { cursor: pointer; transition: background 0.2s; }
                tr:hover { background: rgba(255,255,255,0.06); }

                .name-cell { display: flex; align-items: center; gap: 14px; font-weight: 500; font-size: 1.05rem; }
                .mini-avatar { 
                  width: 36px; height: 36px; 
                  background: rgba(102, 126, 234, 0.2); 
                  color: #8fa4ff; 
                  border-radius: 10px; 
                  display: flex; justify-content: center; align-items: center;
                  font-size: 0.9rem; font-weight: 700;
                  border: 1px solid rgba(102, 126, 234, 0.4);
                }
                .position-tag { 
                  font-size: 1.1rem; 
                  color: rgba(248, 245, 245, 1); 
                  font-weight: 400;
                }

                /* Analytics Styles */
                .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .stat-card { 
                  background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
                  padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
                  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .stat-card label { display: block; font-size: 0.65rem; letter-spacing: 1.5px; color: #667eea; margin-bottom: 4px; font-weight: 800; }
                .stat-value { font-size: 1.8rem; font-weight: 650; letter-spacing: -0.5px; color: #fff; }

                .creative-actions { display: flex; flex-direction: column; gap: 1rem; }
                .creative-btn { 
                  display: flex; align-items: center; 
                  padding: 1rem 1.2rem; border-radius: 16px; border: 2px solid rgba(255,255,255,0.25);
                  cursor: pointer; text-align: left; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative; overflow: hidden;
                  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                }
                .salary { background: linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%); }
                .map { background: linear-gradient(135deg, rgba(79, 173, 254, 0.6) 0%, rgba(0, 243, 254, 0.5) 100%); }
                .demographics { background: linear-gradient(135deg, rgba(161, 140, 209, 0.6) 0%, rgba(251, 194, 235, 0.6) 100%); }
                .growth { background: linear-gradient(135deg, rgba(132, 250, 176, 0.6) 0%, rgba(143, 211, 244, 0.6) 100%); }
                
                .creative-btn:hover { 
                  transform: translateY(-4px); 
                  border-color: rgba(255,255,255,0.6);
                  box-shadow: 0 10px 25px rgba(0,0,0,0.4), 0 0 15px rgba(102, 126, 234, 0.2);
                }
                
                .btn-icon { opacity: 0.9; margin-right: 1rem; transition: all 0.3s; }
                .creative-btn:hover .btn-icon { transform: scale(1.1) rotate(-5deg); opacity: 1; }
                
                .btn-text h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                .btn-text p { margin: 2px 0 0; font-size: 0.75rem; color: rgba(255,255,255,0.8); font-weight: 500; }
                .arrow { margin-left: auto; opacity: 0.3; transition: transform 0.3s; }
                .creative-btn:hover .arrow { transform: translateX(4px); opacity: 1; }

                .info-blob { 
                  margin-top: 2rem; 
                  background: rgba(102, 126, 234, 0.05); 
                  padding: 1rem; border-radius: 12px; 
                  display: flex; gap: 12px; align-items: flex-start;
                  border: 1px solid rgba(102, 126, 234, 0.1);
                }
                .info-blob p { margin: 0; font-size: 0.8rem; opacity: 0.6; line-height: 1.4; }

                .status-container { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #1a1a1a; color: white; gap: 1.5rem; }
                .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.05); border-left-color: #667eea; border-radius: 50%; animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                  .dashboard-grid { grid-template-columns: 1fr; }
                  .dashboard-container { padding: 1.5rem; }
                }
            `}</style>
        </div >
    );
};

export default List;