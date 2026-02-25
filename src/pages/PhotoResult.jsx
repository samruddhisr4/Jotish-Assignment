import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Download, RotateCcw } from 'lucide-react';

const PhotoResult = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const employeeId = state?.id;

    // Retrieve from localStorage using scoped key
    const photoKey = employeeId ? `employee_photo_${employeeId}` : 'lastCapturedPhoto';
    const capturedImage = localStorage.getItem(photoKey);

    if (!capturedImage) {
        return (
            <div className="status-container">
                <p>No photo captured yet.</p>
                <button className="back-btn" onClick={() => navigate('/list')}>
                    Back to Directory
                </button>
            </div>
        );
    }

    return (
        <div className="result-container">
            <header className="result-header">
                <h1>Captured Photo</h1>
                <p>Snapshot ready for review</p>
            </header>

            <div className="image-card">
                <img src={capturedImage} alt="Captured" className="captured-preview" />

                <div className="action-grid">
                    <button className="action-btn retake" onClick={() => navigate(`/details/${state?.id}`, { state: { ...state, autoOpen: true } })}>
                        <RotateCcw size={20} /> Retake Photo
                    </button>
                    <a href={capturedImage} download="employee_photo.jpg" className="action-btn download">
                        <Download size={20} /> Save Image
                    </a>
                </div>
            </div>

            <button className="done-btn" onClick={() => navigate('/list')}>
                <ArrowLeft size={18} /> Back to Directory
            </button>

            <style>{`
        .result-container { padding: 2rem; max-width: 500px; margin: 0 auto; color: white; min-height: 100vh; background: #242424; text-align: center; }
        .result-header { margin-bottom: 2rem; }
        .result-header h1 { margin: 0; font-size: 2rem; }
        .result-header p { margin: 0.5rem 0 0; opacity: 0.6; }

        .image-card { 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 20px; 
          padding: 1.5rem; 
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 2rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        }
        
        .captured-preview { 
          width: 100%; 
          border-radius: 12px; 
          border: 3px solid white;
          margin-bottom: 1.5rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        }

        .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .action-btn { 
          display: flex; align-items: center; justify-content: center; gap: 8px; 
          padding: 12px; border-radius: 10px; border: none; cursor: pointer; 
          font-weight: 600; text-decoration: none; font-size: 0.9rem;
        }
        .retake { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .download { background: #667eea; color: white; }
        
        .done-btn { background: transparent; border: none; color: #667eea; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; margin: 0 auto; }
        
        .status-container { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem; }
        .back-btn { background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
      `}</style>
        </div>
    );
};

export default PhotoResult;
