// import React from 'react';
// function Sort({ type, userData, setData }) {
//     function sortFunc(e) {
//         e.preventDefault();
//         const key = e.target.value.toLowerCase();
//         const sortData = [...userData].sort((a, b) => {
//             let valueA = a[key];
//             let valueB = b[key];
//             if (key === "id") {
//                 valueA = Number(a.id);
//                 valueB = Number(b.id);
//             } else if (key === "a-z" || key === "title") {
//                 valueA = a.title?.toLowerCase();
//                 valueB = b.title?.toLowerCase();
//             } else if (key === "random") {
//                 return Math.random() - 0.5;
//             } else if (key === "completed") {
//                 valueA = a.completed ? 0 : 1;
//                 valueB = b.completed ? 0 : 1;
//             }
//             if (valueA < valueB) return -1;
//             if (valueA > valueB) return 1;
//             return 0;
//         });

//         setData(sortData);
//     }

//     return (
//         <select onChange={sortFunc} defaultValue="">
//             <option value="" disabled>Sort by</option>
//             <option value="id">ID</option>
//             <option value="title">A-Z</option>
//             <option value="random">Random</option>
//             {type === "todos" && <option value="completed">Completed</option>}
//         </select>
//     );
// };

// export default Sort;
import React from 'react';

function Sort({ type, userData, setData }) {
  function sortFunc(e) {
    e.preventDefault();
    const key = e.target.value;

    const sortedData = [...userData].sort((a, b) => {
      let valueA, valueB;

      switch (key) {
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'hospital':
          valueA = a.Hospitalized?.Hospital?.description?.toLowerCase() || '';
          valueB = b.Hospitalized?.Hospital?.description?.toLowerCase() || '';
          break;
        case 'department':
          valueA = a.Hospitalized?.Department?.description?.toLowerCase() || '';
          valueB = b.Hospitalized?.Department?.description?.toLowerCase() || '';
          break;
        case 'roomNumber':
          valueA = a.Hospitalized?.roomNumber || 0;
          valueB = b.Hospitalized?.roomNumber || 0;
          break;
        case 'patient':
          valueA = a.Hospitalized?.patientId || '';
          valueB = b.Hospitalized?.patientId || '';
          break;
        case 'random':
          return Math.random() - 0.5;
        default:
          return 0;
      }

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    setData(sortedData);
  }

  return (
    <select onChange={sortFunc} defaultValue="">
      <option value="" disabled>Sort by</option>
      <option value="date">Date</option>
      <option value="hospital">Hospital</option>
      <option value="department">Department</option>
      <option value="roomNumber">Room Number</option>
      {/* <option value="patient">Patient</option> */}
      <option value="random">Random</option>
    </select>
  );
}

export default Sort;
