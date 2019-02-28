//calculator = DataState_GaugeBonBon
function GradientForGaugeCalculator(dataState) {
    let finalVal;
    let gradientUnit;
    let realGradientUnit;
    let sliceCount;
    let tinyLastSliceSize;

    /** Public APIs **/
    this.calcAllGradients = function (loopIndex, isFinalLoop) {
        return calcAllGradients(loopIndex, isFinalLoop);
    };

    /** Inner Functions **/
    function updateBaseParams() {
        gradientUnit = dataState.gradientUnit;
        sliceCount = dataState.sliceCount;
        tinyLastSliceSize = dataState.tinyLastSliceSize;
        realGradientUnit = dataState.realGradientUnit;
    }

    function calcAllGradients(loopIndex, isFinalLoop) {
        updateBaseParams();
        return calcGradients(loopIndex, isFinalLoop);
    }

    function calcGradients(loopIndex, isFinalLoop) {
        let loopStart = 6 * gradientUnit * loopIndex;

        let topRight = get_TopRight(loopStart);
        let midRight = get_MidRight(loopStart);
        let bottomRight = get_BottomRight(loopStart);
        let bottomLeft = get_BottomLeft(loopStart);
        let midLeft = get_MidLeft(loopStart);
        let topLeft = get_TopLeft(loopStart);

        let retObj = { topRight, midRight, bottomRight, bottomLeft, midLeft, topLeft };
        if (isFinalLoop) {
            retObj.edge = get_LastEdgeChoopchick();
        }


        return retObj;
    }

    /* Right */
    function get_TopRight(loopStart = 0, loopEnd = finalVal) {
        let startVal = loopStart;
        return calcTopRight(startVal, startVal + realGradientUnit);
    }

    function get_MidRight(loopStart = 0, loopEnd = finalVal) {
        let startVal = loopStart + gradientUnit;
        return calcMidRight(startVal, startVal + gradientUnit);
    }

    function get_BottomRight(loopStart = 0, loopEnd = finalVal) {
        let startVal = loopStart + gradientUnit * 2;
        return calcBottomRight(startVal, startVal + gradientUnit);
    }

    /* Left */
    function get_BottomLeft(loopStart = 0, loopEnd = finalVal) {
        let startVal = loopStart + gradientUnit * 3;
        return calcBottomLeft(startVal, startVal + gradientUnit);
    }

    function get_MidLeft(loopStart = 0, loopEnd = finalVal) {
        let startVal = loopStart + gradientUnit * 4;
        return calcMidLeft(startVal, startVal + gradientUnit);
    }

    function get_TopLeft(loopStart = 0, loopEnd = finalVal) {
        let startVal = loopStart + gradientUnit * 5;
        return calcTopLeft(startVal, startVal + gradientUnit);
    }

    /** Edge **/
    function get_LastEdgeChoopchick() {
        let edgeSliceIndex = sliceCount % 6;
        let startVal = 1 - tinyLastSliceSize * gradientUnit;
        if (sliceCount === 1) {
            startVal = 0;
        }
        switch (edgeSliceIndex) {
            case 1:
                return calcTopRight(startVal, 1);
            case 2:
                return calcMidRight(startVal, 1);
            case 3:
                return calcBottomRight(startVal, 1);
            case 4:
                return calcBottomLeft(startVal, 1);
            case 5:
                return calcMidLeft(startVal, 1);
            case 0:
                return calcTopLeft(startVal, 1);
        }
    }

    /** Right **/
    function calcTopRight(startVal, endVal) {
        let b = getBackAndFrontBlocks(startVal, endVal);
        //In case the value is less than 1/6, meaning the donut is super tiny
        if (b.back === 0 && b.front < 1) {
            b.back = 1 - b.front;
        }
        if (!isFinite(endVal)) {
            b.back = 1;
        }
        if (startVal >= 1) {
            b.back = 1;
            b.front = 0;
        }

        /*{ x1: 0, y1: 0, x2: 6, y2: 6 }*/
        let c = {
            x1: -b.back,
            y1: -b.back,
            x2: b.front,
            y2: b.front
        };
        return c;
    }

    function calcMidRight(startVal, endVal) {
        let b = getBackAndFrontBlocks(startVal, endVal);
        /*{ x1: 0, y1: -1, x2: 0, y2: 5 }*/
        let c = {
            x1: 0,
            y1: -b.back,
            x2: 0,
            y2: b.front
        };
        return c;
    }

    function calcBottomRight(startVal, endVal) {
        let b = getBackAndFrontBlocks(startVal, endVal);
        let y1 = -b.back;
        let y2 = b.front;

        let c = {
            x1: b.back + 1,
            y1: y1,
            x2: -b.front + 1,
            y2: y2
        };
        c.x1 = cleanupNum(c.x1);
        c.y2 = cleanupNum(c.y2);
        return c;
    }

    /** Left **/
    function calcBottomLeft(startVal, endVal) {
        let b = getBackAndFrontBlocks(startVal, endVal);
        let y1 = b.back + 1;
        let y2 = -b.front + 1;

        let c = {
            x1: b.back + 1,
            y1: 0,
            x2: -b.front + 1,
            y2: 0
        };

        c.y1 = cleanupNum(c.y1);
        c.y2 = cleanupNum(c.y2);
        c.x1 = cleanupNum(c.x1);
        c.x2 = cleanupNum(c.x2);
        return c;
    }

    function calcMidLeft(startVal, endVal) {
        let b = getBackAndFrontBlocks(startVal, endVal);
        /*{ x1: 0, y1: 5, x2: 0, y2: -1 }*/
        let c = {
            x1: 0,
            y1: b.back + 1,
            x2: 0,
            y2: -b.front + 1
        };
        c.y1 = cleanupNum(c.y1);
        c.y2 = cleanupNum(c.y2);
        return c;
    }

    function calcTopLeft(startVal, endVal) {
        let b = getBackAndFrontBlocks(startVal, endVal);
        /*{ x1: -5, y1: 6, x2: 1, y2: 0 }*/
        let c = {
            x1: -b.back,
            y1: b.back + 1,
            x2: b.front,
            y2: -b.front + 1
        };
        c.y1 = cleanupNum(c.y1);
        return c;
    }

    /** Util **/
    function getBackAndFrontBlocks(startVal, endVal) {
        let unit = (endVal - startVal);
        let backBlocks = startVal / unit;
        let frontBlocks = (1 - startVal) / unit;

        backBlocks = cleanupNum(backBlocks);
        frontBlocks = cleanupNum(frontBlocks);
        return { back: backBlocks, front: frontBlocks };
    }

    function cleanupNum(num) {
        return +num.toFixed(5);
    }
}