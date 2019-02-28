function SlicyDonutPathCalculator(domState) {
    let DOUBLE_PIE = Math.PI * 2;
    let pieComp = new SVGPieHelper();
    let pathUtil = SVGPathUtil.getInstance();

    /** Public APIs **/
    this.getPathStr = function (startVal, endVal) {
        return getPathStr(startVal, endVal);
    };

    this.getNotchPathStr = function (val) {
        return getNotchPathStr(val);
    };

    /** Private Functions **/
    function getPathStr(startVal, endVal) {  /* vals ratio from 0-1 */
        let innerR = domState.innerR;
        let thickness = domState.thickness;

        let outerR = innerR + thickness;
        pieComp.setPieParams(domState.cx, -domState.cy, outerR, innerR);

        let startAngle = startVal * DOUBLE_PIE;
        let endAngle = endVal * DOUBLE_PIE;
        let arcText;

        if (startVal === endVal) {
            arcText = '';
        } else {
            arcText = pieComp.getGaugePath(startAngle, endAngle);
        }

        return arcText;
    }

    function getNotchPathStr(val) {
        let notchLen = domState.innerR + domState.thickness * 2;

        let cx = domState.cx;
        let cy = -domState.cy;
        let deg = val * DOUBLE_PIE - Math.PI / 2;
        let endXY = pathUtil.getXYOnArc(cx, cy, notchLen, deg);
        let startX = domState.cx;
        let startY = domState.cy;

        let notchStr = moveTo(startX, startY);
        notchStr += lineTo(endXY.x, endXY.y);

        return notchStr;
    }

    /** Inner Path Calculations **/
    function moveTo(x, y) {
        return 'M' + x + ' ' + y;
    }

    function lineTo(x, y) {
        return 'L' + x + ' ' + y;
    }
}