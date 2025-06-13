import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/usersServices';
import { CurrentUser } from '../App';

function VolunteerRequests() {
  const [openCalls, setOpenCalls] = useState([]);
  const { currentUser } = useContext(CurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    userService.getByValue(
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
    userService.patch(
      currentUser.autoId,
      currentUser.type,
      'Events',
      callId,
      { volunteerId: currentUser.id },
      () => setOpenCalls(prev => prev.filter(call => call.id !== callId)),
      (error) => {
        console.error('Error updating call:', error);
        alert('Error updating call');
      }
    );

  };

  return (
    <div className="section">
      <h2>Open Requests</h2>
      {openCalls.length === 0 ? (
        <p>There are currently no open requests</p>
      ) : (
        openCalls.map(call => (
          <div key={call.id} className="post-item">
            <p>Department: {call.department}</p>
            <p>Hospital: {call.hospital}</p>
            <p>Times: {call.startTime} - {call.endTime}</p>
            <button onClick={() => handleTakeCall(call.id)}>I'm taking</button>
          </div>
        ))
      )}
    </div>
  );
}

export default VolunteerRequests;