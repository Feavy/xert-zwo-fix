export default class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // this.svg.setAttribute('transform', 'scale(3, 3)');
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height + 50}`);
    }

    drawPath(points, color = 'black') {
        let path = '';

        let i = 0;
        for (const {x, y} of points) {
            path += ` ${i == 0 ? 'M' : 'L'}${x} ${this.height - y}`;
            i++;
        }
    
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        pathElement.setAttribute('stroke', color);
        pathElement.setAttribute('stroke-width', 3);
        pathElement.setAttribute('fill', 'none');
        this.svg.appendChild(pathElement);
    }

    drawHorizontalLine(y, label) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 80);
        line.setAttribute('y1', this.height - y);
        line.setAttribute('x2', this.width);
        line.setAttribute('y2', this.height - y);
        line.setAttribute('stroke', '#eee');
        line.setAttribute('stroke-width', 2);
        this.svg.appendChild(line);
    
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 0);
        text.setAttribute('y', this.height - y + 10);
        text.setAttribute('font-size', 25);
        text.textContent = label;
        this.svg.appendChild(text);
    }

    drawText(x, y, label) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', this.height - y);
        text.setAttribute('font-size', 15);
        text.textContent = label;
        this.svg.appendChild(text);
    }

}