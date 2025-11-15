// const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/applications`;

// const applyForEvent = async (eventId) => {
//     try {
//         const res = await fetch(BASE_URL, {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ eventId }),
//         });

//         return res.json();
//     } catch (error) {
//         console.log(error);
//     }
// };

// export {
//     applyForEvent,
// }