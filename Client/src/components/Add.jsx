import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { CurrentUser } from "./App";
import { apiService } from "../../services/genericServeices"

function Add({ type, setIsChange, inputs, defaultValue, name = "Add" }) {
    const { currentUser } = useContext(CurrentUser);
    const [isScreen, setIsScreen] = useState(0);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            ...defaultValue,
            userId: currentUser.id
        },
    });

    const addFunc = async (body) => {
        reset();
        setIsScreen(0);
        try {
            await apiService.create(
                currentUser.id,
                currentUser.type,
                body,
                (result) => {
                    console.log("add successful:", result);
                    setIsChange(1);
                    reset();
                },
                (error) => {
                    console.log("add was unsuccessful", error);
                },
            );
        } catch (error) {
            console.log("Unexpected error:", error);
        }
    };

    const handleCancel = () => {
        reset();
        setIsScreen(0);
    };

    return (
        <>
            {isScreen === 0 && <button className="addBtn" onClick={() => setIsScreen(1)}>{name}</button>}
            {isScreen === 1 && (
                <form onSubmit={handleSubmit(addFunc)}>
                    {inputs.map((input, index) => (
                        <div key={index}>
                            <input
                                {...register(input, { required: true })}
                                placeholder={`Enter ${input}`}
                            />
                            {errors[input] && <span>{input} is required</span>}
                        </div>
                    ))}
                    <button className="add" type="submit">OK</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}
        </>
    );
}

export default Add;