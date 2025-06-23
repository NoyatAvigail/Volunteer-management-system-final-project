import React from 'react';
import '../style/Home.css'; 

function Volunteers() {
    return (
        <div className="home-container">
            <h1>Welcome, dear volunteer!</h1>
            <p className="slogan">MAKING A DIFFERENCE TOGETHER</p>
            <p>
                You’re not just a user in our system — <strong>you’re the heartbeat of our community</strong>.<br />
                Your willingness to give, your time, your care, and your presence — it truly inspires us all.
            </p>
            <p>
                Thanks to people like you, <strong>lives are changed every day</strong>.<br />
                We’re here to help you find the perfect place where you can shine, make an impact, and touch hearts.
            </p>
            <h2>What you can do:</h2>
            <ul>
                <li>Choose your preferences (sector, gender, hospital, department)</li>
                <li>Receive personalized shift suggestions</li>
                <li>Accept shifts that fit your schedule</li>
                <li>Manage your profile and download your certificate of appreciation</li>
            </ul>
            <p className="highlight">You're not alone. We're with you.</p>
            <p className="highlight">Together – we are MAKING A DIFFERENCE.</p>
        </div>
    );
}

export default Volunteers;