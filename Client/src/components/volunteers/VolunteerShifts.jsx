import React, { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import { apiService } from '../../../services/genericServeices';

function VolunteerShifts() {
  const { currentUser } = useContext(CurrentUser);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    apiService.getByValue(
      currentUser.autoId,
      'volunteers',
      'Events',
      { volunteerId: currentUser.id },
      (data) => setShifts(data),
      (error) => console.error(error)
    );
  }, [currentUser]);

  return (
    <div className="section">
      <h2>המשמרות שלי</h2>
      {shifts.length === 0 ? (
        <p>אין לך משמרות כרגע.</p>
      ) : (
        shifts.map(shift => (
          <div key={shift.id} className="post-item">
            <p>מחלקה: {shift.department}</p>
            <p>בית חולים: {shift.hospital}</p>
            <p>בשעות: {shift.startTime} - {shift.endTime}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default VolunteerShifts;