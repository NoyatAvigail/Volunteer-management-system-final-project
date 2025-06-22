import React, { useState, useContext } from "react";
import { deleteHandler } from "../services/servicesSelector";
import { CurrentUser } from "./App";
import { useCodes } from "./Models";

function Delete({
    type,
    itemId,
    setIsChange,
    onSuccess = null,
}) {
    const { currentUser } = useContext(CurrentUser);
    const [process, setProcess] = useState(0);
    const { codes, loading } = useCodes();
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;

    async function deleteFunc(e) {
        e.preventDefault();
        setProcess(1);
        try {
            await deleteHandler({
                type,
                id: itemId,
                onSuccess: () => {
                    console.log("Delete successful:", result);
                    if (onSuccess) onSuccess();
                    else setIsChange(prev => (prev === 0 ? 1 : 0));
                },
                onError: (error) => {
                    console.error("Deletion was unsuccessful", error);
                }
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
        setProcess(0);
    }

    return (
        <>
            <button onClick={deleteFunc} className="action-btn delete-btn">
                <i className="fa fa-trash"></i>
            </button>
            {process === 1 && <h3>in process...</h3>}
        </>
    );
}

export default Delete;