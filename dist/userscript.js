// ==UserScript==
// @name         Xert - Zwift Curvilinear Intervals fixed
// @namespace    http://tampermonkey.net/
// @version      2025-01-18
// @description  Fix exported curvilinear intervals from Xert workouts to Zwift ZWO format
// @author       Feavy
// @match        https://www.xertonline.com/workout/*/view
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xertonline.com
// @grant        none
// ==/UserScript==

var d = Object.defineProperty;
var f = (a, t, s) => t in a ? d(a, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[t] = s;
var u = (a, t, s) => f(a, typeof t != "symbol" ? t + "" : t, s);
function l(a, t, s, e, n, o) {
  return Math.abs((n - s) * (e - t) - (s - a) * (o - e)) / Math.sqrt((n - s) ** 2 + (o - e) ** 2);
}
function w(a) {
  const t = Math.floor(a / 60), s = a % 60;
  return `${t}:${s < 10 ? "0" : ""}${s}`;
}
const i = class i {
  constructor(t) {
    this.values = [], this.ftp = t;
  }
  add(t) {
    this.values.push(t), typeof this.start > "u" && (this.start = t.seconds, this.startWatts = t.watts), (typeof this.minWatts > "u" || t.watts < this.minWatts) && (this.minWatts = t.watts), (typeof this.maxWatts > "u" || t.watts > this.maxWatts) && (this.maxWatts = t.watts);
  }
  close() {
    this.duration = this.values.length, this.endWatts = this.values[this.values.length - 1].watts, this.type = this.getType();
  }
  getFarestPoint() {
    let t = -1, s = null;
    for (const e of this.values) {
      const n = l(e.seconds, e.watts, this.start, this.startWatts, this.start + this.duration, this.endWatts);
      n > t && (t = n, s = e);
    }
    return s;
  }
  getMaxDistance() {
    const t = this.getFarestPoint();
    return l(t.seconds, t.watts, this.start, this.startWatts, this.start + this.duration, this.endWatts);
  }
  getMaxSubIntervalLength() {
    const t = this.getFarestPoint(), s = this.values.indexOf(t);
    return this.maxWatts > this.ftp * 1.4 ? 10 : s;
  }
  getType() {
    return this.values.map((s, e) => e === 0 ? 0 : Math.abs(s.watts - this.values[e - 1].watts)).slice(1).every((s) => Math.abs(s) === 0) ? "flat" : this.getMaxDistance() > i.CURVED_THRESHOLD ? "curved" : "linear";
  }
  toLinear() {
    if (this.values.length < 15) {
      const t = (this.startWatts + this.endWatts) / 2;
      return i.fromValues(this.values.map((s) => ({
        seconds: s.seconds,
        watts: t
      })));
    } else {
      const t = (this.endWatts - this.startWatts) / this.duration;
      return i.fromValues(this.values.map((s, e) => ({
        seconds: s.seconds,
        watts: this.startWatts + t * e
      })));
    }
  }
  toLinearIntervals() {
    const t = [];
    if (this.getMaxDistance() > i.CURVED_THRESHOLD) {
      const s = this.getMaxSubIntervalLength(), e = this.values.slice(0, s), n = this.values.slice(s);
      t.push(...i.fromValues(e, this.ftp).toLinearIntervals()), t.push(...i.fromValues(n, this.ftp).toLinearIntervals());
    } else
      t.push(this.toLinear());
    return t;
  }
  toZwo(t) {
    switch (this.type) {
      case "flat":
        return `<SteadyState Duration="${this.duration}" Power="${this.startWatts / t}" />`;
      case "linear":
        return `<Ramp Duration="${this.duration}" PowerLow="${this.startWatts / t}" PowerHigh="${this.endWatts / t}" />`;
      case "curved":
        return this.toLinearIntervals().map((s) => s.toZwo(t)).join(`
`);
    }
  }
  toString() {
    return `${this.type} @ ${w(this.start)} : ${Math.floor(this.startWatts)}W -> ${Math.floor(this.endWatts)}W in ${this.duration}s`;
  }
  static fromValues(t, s) {
    const e = new i(s);
    for (const n of t)
      e.add(n);
    return e.close(), e;
  }
};
u(i, "CURVED_THRESHOLD", 3);
let c = i;
class p {
  constructor(t, s, e = "Workout", n = "") {
    this.data = t, this.ftp = s, this.title = e, this.description = n, this.intervals = [];
    let o = new c(s), h;
    for (const r of this.data)
      (typeof this.min > "u" || r.watts < this.min) && (this.min = r.watts), (typeof this.max > "u" || r.watts > this.max) && (this.max = r.watts), typeof h < "u" && Math.abs(r.watts - h.watts) > 10 && (o.close(), this.intervals.push(o), o = new c(s)), o.add(r), h = r;
    o.close(), this.intervals.push(o);
  }
  toZwo() {
    return `<workout_file>
<author>Xert</author>
<name>${this.title}</name>
<description>${this.description}</description>
<sportType>bike</sportType>
<tags><tag name="Xert" /></tags>
<workout>
        ${this.intervals.map((s) => s.toZwo()).join(`
`)}
</workout>
</workout_file>`;
  }
}
async function m() {
  const a = document.getElementsByName("_token")[0].value, t = await fetch("/my-fitness", {
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "X-CSRF-TOKEN": a,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json"
    }
  }).then((e) => e.text());
  return JSON.parse(t.split("trainingAdvice:")[1].split(`,
`)[0]).signature.ftp.toFixed(0);
}
async function v() {
  const a = window.location.href.split("/workout/")[1].split("/")[0], t = document.getElementsByName("_token")[0].value;
  return await fetch(`/workout/${a}/data`, {
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "X-CSRF-TOKEN": t,
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json"
    }
  }).then((e) => e.json());
}
async function g() {
  const a = await v(), t = await m(), s = WorkoutDetails.$$.ctx[4].name, e = WorkoutDetails.$$.ctx[4].description, n = new p(a.data, t, s, e);
  W(n.toZwo(), `${s}.zwo`);
}
var W = function() {
  var a = document.createElement("a");
  return document.body.appendChild(a), a.style = "display: none", function(t, s) {
    var e = new Blob([t], { type: "octet/stream" }), n = window.URL.createObjectURL(e);
    a.href = n, a.download = s, a.click(), window.URL.revokeObjectURL(n);
  };
}();
(function() {
  const a = document.getElementsByClassName("btns-row")[0], t = document.createElement("a");
  t.className = "svelte-9g3kuk", t.innerHTML = '<button class="svelte-9g3kuk"><span class="svelte-9g3kuk"><i class="fa fa-circle-arrow-down svelte-9g3kuk"></i> <p class="svelte-9g3kuk">ZWO (fix)</p></span></button>', a.insertBefore(t, a.childNodes[1]), t.addEventListener("click", g);
})();
