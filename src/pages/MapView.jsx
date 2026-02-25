import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon, Info } from 'lucide-react';

const MapView = () => {
    const [cityData, setCityData] = useState({});
    const navigate = useNavigate();

    // Coordinates for common cities in the dataset
    const cityCoords = {
        "Edinburgh": { x: 48, y: 18 },
        "Tokyo": { x: 88, y: 35 },
        "San Francisco": { x: 12, y: 35 },
        "New York": { x: 25, y: 32 },
        "London": { x: 47, y: 22 },
        "Singapore": { x: 80, y: 65 },
        "Sydney": { x: 92, y: 85 }
    };

    useEffect(() => {
        fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'test', password: '123456' })
        })
            .then(res => res.json())
            .then(result => {
                const data = result.TABLE_DATA?.data || [];
                const counts = {};
                data.forEach(emp => {
                    if (Array.isArray(emp) && emp[2]) {
                        const city = emp[2];
                        counts[city] = (counts[city] || 0) + 1;
                    }
                });
                setCityData(counts);
            });
    }, []);

    return (
        <div className="map-page">
            <header className="map-header">
                <button className="back-btn" onClick={() => navigate('/list')}>
                    <ArrowLeft size={20} /> Back
                </button>
                <h1>Global Presence</h1>
                <p>Employee distribution across the world</p>
            </header>

            <div className="map-container">
                <div className="svg-map-wrapper">
                    {/* Simplified World Map SVG Outline */}
                    <svg viewBox="0 0 100 80" className="world-svg">
                        <path fill="rgba(255,255,255,0.05)" d="M5,20 Q10,10 20,15 L30,10 Q40,5 50,15 L60,10 Q75,5 90,20 L95,40 Q90,60 80,70 L60,75 Q40,80 20,70 L10,50 Z" />

                        {Object.keys(cityData).map(city => {
                            const coords = cityCoords[city] || { x: Math.random() * 80 + 10, y: Math.random() * 50 + 10 };
                            return (
                                <g key={city} className="city-marker">
                                    <circle cx={coords.x} cy={coords.y} r={1 + (cityData[city] * 0.5)} fill="#667eea" opacity="0.8">
                                        <animate attributeName="r" values={`${1 + cityData[city] * 0.5};${2 + cityData[city] * 0.5};${1 + cityData[city] * 0.5}`} dur="2s" repeatCount="indefinite" />
                                    </circle>
                                    <text x={coords.x + 2} y={coords.y - 2} fill="white" fontSize="2" opacity="0.7">{city} ({cityData[city]})</text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                <div className="legend">
                    <div className="legend-title">
                        <Info size={16} /> Data Insights
                    </div>
                    <div className="city-list">
                        {Object.entries(cityData).sort((a, b) => b[1] - a[1]).map(([city, count]) => (
                            <div key={city} className="city-row">
                                <span>{city}</span>
                                <span className="badge">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .map-page { padding: 2rem; max-width: 1000px; margin: 0 auto; color: white; min-height: 100vh; background: #242424; }
                .map-header { text-align: center; margin-bottom: 2rem; position: relative; }
                .back-btn { position: absolute; left: 0; top: 0; display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #667eea; cursor: pointer; font-weight: 600; }
                
                .map-container { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
                .svg-map-wrapper { background: rgba(255, 255, 255, 0.03); border-radius: 20px; padding: 2rem; border: 1px solid rgba(255, 255, 255, 0.1); position: relative; }
                .world-svg { width: 100%; height: auto; }
                
                .legend { background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1); }
                .legend-title { display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 1.5rem; color: #667eea; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
                
                .city-list { display: flex; flex-direction: column; gap: 0.8rem; max-height: 400px; overflow-y: auto; padding-right: 0.5rem; }
                .city-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.03); border-radius: 8px; }
                .badge { background: #667eea; padding: 2px 8px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
            `}</style>
        </div>
    );
};

export default MapView;
