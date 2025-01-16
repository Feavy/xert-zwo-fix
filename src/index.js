import Canvas from "./Canvas";
import Workout from "./Workout";

const svgContainer = document.getElementById('svg-container');

(async () => {
    const response = await fetch("./data.json").then(data => data.json());

    const canvas = new Canvas(response.data.length, 600);

    for (let i = 0; i < 600; i += 100) {
        canvas.drawHorizontalLine(i, i + "W");
    }

    canvas.drawPath(response.data.map(({seconds, watts}) => ({x: seconds, y: watts})));

    svgContainer.appendChild(canvas.svg);

    const workout = new Workout(response.data);
    for(const interval of workout.intervals) {
        console.log(interval.toString(), interval.getFarestPoint());
    }
    console.log(workout.intervals[23])
    console.log(workout.intervals[23].toLinearIntervals())

    const intervals = workout.intervals[23].toLinearIntervals();
    for(const interval of intervals) {
        console.log(interval.toString());
        canvas.drawPath(interval.values.map(value => ({x: value.seconds, y: value.watts+10})), randomColor());
    }

    console.log(workout.toZwo(247));
})();

let colorIndex = 0;

function randomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#ff0080', '#80ff00', '#80ff00', '#0080ff', '#8000ff'];
    return colors[colorIndex++ % colors.length];
    // return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}