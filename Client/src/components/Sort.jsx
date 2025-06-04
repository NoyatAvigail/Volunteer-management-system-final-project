import React from 'react';
function Sort({ type, userData, setData }) {
    function sortFunc(e) {
        e.preventDefault();
        const key = e.target.value.toLowerCase();
        const sortData = [...userData].sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];
            if (key === "id") {
                valueA = Number(a.id);
                valueB = Number(b.id);
            } else if (key === "a-z" || key === "title") {
                valueA = a.title?.toLowerCase();
                valueB = b.title?.toLowerCase();
            } else if (key === "random") {
                return Math.random() - 0.5;
            } else if (key === "completed") {
                valueA = a.completed ? 0 : 1;
                valueB = b.completed ? 0 : 1;
            }
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });

        setData(sortData);
    }

    return (
        <select onChange={sortFunc} defaultValue="">
            <option value="" disabled>Sort by</option>
            <option value="id">ID</option>
            <option value="title">A-Z</option>
            <option value="random">Random</option>
            {type === "todos" && <option value="completed">Completed</option>}
        </select>
    );
};

export default Sort;