import React from "react";
import { useState } from "react";
import { userService } from "../services/usersServices";
import { useContext } from "react";
import { CurrentUser } from "./App";
import { useCodes } from "../components/Models";

function Update({ type, itemId, setIsChange, inputs, onSuccess = null }) {
    const [screen, setScreen] = useState(0);
    const [formData, setFormData] = useState({});
    const { currentUser } = useContext(CurrentUser);
    const { codes, loading } = useCodes();
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

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
            await userService.patch(
                currentUser.autoId,
                userTypeObj,
                type,
                itemId,
                formData,
                (result) => {
                    console.log("Update successful:", result);
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        setIsChange(prev => prev === 0 ? 1 : 0);
                    }
                },
                (error) => {
                    console.error(`Failed to update ${type} with ID ${itemId}: ${error}`);
                    alert("Update failed. Please try again.");
                }
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