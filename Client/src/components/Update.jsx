import React from "react";
import { useState } from "react";
import { apiService } from "../../services/genericServeices";
import { useContext } from "react";
import { CurrentUser } from "./App";
function Update({ type, itemId, setIsChange, inputs }) {
    const [screen, setScreen] = useState(0);
    const [formData, setFormData] = useState({});
    const { currentUser } = useContext(CurrentUser);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    async function updateFunc(e) {
        e.preventDefault();
        e.target.reset();
        setScreen(0);
        try {
            await apiService.patch(
                currentUser.id,
                type,
                itemId,
                formData,
                (result) => {
                    console.log("Update successful:", result);
                    setIsChange(1);
                },
                (error) => {
                    console.log("Update was unsuccessful:", error);
                },
            );
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }

    function handleCancel(e) {
        e.target.reset();
        setScreen(0);
    }

    return (
        <>
            {screen == 0 &&
                <button onClick={(e) => setScreen(1)} className="action-btn edit-btn">
                    <i className="fa fa-edit"></i>
                </button>}
            {screen == 1 && <div>
                <form onSubmit={updateFunc}>
                    {inputs.map((input, index) => (
                        <div key={index}>
                            <input
                                name={input}
                                placeholder={`Enter ${input}`}
                                value={formData[input] || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                    <button type="submit" value={"OK"}>OK</button>
                    <button onClick={handleCancel} value={"cancel"}>cancel</button>
                </form>
            </div>}
        </>
    )
}

export default Update;