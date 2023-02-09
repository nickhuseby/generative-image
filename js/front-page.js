(function () {

    /* BEGIN UTILITIES */

    function curry(f) {
        return function curried(...args) {
            if (args.length >= f.length) {
                return f.apply(this, args);
            } else {
                return (...args2) => {
                    return curried.apply(this, args.concat(args2));
                }
            }
        }
    }

    function getParetoRandom(min, max, alpha = 1) {
        const u = Math.random();
        const x =
            (-(
                (u * max ** alpha - u * min ** alpha - max ** alpha) /
                (max ** alpha * min ** alpha)
            )) ** -(1 / alpha);

        return x;
    }

    function range(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }

        return Math.random() * (max - min) + min;
    }

    function rangeFloor(min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }

        return Math.floor(range(min, max));
    }

    function getNormalizedRandom(min, max, std = 1, skew = 1) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        let num = std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos( 2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;
        if (num > 1 || num < 0) num = getNormalizedRandom(min, max, std, skew);
        else {
            num = Math.pow(num, skew);
            num *= max - min;
            num += min;
        }
        return num;
    }

    function lerp(pt1, pt2, t) {
        // t * pt1 + (1 - t) * pt2
        return [
            t * pt1[0] + (1-t) * pt2[0],
            t * pt1[1] + (1-t) * pt2[1],
        ];
    }

    function dist(pt1, pt2) {
        let x1, y1, x2, y2;
        [ x1, y1 ] = pt1;
        [ x2, y2 ] = pt2;
        return Math.sqrt(((x2 - x1)**2) + ((y2 - y1)**2));
    }

    /* END UTILITIES */

    /* BEGIN CIRCLES */

    // local variables 
    const placedCircles = [];
    const maxTries = 50;
    const circleNum = 80 * 25;
    const minSize = 5;
    const maxSize = 100;
    const alpha = 2.85;
    const circlesMargin = 2;
    const circlesWidth = 1200;
    const circlesHeight = 675;

    // check for collisions between circles
    function noCollisions(placedCircles, circle) {
        let none = true;
        for (let i = 0; i < placedCircles.length; i++) {
            const distanceBetween = Math.sqrt(((placedCircles[i].x - circle.x) ** 2) + ((placedCircles[i].y - circle.y) ** 2));
            none = (circle.radius + placedCircles[i].radius) < distanceBetween;
            if (!none) break;
        }
        return none;
    }

    // pack circles
    function pack(width, height, margin, maxTries, areaFn, collisionFn, placedCircles, circles) {
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            let offset = margin + circle.radius;
            let tries = 0;
            while (true) {
                circle.x = rangeFloor(offset, width - offset);
                circle.y = rangeFloor(offset, height - offset);
                if (areaFn(circle) && collisionFn(circle)) {
                    placedCircles.push(circle);
                    break;
                }
                else {
                    tries++;
                    if (tries > maxTries) {
                        console.log('quit after maxTries')
                        break;
                    }
                }
            }
        }
        return placedCircles;
    }
    // draw a circle on the svg
    function drawCircle(svg, circle, index) {
        const ns = "http://www.w3.org/2000/svg";
        const el = document.createElementNS(ns, 'circle');
        el.setAttribute('cx', circle.x);
        el.setAttribute('cy', circle.y);
        el.setAttribute('pathLength', '100');
        el.setAttribute('transform', `rotate(${rangeFloor(0, 360)}, ${circle.x}, ${circle.y})`);
        el.setAttribute('style', `animation-delay: ${index}ms`);
        el.setAttribute('r', circle.radius);
        svg.appendChild(el);
    }

    function runCircles() {
        const svg = document.getElementById('circles');
        const circles = Array(circleNum).fill().map(() => {
            return {
                radius: getParetoRandom(Math.floor(minSize), Math.floor(maxSize), alpha),
            }
        });

        circles.sort((a, b) => b.radius - a.radius);

        // setup draw function
        const drawer = curry(drawCircle);
        const draw = drawer(svg)

        // setup collision checking function
        const collider = curry(noCollisions);
        const collisionClear = collider(placedCircles);

        // setup packing function with collision check
        const packer = curry(pack);
        const packDimensions = packer(circlesWidth, circlesHeight, circlesMargin, maxTries);
        const packSVG = packDimensions(() => true, collisionClear, placedCircles);

        packSVG(circles);

        placedCircles.forEach((circle, i) => {
            draw(circle, i);
        });
    }

    /* END CIRCLES */

    /* BEGIN TRIANGLES */
    
    // local variables
    const trianglesWidth = 1200;
    const trianglesHeight = 675;
    const trianglesMargin = 2;
    const maxDepth = 7;
    const placedTriangles = [];

    function getIndexFromLongest(points) {
        const ab = dist(points[0], points[1]);
        const bc = dist(points[1], points[2]);
        const ac = dist(points[0], points[2]);
        if (ab > bc && ab > ac) {
            return 2;
        }
        if (bc > ab && bc > ac) {
            return 0;
        }
        return 1;
    }

    function divide(depth, pointsArr, container) {
        // add triangle to container array
        container.push(pointsArr);    
        // if the function has reached maxDepth then return
        if (depth > maxDepth || (Math.random() < 0.05 && depth > maxDepth / 2)) {
            return;
        }
        // get the longest side
        const index = getIndexFromLongest(pointsArr);
        // filter out shorter sides
        const rem = pointsArr.filter((_, i) => i !== index);
        // get the new point (near midpoint of the longest side)
        const newPoint = lerp(rem[0], rem[1], getNormalizedRandom(0, 1));
        // push new triangles to container array
        container.push([newPoint, pointsArr[0], pointsArr[1]]);
        container.push([newPoint, pointsArr[0], pointsArr[2]]);
        // begin next recursion
        divide(depth + 1, [newPoint, pointsArr[index], rem[0]], container);
        divide(depth + 1, [newPoint, pointsArr[index], rem[1]], container);
    }

    function drawTriangle(svg, triangle) {
        const ns = "http://www.w3.org/2000/svg";
        const el = document.createElementNS(ns, 'polygon');
        const points = triangle.map(point => point.join(",")).join(" ");
        el.setAttribute('points', points);
        el.setAttribute('pathLength', '100');
        svg.appendChild(el);
    }

    function runTriangles() {
        const svg = document.getElementById('triangles');

        divide(1, [ 
            [ trianglesMargin, trianglesMargin ],
            [ trianglesMargin, trianglesHeight - trianglesMargin ],
            [ trianglesWidth - trianglesMargin, trianglesMargin ],
        ], placedTriangles);
        divide(1, [ 
            [ trianglesWidth - trianglesMargin, trianglesHeight - trianglesMargin ],
            [ trianglesMargin, trianglesHeight - trianglesMargin ],
            [ trianglesWidth - trianglesMargin, trianglesMargin ],
        ], placedTriangles);

        placedTriangles.forEach(triangle => {
            drawTriangle(svg, triangle);
        });
    }

    /* END TRIANGLES */

    /* ENTRY OBSERVER */

    function createObserver(els) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        }

        function entryDraw(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(entry.target.querySelectorAll('.animated-subject')).forEach(el => {
                        el.style.display = 'block';
                    });
                }
            });
        }

        const observer = new IntersectionObserver(entryDraw, options);
        els.forEach(el => { observer.observe(el); });
    }

    /* END ENTRY OBERSERVER */

    /* INITIALIZATION (EVENT LISTENERS) */

    window.addEventListener('DOMContentLoaded', function () {
        const animatedSVGs = Array.from(document.querySelectorAll('.animated'));
        createObserver(animatedSVGs);
    });

    window.addEventListener('DOMContentLoaded', runCircles);
    window.addEventListener('DOMContentLoaded', runTriangles);
})();