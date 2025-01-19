import Workout from "./workout/Workout";
import { fetchFtp, fetchWorkoutData } from "./services/XertService";

async function downloadFixedZWO() {
    const workoutData = await fetchWorkoutData();
    const ftp = await fetchFtp();
    const title = WorkoutDetails.$$.ctx[4].name;
    const workout = new Workout(workoutData.data, ftp, title);
    download(workout.toZwo(), `${title}.zwo`);
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

(function() {
    const btns = document.getElementsByClassName("btns-row")[0];
    const newButton = document.createElement("a");
    newButton.className = "svelte-9g3kuk";
    newButton.innerHTML = `<button class="svelte-9g3kuk"><span class="svelte-9g3kuk"><i class="fa fa-circle-arrow-down svelte-9g3kuk"></i> <p class="svelte-9g3kuk">ZWO (fix)</p></span></button>`;
    btns.insertBefore(newButton, btns.childNodes[1]);

    newButton.addEventListener("click", downloadFixedZWO);
})();