import React, { useState, useContext } from "react";
import { updatHandler } from "../services/servicesSelector";
import { CurrentUser } from "./App";
import { useCodes } from "../components/Models";

function Update({ type, itemId, setIsChange, inputs, defaultValue = {}, onSuccess = null }) {
    const [screen, setScreen] = useState(0);
    const [formData, setFormData] = useState(defaultValue);
    const { currentUser } = useContext(CurrentUser);
    const { codes } = useCodes();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    async function updateFunc(e) {
        e.preventDefault();
        setScreen(0);
        try {
            await updatHandler(
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

    function handleCancel() {
        setScreen(0);
    }

    return (
        <>
            {screen === 0 && (
                <button onClick={() => setScreen(1)} className="action-btn edit-btn">
                    <i className="fa fa-edit"></i>
                </button>
            )}
            {screen === 1 && (
                <form onSubmit={updateFunc}>
                    {inputs.map((input, index) => {
                        const inputName = typeof input === "string" ? input : input.name;
                        const inputType = typeof input === "string" ? "text" : input.type || "text";
                        const options = typeof input === "object" && input.options;
                        return (
                            <div key={index}>
                                {inputType === "select" ? (
                                    <select
                                        name={inputName}
                                        value={formData[inputName] || ''}
                                        onChange={(e) => {
                                            handleInputChange(e);
                                            if (typeof input === "object" && typeof input.onChange === "function") {
                                                input.onChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">Choose {inputName}</option>
                                        {options?.map((option, i) => (
                                            <option key={i} value={option.value ?? option}>
                                                {typeof option === 'object' ? option.label : option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={inputType}
                                        name={inputName}
                                        value={formData[inputName] || ''}
                                        placeholder={`Enter ${inputName}`}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </div>
                        );
                    })}
                    <button type="submit">OK</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}
        </>
    );
}

export default Update;
