function GaugeRectanglesBuilder(uniqueCounter) {
    let maskID_first = `url(#maskyMaskFirst${uniqueCounter})`;
    let maskID_second = `url(#maskyMaskSecond${uniqueCounter})`;
    let maskID_bg = `url(#bgMask${uniqueCounter})`;

    let rectArr_main;
    let rectArr_bg;

    let svg;
    let mainLayerG;
    let bgLayerG;

    let r = 150;
    let thickness = 10;
    let rectW;
    let rectH;

    this.createAllRects = function (svgI, radiusI, thicknessI, bgRectsG, mainRectsG) {
        r = radiusI;
        thickness = thicknessI;
        svg = svgI;
        bgLayerG = bgRectsG;
        mainLayerG = mainRectsG;

        calculateStaticParts();
        createBGRects();
        createMainRects();
    };

    this.getRectArr = function () {
        return rectArr_main;
    };

    /** Private Functions **/
    function createMainRects() {
        rectArr_main = [];
        createAllRects(mainLayerG, rectArr_main, true);
        positionStaticRects(rectArr_main, true);
    }

    function createBGRects() {
        rectArr_bg = [];
        createAllRects(bgLayerG, rectArr_bg);
        positionStaticRects(rectArr_bg);
    }

    function createAllRects(papaG, rectArr, isMain) {
        for (let i = 0; i < 6; i++) {
            createARect(papaG, rectArr, i, isMain);
        }
    }

    function createARect(papaG, rectArr, index, isMain) {
        let gradientID = `url(#${getGradientID(index, isMain)})`;
        let maskID = getMaskID(index, isMain);

        let rect = papaG.jjAppend('rect')
            .jjAddClass('GaugeRect', 'GaugeRect' + index)
            .jjAttr({
                width: rectW,
                height: rectH,
                fill: gradientID,
                mask: maskID,
                'shape-rendering': 'crispEdges'
            });

        rectArr.push(rect);
    }

    function positionStaticRects(rectArr, isMain) {
        positionRect_TopRight(rectArr[0], isMain);
        positionRect_MidRight(rectArr[1], isMain);
        positionRect_BottomRight(rectArr[2], isMain);
        positionRect_BottomLeft(rectArr[3], isMain);
        positionRect_MidLeft(rectArr[4], isMain);
        positionRect_TopLeft(rectArr[5], isMain);
    }

    /** Right **/
    function positionRect_TopRight(rect, isMain) {
        let width = rectW;
        let height = rectH;
        let x = r;
        let y = 0;
        if (isMain) {
            x -= thickness;
            width += thickness;
        }

        rect.jjAttr({ x, y, width, height });
    }

    function positionRect_MidRight(rect) {
        let x = 2 * r - rectW;
        let y = rectH;
        let height = rectH * 2;

        rect.jjAttr({ x, y, height });
    }

    function positionRect_BottomRight(rect, isMain) {
        let x = r;
        let y = 2 * r - rectH;
        let width = rectW;
        let height = rectH;

        rect.jjAttr({ x, y, height, width });
    }

    /** Left **/
    function positionRect_BottomLeft(rect, isMain) {
        let x = r - rectW;
        let y = 2 * r - rectH;
        let height = rectH;
        let width = rectW;

        rect.jjAttr({ x, y, width, height });
    }

    function positionRect_MidLeft(rect) {
        let x = 0;
        let y = rectH;
        let height = rectH * 2;

        rect.jjAttr({ x, y, height });
    }

    function positionRect_TopLeft(rect, isMain) {
        let x = r - rectW;
        let y = 0;
        let width = rectW;
        let height = rectH;

        if (isMain) {
            width += thickness;
        }

        rect.jjAttr({ x, y, height, width });
    }

    /** Calculations **/
    function calculateStaticParts() {
        rectW = (Math.sqrt(3) * r) / 2;
        rectH = r / 2;
    }

    function getGradientID(index, isMain) {
        let id = 'grad';
        if (!isMain) {
            id += 'BG';
        }
        id += `${index}`;
        if (uniqueCounter > 0) {
            id += `_${uniqueCounter}`;
        }
        return id;
    }

    function getMaskID(index, isMain) {
        let maskID = maskID_first;
        if (isMain && index >= 3) {
            maskID = maskID_second;
        }
        if (!isMain) {
            maskID = maskID_bg;
        }
        return maskID;
    }
}