exports.getDate =  () => {
    var todaydate = new Date();
    const options = {
        weekday: "long",
        month: "short",
        day: "numeric"
    };
    return todaydate.toLocaleDateString("en-US", options);
};

// exports.getDay = () => {
//     var todaydate = new Date();
//     const options = {
//         weekday: "long",
//     };
//     return todaydate.toLocaleDateString("en-US", options);
// };
