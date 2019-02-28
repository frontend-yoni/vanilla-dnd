function DonutPathCalculator() {
    let DOUBLE_PIE = Math.PI * 2;
    let ARC_SECTION_SPLIT = 0.5;
    let generalUtils = JJGeneralUtils.getInstance();
    let pieComp = new SVGPieHelper();

    let radius;
    let thickness;

    /** Public APIs **/
    this.getBothPathStr = function(val, radiusI, thicknessI){
        radius = radiusI;
        thickness = thicknessI;
        return getBothPaths(val);
    };

    this.getBGCirclePath = function (radiusI, thicknessI) {
        radius = radiusI;
        thickness = thicknessI;
        return getArcPathStr(0, DOUBLE_PIE, 0);
    };

    /** Private Functions **/
    function getBothPaths(val) {
        let angles = getAnglesByValue(val);
        let str1 = getArcPathStr(angles.startAngle, angles.midAngle);
        let str2 = getArcPathStr(angles.midAngle, angles.endAngle);

        return [str1, str2];
    }

    function getArcPathStr(startAngle, endAngle) {
        if (startAngle === endAngle) {
            return '';
        }
        let innerR = radius - thickness;

        pieComp.setPieParams(radius, -radius, radius, innerR);
        let arcText = pieComp.getGaugePath(startAngle, endAngle);
        return arcText;
    }

    //val can is between 0-1 but can be over 1 and then wrap around and overlap
    function getAnglesByValue(val) {
        let angles;
        if (val < 1) {
            angles = getAnglesByValue_under1(val);
        } else {
            angles = getAnglesByValue_over1(val);
        }

        return angles;
    }

    function getAnglesByValue_under1(val) {
        let startAngle = 0;
        let endAngle = generalUtils.getValueByProgress(0, DOUBLE_PIE, val);
        let midAngle = Math.min(DOUBLE_PIE / 2, endAngle);

        return { startAngle, midAngle, endAngle };
    }

    function getAnglesByValue_over1(val) {
        let remainderVal = val - Math.floor(val);
        let startAngle = generalUtils.getValueByProgress(0, DOUBLE_PIE, remainderVal);
        let endAngle = startAngle + DOUBLE_PIE;
        let midAngle = generalUtils.getValueByProgress(startAngle, endAngle, ARC_SECTION_SPLIT);

        return { startAngle, midAngle, endAngle };
    }
}

DonutPathCalculator.getInstance = function () {
    if (!DonutPathCalculator.instance) {
        DonutPathCalculator.instance = new DonutPathCalculator();
    }
    return DonutPathCalculator.instance;
};