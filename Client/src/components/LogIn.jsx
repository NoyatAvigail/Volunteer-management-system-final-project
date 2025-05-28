import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { CurrentUser } from './App';
import { validateLoginForm } from '../../utils/userValidator';
import { login } from '../../services/usersServices';
import '../style/LogIn.css';

function LogIn() {
    const { register, handleSubmit, reset } = useForm();
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const [responsText, setResponstText] = useState("Fill the form and click the login button");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const error = validateLoginForm(data);
        if (error) {
            setResponstText(error);
            return;
        }
        await login(
            { username: data.username, password: data.password },
            (res) => {
                if (res.user) {
                    localStorage.setItem("currentUser", JSON.stringify(res.user));
                    navigate(`/home`);
                    Cookies.set("token", res.token);
                    setCurrentUser(res.user);
                } else {
                    setResponstText('Incorrect username or password');
                }
            },
            () => {
                setResponstText('ERROR');
            }
        );
        reset();
        setTimeout(() => setResponstText("Fill the form and click the login button"), 2000);
    };

    return (
        <div className="back-ground-img">
            <h2>Login</h2>
            <div className="entryContainer">
                <form onSubmit={handleSubmit(onSubmit)} className="entryForm">
                    <input type="text" placeholder="username" {...register("username")} required />
                    <input type="email" placeholder="email" {...register("email")} required />
                    <input type="password" placeholder="password" {...register("password")} required />
                    <button type="submit">log in</button>
                    <h4>{responsText}</h4>
                </form>
            </div>
        </div>
    );
}

export default LogIn;