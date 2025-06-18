import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/usersServices';
import { CurrentUser } from '../App';
import { CodesContext } from '.././Models';
import '../../style/Posts.css';

function VolunteerRequests() {
  const [openCalls, setOpenCalls] = useState([]);
  const { currentUser } = useContext(CurrentUser);
  const { codes } = useContext(CodesContext);
  const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

  useEffect(() => {
    if (!currentUser) return;
    userService.getByValue(
      currentUser.id,
      'volunteer',
      "requests",
      { volunteerId: null },
      (data) => setOpenCalls(data),
      (error) => console.error(error)
    );
  }, [currentUser]);

  const handleTakeCall = (callId) => {
    if (!currentUser) return;
    userService.patch(
      currentUser.id,
      "volunteer",
      "requests",
      null,
      { callId },
      () => {
        setOpenCalls(prev => prev.filter(call => call.id !== callId));
      },
      (error) => {
        console.error('Error updating call:', error);
        alert('Error updating call');
      }
    );

  };

  return (
    <div className="section">
      {openCalls.length === 0 ? (
        <p>There are currently no open requests</p>
      ) : (
        <div className="requests">
          <h2>Open Requests</h2>
          <table className="requests-table">
            <thead>
              <tr>
                <th>תאריך</th>
                <th>שעת התחלה</th>
                <th>שעת סיום</th>
                <th>מספר חדר</th>
                <th>בית חולים</th>
                <th>מחלקה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {openCalls.map(call => (
                <tr key={call.id}>
                  <td>{new Date(call.date).toISOString().split('T')[0]}</td>
                  <td>{call.startTime}</td>
                  <td>{call.endTime}</td>
                  <td>{call.roomNumber}</td>
                  <td>{call.hospital}</td>
                  <td>{call.department}</td>
                  <td>
                    <button onClick={() => handleTakeCall(call.id)}>
                      I'm taking
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerRequests;