import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { CurrentUser } from "./App";
import { userService } from "../services/usersServices";

function Add({ setIsChange = () => { }, inputs, defaultValue, name = "Add", type }) {
    const { currentUser } = useContext(CurrentUser);
    const [isScreen, setIsScreen] = useState(0);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            ...defaultValue,
            userId: currentUser.id
        },
    });

    const addFunc = async (body) => {
        const preparedBody = {
            ...body,
            patientId: Number(body.patientId),
            contactId: Number(body.contactId),
            volunteerId: body.volunteerId ? Number(body.volunteerId) : null,
            date: formatDateToISO(body.date),
        };

        console.log("Prepared body:", preparedBody);    

        reset();
        setIsScreen(0);
        try {
            await userService.create(
                currentUser.autoId,
                currentUser.type,
                type,
                preparedBody,
                (result) => {
                    console.log("add successful:", result);
                    setIsChange(1);
                    reset();
                },
                (error) => {
                    console.log("add was unsuccessful", error);
                });
        } catch (error) {
            console.log("Unexpected error:", error);
        }
    };

    const formatDateToISO = (inputDate) => {
        if (!inputDate) return null;
        const parts = inputDate.split('-');
        if (parts.length !== 3) return inputDate; 
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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