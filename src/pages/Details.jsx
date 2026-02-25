import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Camera, ArrowLeft, User, Briefcase, MapPin, Calendar, DollarSign } from 'lucide-react';

const Details = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const employee = state?.employee || state; // Handle both direct pass and wrapped state
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [showCamera, setShowCamera] = useState(state?.autoOpen || false);

    if (!employee) {
        return (
            <div className="error-container">
                <p>No employee data found.</p>
                <button onClick={() => navigate('/list')}>Back to List</button>
            </div>
        );
    }

    const photoKey = `employee_photo_${id}`;
    const capturedImage = localStorage.getItem(photoKey);

    const capture = React.useCallback(() => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            localStorage.setItem(photoKey, imageSrc);
            navigate('/photo-result', { state: { ...state, employee, id } });
        }
    }, [webcamRef, navigate, state, employee, id, photoKey]);

    return (
        <div className="details-container">
            <button className="back-btn" onClick={() => navigate('/list')}>
                <ArrowLeft size={20} /> Back to List
            </button>

            <div className="details-card">
                <div className="card-header">
                    <div className="avatar-wrapper">
                        {capturedImage ? (
                            <img src={capturedImage} alt="Profile" className="avatar-img" />
                        ) : (
                            <div className="avatar">
                                {employee[0]?.charAt(0) || 'E'}
                            </div>
                        )}
                    </div>
                    <h1>{employee[0]}</h1>
                    <p>{employee[1]}</p>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <MapPin size={20} className="icon" />
                        <div>
                            <label>City</label>
                            <p>{employee[2] || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <Calendar size={20} className="icon" />
                        <div>
                            <label>Start Date</label>
                            <p>{employee[4] || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <DollarSign size={20} className="icon" />
                        <div>
                            <label>Salary</label>
                            <p>{employee[5] || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <Briefcase size={20} className="icon" />
                        <div>
                            <label>Extension</label>
                            <p>{employee[3] || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="camera-section">
                    {!showCamera ? (
                        <button className="capture-trigger" onClick={() => setShowCamera(true)}>
                            <Camera size={20} /> Open Camera
                        </button>
                    ) : (
                        <div className="webcam-wrapper">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="webcam-preview"
                            />
                            <button className="capture-btn" onClick={capture}>
                                Click Photo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .details-container { padding: 2rem; max-width: 600px; margin: 0 auto; color: white; min-height: 100vh; background: #242424; }
        .back-btn { display: flex; align-items: center; gap: 8px; background: transparent; border: none; color: #667eea; cursor: pointer; font-weight: 600; margin-bottom: 1.5rem; }
        
        .details-card { 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 20px; 
          padding: 2.5rem; 
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        }
        
        .card-header { text-align: center; margin-bottom: 2rem; }
        .avatar-wrapper { margin-bottom: 1rem; }
        .avatar, .avatar-img { 
          width: 80px; height: 80px; 
          border-radius: 50%; margin: 0 auto; 
          display: flex; justify-content: center; align-items: center; 
          font-size: 2rem; font-weight: bold; 
          border: 3px solid #667eea;
          object-fit: cover;
        }
        .avatar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .avatar-img { background: #333; }
        .card-header h1 { margin: 0; font-size: 1.8rem; }
        .card-header p { margin: 0.5rem 0 0; opacity: 0.6; color: #667eea; font-weight: 500; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem; }
        .info-item { display: flex; align-items: center; gap: 12px; }
        .info-item .icon { color: #667eea; }
        .info-item label { display: block; font-size: 0.8rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
        .info-item p { margin: 0; font-weight: 500; }

        .camera-section { text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; }
        .capture-trigger { 
          background: #667eea; color: white; border: none; padding: 12px 25px; 
          border-radius: 10px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; margin: 0 auto;
        }
        
        .webcam-wrapper { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .webcam-preview { width: 100%; border-radius: 15px; border: 2px solid #667eea; }
        .capture-btn { background: #ff4d4d; color: white; border: none; padding: 12px 25px; border-radius: 10px; cursor: pointer; font-weight: 600; }
        
        .error-container { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; }
      `}</style>
        </div>
    );
};

export default Details;
