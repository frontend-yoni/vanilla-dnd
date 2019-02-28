/**
 * Created by yavitzur on 15/05/2017.
 */
function SVGPathUtil() {
    const DOUBLE_PI = Math.PI * 2;

    /** Public Functions **/
    //degStart and degEnd should be between 0 to double pie, in clockwise direction (degEnd > degStart)
    this.getSliceText = function (cx, cy, degStart, degEnd, outerRadius, innerRadius) {
        return getSliceText(cx, cy, degStart, degEnd, outerRadius, innerRadius);
    };

    //degStart and degEnd should be between 0 to double pie, in clockwise direction (degEnd > degStart)
    this.getGaugePathText = function (cx, cy, degStart, degEnd, radius, thickness) {
        return getGaugePathText(cx, cy, degStart, degEnd, radius, thickness);
    };

    this.getXYOnArc = function (cx, cy, r, deg) {
        let x = getXOnArc(cx, deg, r);
        let y = getYOnArc(cy, deg, r);
        return { x, y };
    };

    /** Externally Used **/
    function getSliceText(cx, cy, degStart, degEnd, outerRadius, innerRadius) {
        if (degEnd - degStart >= DOUBLE_PI) {
            degEnd = degStart + DOUBLE_PI - 0.00001;
        }
        let pathArr = [];
        let outerArc = arcByDegree(cx, cy, degStart, degEnd, outerRadius);
        let innerArc = arcByDegree(cx, cy, degStart, degEnd, innerRadius, true);
        pathArr = [outerArc, innerArc, 'Z'];
        return pathArr.join(' ');
    }

    function getGaugePathText(cx, cy, degStart, degEnd, radius, thickness) {
        if (degEnd - degStart >= DOUBLE_PI) {
            degEnd = degStart + DOUBLE_PI - 0.00001;
        }

        let midR = radius - thickness / 2;
        let pathStr = arcByDegree(cx, cy, degStart, degEnd, midR);
        return pathStr;
    }

    /** Inner Path Calculations **/
    function moveTo(x, y) {
        return 'M' + x + ' ' + y;
    }

    function lineTo(x, y) {
        return 'L' + x + ' ' + y;
    }

    function arcTo(x, y, r, isLongArc, isAntiClockWise) {
        let largeArcFlag = isLongArc ? 1 : 0;
        let antiClockWiseFlag = isAntiClockWise ? 1 : 0;
        return 'A ' + r + ' ' + r + ', 0, ' + largeArcFlag + ', ' + antiClockWiseFlag + ', ' + x + ' ' + y;
    }

    function arcByDegree(cx, cy, degStart, degEnd, r, isMiddleOfPath) {
        let arcArr = [];

        let x1 = getXOnArc(cx, degStart, r);
        let y1 = getYOnArc(cy, degStart, r);

        let x2 = getXOnArc(cx, degEnd, r);
        let y2 = getYOnArc(cy, degEnd, r);

        let isLongArc = (degEnd - degStart) > Math.PI;

        let startText;
        let endText;

        if (isMiddleOfPath) {
            startText = lineTo(x2, y2);
            endText = arcTo(x1, y1, r, isLongArc, false)
        } else {
            startText = moveTo(x1, y1);
            endText = arcTo(x2, y2, r, isLongArc, true);
        }

        arcArr.push(startText);
        arcArr.push(endText);

        return arcArr.join(' ');
    }


    function getXOnArc(cx, deg, r) {
        deg = 2 * Math.PI - deg;
        let x = cx + r * Math.cos(deg);
        if (Math.abs(x) < 0.00001 || !isFinite(x)) {
            x = 0;
        }
        return trimTo3Decimals(x);
    }

    function getYOnArc(cy, deg, r) {
        deg = 2 * Math.PI - deg;
        let yFromBottom = cy + r * Math.sin(deg);
        let y = -yFromBottom;
        if (Math.abs(y) < 0.00001 || !isFinite(y)) {
            y = 0;
        }
        return trimTo3Decimals(y);
    }

    /** Math **/
    function trimTo3Decimals(num) {
        num = Math.floor(num * 1000);
        return num / 1000;
    }
}

SVGPathUtil.getInstance = function () {
    if (!SVGPathUtil.instance) {
        SVGPathUtil.instance = new SVGPathUtil();
    }
    return SVGPathUtil.instance;
};