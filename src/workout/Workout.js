import Interval from "./Interval";

export default class Workout {
    constructor(data, ftp, title = "Workout", description = "") {
        this.data = data;
        this.ftp = ftp;
        this.title = title;
        this.description = description;
        this.intervals = [];
        let currentInterval = new Interval(ftp);
        let lastValue;

        for(const value of this.data) {
            if(typeof(this.min) === 'undefined' || value.watts < this.min) {
                this.min = value.watts;
            }
            if(typeof(this.max) === 'undefined' || value.watts > this.max) {
                this.max = value.watts;
            }

            if(typeof(lastValue) !== 'undefined' && Math.abs(value.watts - lastValue.watts) > 10) {
                currentInterval.close();
                this.intervals.push(currentInterval);
                currentInterval = new Interval(ftp);
            }
            currentInterval.add(value);

            lastValue = value;
        }
        currentInterval.close();
        this.intervals.push(currentInterval);
    }

    toZwo() {
        let zwo = `<workout_file>
<author>Xert</author>
<name>${this.title}</name>
<description>${this.description}</description>
<sportType>bike</sportType>
<tags><tag name="Xert" /></tags>
<workout>
        ${this.intervals.map(interval => interval.toZwo()).join('\n')}
</workout>
</workout_file>`;
        return zwo;
    }
}
