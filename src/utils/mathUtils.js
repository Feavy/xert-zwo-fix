/**
 * Returns the distance between (x, y) and the line defined by (xa, ya) and (xb, yb).
 * @param {*} x 
 * @param {*} y 
 * @param {*} xa 
 * @param {*} ya 
 * @param {*} xb 
 * @param {*} yb 
 * @returns 
 */
export function distanceToLine(x, y, xa, ya, xb, yb) {
    return Math.abs((xb - xa) * (ya - y) - (xa - x) * (yb - ya)) / Math.sqrt((xb - xa) ** 2 + (yb - ya) ** 2);
}