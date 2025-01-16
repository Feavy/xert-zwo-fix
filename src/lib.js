import Workout from "./Workout";
import { fetchData } from "./Xert";

export default async function downloadFixedZWO() {
    const response = await fetchData();
    const title = WorkoutDetails.$$.ctx[4].name;
    const workout = new Workout(response.data, title);
    download(workout.toZwo(247), `${title}.zwo`);
}

var download = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());
