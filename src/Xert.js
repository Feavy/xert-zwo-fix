export async function fetchData() {
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