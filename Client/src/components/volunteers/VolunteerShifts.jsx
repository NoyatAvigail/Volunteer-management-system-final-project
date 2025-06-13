import React, { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import { userService } from '../../services/usersServices';

function VolunteerShifts() {
  const { currentUser } = useContext(CurrentUser);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    userService.getByValue(
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
      <h2>My Shifts</h2>
      {shifts.length === 0 ? (
        <p>You have no shifts at the moment.</p>
      ) : (
        shifts.map(shift => (
          <div key={shift.id} className="post-item">
            <p>Department: {shift.department}</p>
            <p>Hospital: {shift.hospital}</p>
            <p>Times: {shift.startTime} - {shift.endTime}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default VolunteerShifts;