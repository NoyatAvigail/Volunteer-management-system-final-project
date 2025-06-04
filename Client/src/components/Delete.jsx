import React, { useState } from "react";
import { apiService } from "../../services/genericServeices";
import { useContext } from "react";
import { CurrentUser } from "./App";

function Delete({ type, itemId, setIsChange, deleteChildren = null, typeOfChild = null }) {
    const { currentUser } = useContext(CurrentUser);
    const [process, setProcess] = useState(0);

    async function deleteFunc(e) {
        try {
            await apiService.remove(
                currentUser.id,
                type,
                itemId,
                (result) => {
                    console.log("Delete successful:", result);
                    setIsChange(1);
                },
                (error) => {
                    console.error(`Failed to delete ${type} with ID ${itemId}: ${error}`);
                    alert("Failed to delete the item. Please try again.");
                },
            );
        } catch (error) {
            console.error("Unexpected error:", error);
        }
        setProcess(0);
    }

    return (
        <>
            <button onClick={(e) => deleteFunc(e)} className="action-btn delete-btn">
                <i className="fa fa-trash"></i>
            </button>
            {process == 1 && <h3>in process...</h3>}
        </>
    )
}

export default Delete;