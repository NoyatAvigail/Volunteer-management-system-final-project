import React, { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import { userService } from '../../services/usersServices';

function VolunteerShifts() {
  const { currentUser } = useContext(CurrentUser);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;

    if (!currentUser?.id) return;
    console.log("currentUser:", currentUser);

    userService.getById(
      currentUser.id,
      "volunteer",
      "shifts",
      (data) => setShifts(data),
      (error) => console.error(error)
    );
  }, [currentUser]);

  return (
    <div className="requests">
      <h2>My Shifts</h2>
      {shifts.length === 0 ? (
        <p>You have no shifts at the moment.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>תאריך</th>
              <th>שעת התחלה</th>
              <th>שעת סיום</th>
              <th>מספר חדר</th>
              <th>בית חולים</th>
              <th>מחלקה</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map(shift => (
              <tr key={shift.id}>
                <td>{new Date(shift.date).toISOString().split('T')[0]}</td>
                <td>{shift.startTime}</td>
                <td>{shift.endTime}</td>
                <td>{shift.roomNumber}</td>
                <td>{shift.hospital}</td>
                <td>{shift.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VolunteerShifts;