import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/genericServeices';
import { CurrentUser } from '../App';

function VolunteerRequests() {
  const [openCalls, setOpenCalls] = useState([]);
  const { currentUser } = useContext(CurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    apiService.getByValue(
      currentUser.autoId,
      'volunteers',
      'Events',
      { volunteerId: null },
      (data) => setOpenCalls(data),
      (error) => console.error(error)
    );
  }, [currentUser]);

  const handleTakeCall = (callId) => {
    if (!currentUser) return;
    apiService.patch(
      currentUser.autoId,
      currentUser.type,
      'Events',
      callId,
      { volunteerId: currentUser.id },
      () => setOpenCalls(prev => prev.filter(call => call.id !== callId)),
      (error) => {
        console.error('שגיאה בעדכון הקריאה:', error);
        alert('אירעה שגיאה בעדכון הקריאה');
      }
    );

  };

  return (
    <div className="section">
      <h2>בקשות פתוחות</h2>
      {openCalls.length === 0 ? (
        <p>אין כרגע בקשות פתוחות</p>
      ) : (
        openCalls.map(call => (
          <div key={call.id} className="post-item">
            <p>מחלקה: {call.department}</p>
            <p>בית חולים: {call.hospital}</p>
            <p>בשעות: {call.startTime} - {call.endTime}</p>
            <button onClick={() => handleTakeCall(call.id)}>אני לוקח</button>
          </div>
        ))
      )}
    </div>
  );
}

export default VolunteerRequests;