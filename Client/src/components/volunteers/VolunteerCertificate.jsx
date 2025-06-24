import React, { useEffect, useState, useContext } from 'react';
import html2pdf from 'html2pdf.js';
import { CurrentUser } from "../App";
import { volunteersServices } from '../../services/volunteersServices';

function Certificate() {
  const { currentUser } = useContext(CurrentUser);
  const [hours, setHours] = useState(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await volunteersServices.getAll('certificate');
        setHours(data.totalHours);
        console.log("currentUser:",currentUser);
        console.log("currentUser.fullName:",currentUser.fullName);
        
        setFullName(currentUser.fullName);
      } catch (err) {
        console.error("Failed to load certificate:", err);
      }
    };

    if (currentUser?.id) {
      fetchCertificate();
    }
  }, [currentUser?.id]);

  const downloadPDF = () => {
    const element = document.getElementById('certificate');
    html2pdf().from(element).save(`${fullName}-certificate.pdf`);
  };

  return (
    <div className="certificate-container">
      <div id="certificate" className="certificate-box">
        <h1>Certificate of Appreciation</h1>
        <p>This certificate is proudly presented to</p>
        <h2>{fullName} </h2>
        <p>For dedicated volunteer service and contributing a total of</p>
        <h3>{hours !== null ? `${hours} hours` : '0'}</h3>
        <p>of community service.</p>
        <p className="sign">_____________________<br />Volunteer Coordinator</p>
      </div>
      <button onClick={downloadPDF} className="download-button">Download PDF</button>
    </div>
  );
}

export default Certificate;
