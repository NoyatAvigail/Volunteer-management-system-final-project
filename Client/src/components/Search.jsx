import React, { useState } from "react";

function Search({ setIsChange, options, data, setData }) {
    const [searchParams, setSearchParams] = useState({ type: "", value: "" });

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value
        }));
    };

    const searchFunc = (e) => {
        e.preventDefault();
        const { type, value } = searchParams;
        if (type === "All") {
            setIsChange(1);
            return;
        }
        if (!type || !value) {
            alert("Please select a type and enter a value");
            return;
        }
        const typeLower = type.toLowerCase();
        if (type === "ID" && !/^\d+$/.test(value)) {
            alert("Please enter a numeric ID");
            return;
        }
        if (type === "Completed") {
            const lower = value.toLowerCase();
            if (lower !== "true" && lower !== "false") {
                alert("For 'Completed' search, enter 'true' or 'false'");
                return;
            }
            const searchValue = lower === "true";
            const filtered = data.filter((item) => item.completed === searchValue);
            setData(filtered);
        } else {
            const filtered = data.filter((item) => {
                const fieldValue = item[typeLower];
                return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
            });
            setData(filtered);
        }

        setSearchParams({ type: "", value: "" });
    };

    return (
        <div className="search-container">
            <form onSubmit={searchFunc}>
                <input
                    name="value"
                    className="search"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    value={searchParams.value}
                />
                <select name="type" onChange={handleSearchChange} value={searchParams.type}>
                    <option value="" disabled>Search by</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default Search;
