import Interval from "./Interval";

export default class Workout {
    constructor(data, title = "Workout") {
        this.data = data;
        this.title = title;
        this.intervals = [];
        let currentInterval = new Interval();
        let lastValue;

        for(const value of this.data) {
            if(typeof(this.min) === 'undefined' || value.watts < this.min) {
                this.min = value.watts;
            }
            if(typeof(this.max) === 'undefined' || value.watts > this.max) {
                this.max = value.watts;
            }

            if(typeof(lastValue) !== 'undefined' && Math.abs(value.watts - lastValue.watts) > 50) {
                currentInterval.close();
                this.intervals.push(currentInterval);
                currentInterval = new Interval();
            }
            currentInterval.add(value);

            lastValue = value;
        }
        currentInterval.close();
        this.intervals.push(currentInterval);
    }

    toZwo(ftp) {
        let zwo = `<workout_file>
<author>Xert</author>
<name>${this.title}</name>
<description>Time-trials are hard, and they're even harder if you go out too fast.  Feel the difference between proper and improper pacing in this demonstration workout that's also a great workout on its own.</description>
<sportType>bike</sportType>
<tags><tag name="Xert" /></tags>
<workout>
        ${this.intervals.map(interval => interval.toZwo(ftp)).join('\n')}
</workout>
</workout_file>`;
        return zwo;
    }
}
