export async function fetchFtp() {
    const csrf = document.getElementsByName("_token")[0].value
    const response = await fetch(`/my-fitness`, {
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            "X-CSRF-TOKEN": csrf,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }
    }).then(data => data.text());
    const trainingAdvice = JSON.parse(response.split("trainingAdvice:")[1].split(",\n")[0]);
    return trainingAdvice.signature.ftp.toFixed(0);
}

export async function fetchWorkoutData() {
    const workoutId = window.location.href.split("/workout/")[1].split("/")[0];
    const csrf = document.getElementsByName("_token")[0].value
    const response = await fetch(`/workout/${workoutId}/data`, {
        credentials: "same-origin",
        cache: "no-store",
        headers: {
            "X-CSRF-TOKEN": csrf,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
        }
    }).then(data => data.json());
    return response;
}