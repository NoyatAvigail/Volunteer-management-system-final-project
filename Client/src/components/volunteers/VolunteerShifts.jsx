import React, { useEffect, useState, useContext } from "react";
import { CurrentUser } from "../App";
import { volunteersServices } from '../../services/volunteersServices'
function VolunteerShifts() {
  const { currentUser } = useContext(CurrentUser);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!currentUser?.id) return;
    if (!currentUser?.id) return;
    volunteersServices.getAll(
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
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Patient</th>
              <th>Contact Person</th>
              <th>Room Number</th>
              <th>Hospital</th>
              <th>Department</th>
              <th>Contact Email</th>
              {/* <th>Phone</th> */}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>{new Date(shift.date).toISOString().split('T')[0]}</td>
                <td>{shift.startTime}</td>
                <td>{shift.endTime}</td>
                <td>{shift.Hospitalized?.Patient?.fullName || "—"}</td>
                <td>{shift.ContactPerson?.fullName || "—"}</td>
                <td>{shift.Hospitalized?.roomNumber || "—"}</td>
                <td>{shift.Hospitalized?.Hospital?.description || "—"}</td>
                <td>{shift.Hospitalized?.Department?.description || "—"}</td>
                <td>{shift.ContactPerson?.User?.email || "—"}</td>
                {/* <td>{shift.ContactPerson?.User?.phone|| "—"}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VolunteerShifts;