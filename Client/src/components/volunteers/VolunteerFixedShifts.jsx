import React, { useState, useEffect } from 'react';

function FixedShifts() {
  const [fixedShifts, setFixedShifts] = useState([]);

  useEffect(() => {
    // כאן תביאי את המשמרות הקבועות
  }, []);

  return (
    <div className="section">
      <h2>משמרות קבועות</h2>
      {fixedShifts.map(fixed => (
        <div key={fixed.id} className="post-item">
          <p>#{fixed.id}</p>
          <p>יום: {fixed.weekDay}</p>
          <p>שעה: {fixed.hour}</p>
        </div>
      ))}
    </div>
  );
}

export default FixedShifts;
