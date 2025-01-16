import { formatTime } from "./timeUtils";

export default class Interval {
    constructor() {
        this.values = [];
    }

    add(value) {
        this.values.push(value);

        if(typeof(this.start) === "undefined") {
            this.start = value.seconds;
            this.startWatts = value.watts;
        }
    }

    close() {
        this.duration = this.values.length;
        this.endWatts = this.values[this.values.length - 1].watts;
        this.type = this.getType();
    }

    getLinearAccuracy() {
        const coef = (this.endWatts - this.startWatts) / this.duration;

        return this.values.map((value, index) => Math.abs(value.watts - (this.startWatts + coef * index))).reduce((a, b) => a + b, 0) / this.duration;
    }

    /**
     * Get interval type: flat, linear, curved
     * @param {*} interval 
     */
    getType() {
        const deltas = this.values.map((value, index) => {
            if(index === 0) {
                return 0;
            }
            return Math.abs(value.watts - this.values[index - 1].watts);
        }).slice(1);

        if(deltas.every(delta => Math.abs(delta) === 0)) {
            return "flat";
        }
        return this.getLinearAccuracy() > 3 ? "curved" : "linear";
    }

    toLinear() {
        const coef = (this.endWatts - this.startWatts) / this.duration;
        return Interval.fromValues(this.values.map((value, index) => ({
            seconds: value.seconds,
            watts: this.startWatts + coef * index,
        })));
    }

    toLinearIntervals() {
        const intervals = [];
        if(this.getLinearAccuracy() > 3) {
            const values1 = this.values.slice(0, Math.floor(this.values.length / 2));
            const values2 = this.values.slice(Math.floor(this.values.length / 2));
            intervals.push(...Interval.fromValues(values1).toLinearIntervals());
            intervals.push(...Interval.fromValues(values2).toLinearIntervals());
        } else {
            intervals.push(this.toLinear());
        }

        return intervals;
    }

    toZwo(ftp) {
        switch(this.type) {
            case "flat":
                return `<SteadyState Duration="${this.duration}" Power="${this.startWatts / ftp}" />`;
            case "linear":
                return `<Ramp Duration="${this.duration}" PowerLow="${this.startWatts / ftp}" PowerHigh="${this.endWatts / ftp}" />`;
            case "curved": {
                return this.toLinearIntervals().map(interval => interval.toZwo(ftp)).join("\n");
                // return `<IntervalsT Repeat="1" OnDuration="${this.duration}" OffDuration="0" OnPower="${this.endWatts}" OffPower="0" />`;
            }
        }
    }

    toString() {
        return `${this.type} @ ${formatTime(this.start)} : ${Math.floor(this.startWatts)}W -> ${Math.floor(this.endWatts)}W in ${this.duration}s`;
    }

    static fromValues(values) {
        const interval = new Interval();
        for(const value of values) {
            interval.add(value);
        }
        interval.close();
        return interval;
    }
}
