import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { CurrentUser } from "./App";
import { CodesContext } from './Models';
import { userService } from "../services/usersServices";

function Add({ setIsChange = () => { }, inputs, defaultValue, name = "Add", type }) {
    const { currentUser } = useContext(CurrentUser);
    const [isScreen, setIsScreen] = useState(0);
    const { codes, loading } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            ...defaultValue,
        },
    });

    const addFunc = async (body) => {
        if (!body.hospitalizationEnd || body.hospitalizationEnd === "Invalid date" || body.hospitalizationEnd.trim() === "") {
            body.hospitalizationEnd = null;
        }
        reset();
        setIsScreen(0);
        try {
            await userService.create(
                currentUser.autoId,
                userTypeObj,
                type,
                body,
                (result) => {
                    console.log("add successful:", result);
                    setIsChange(1);
                    reset();
                },
                (error) => {
                    console.log("add was unsuccessful", error);
                }
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
            {isScreen === 0 && (
                <button className="addBtn" onClick={() => setIsScreen(1)}>{name}</button>
            )}
            {isScreen === 1 && (
                <form onSubmit={handleSubmit(addFunc)}>
                    {inputs.map((input, index) => {
                        const inputName = typeof input === "string" ? input : input.name;
                        const inputType = typeof input === "string" ? "text" : input.type || "text";
                        const options = typeof input === "object" && input.options;

                        return (
                            <div key={index}>
                                {inputType === "select" ? (
                                    <select
                                        {...register(inputName, { required: true })}
                                        onChange={(e) => {
                                            if (typeof input === "object" && typeof input.onChange === "function") {
                                                input.onChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">choose {inputName}</option>
                                        {options?.map((option, i) => (
                                            <option key={i} value={option.value ?? option}>
                                                {typeof option === 'object' ? option.label : option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={inputType}
                                        {...register(inputName, inputName == "hospitalizationEnd" ? {} : { required: true })}
                                        placeholder={`Enter ${inputName}`}
                                        onChange={(e) => {
                                            if (typeof input === "object" && typeof input.onChange === "function") {
                                                input.onChange(e);
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                    <button className="add" type="submit">OK</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}
        </>
    );
}

export default Add;