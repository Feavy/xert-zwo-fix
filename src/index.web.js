import Canvas from "./vizualisation/Canvas";
import Workout from "./workout/Workout";
import DataJson from "./assets/Highway To Hell.json?url";
// import DataJson from "./assets/Nothing Else Matters.json?url";

const svgContainer = document.getElementById('svg-container');

(async () => {
    const response = await fetch(DataJson).then(data => data.json());

    const canvas = new Canvas(response.data.length, 600);

    for (let i = 0; i < 600; i += 100) {
        canvas.drawHorizontalLine(i, i + "W");
    }

    canvas.drawPath(response.data.map(({seconds, watts}) => ({x: seconds, y: watts})));

    svgContainer.appendChild(canvas.svg);

    const workout = new Workout(response.data, 247);
    for(const interval of workout.intervals) {
        console.log(interval.toString(), interval.getMaxDistance());
    }

    for(const interval of workout.intervals) {
        const linearIntervals = interval.toLinearIntervals();
        if(linearIntervals.length > 1) {
            for(const interval2 of linearIntervals) {
                canvas.drawPath(interval2.values.map(value => ({x: value.seconds, y: value.watts})), randomColor());
                canvas.drawText(interval2.values[0].seconds, interval2.values[0].watts-20, interval2.values.length);
            }
        }
    }

    console.log(workout.toZwo());
})();

let colorIndex = 0;

function randomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#ff0080', '#80ff00', '#80ff00', '#0080ff', '#8000ff'];
    return colors[colorIndex++ % colors.length];
}