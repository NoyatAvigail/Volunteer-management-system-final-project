import React, { useState, useContext } from "react";
import { apiService } from "../../services/genericServeices";
import { CurrentUser } from "./App";

function Delete({
    type,
    itemId,
    setIsChange,
    onSuccess = null,
}) {
    const { currentUser } = useContext(CurrentUser);
    const [process, setProcess] = useState(0);

    async function deleteFunc(e) {
        e.preventDefault();
        setProcess(1);
        try {
            await apiService.remove(
                currentUser.autoId,
                currentUser.type,
                type,
                itemId,
                (result) => {
                    console.log("Delete successful:", result);
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        setIsChange(prev => prev == 0 ? 1 : 0);
                    }
                },
                (error) => {
                    console.error(`Failed to delete ${type} with ID ${itemId}: ${error}`);
                    alert("מחיקה נכשלה. נסה שוב.");
                }
            );
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