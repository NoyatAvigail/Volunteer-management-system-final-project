import React from 'react';
import '../style/Home.css'

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to our Volunteers Platform</h1>
            <p className="slogan">MAKING A DIFFERENCE TOGETHER</p>
            <p>
                Our website is a unique and inclusive space where giving and compassion meet the human heart.
            </p>
            <p>
                Here, motivated volunteers from all backgrounds come together, driven by a genuine desire to contribute and make a positive impact. We provide simple and accessible tools that allow every volunteer to offer their help with dedication and care.
            </p>
            <h2>How does it work?</h2>
            <p>
                Every volunteer registers by filling in their personal details along with preferences such as sector, gender, hospitals, and departments. Based on these preferences, the system suggests relevant shifts tailored just for them. When a volunteer accepts a shift, responsibility is taken with full commitment, and an immediate notification is sent to the patient’s contact person, ensuring smooth communication and trust.
            </p>
            <p>
                At the same time, every patient can register through a contact person, add their requests and needs, and our system strives to match them with the most suitable volunteer — someone who will provide safe, attentive, and heartfelt support.
            </p>
            <h2 className="highlight">Our platform is more than a system — </h2>
            <h2 className="highlight">It’s a community of giving, partnership, and hope.</h2>
            <p>
                Every volunteer is a hero here, and every patient is cared for with trustworthy, compassionate hands.
            </p>
            <p>
                Join us and be part of a change that starts with one small act of kindness —
            </p>
            <h2>
                <strong>MAKING A DIFFERENCE TOGETHER.</strong>
            </h2>

        </div>
    );
}

export default Home;