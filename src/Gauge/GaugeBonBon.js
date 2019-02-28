function GaugeBonBon(directPapaComponent, dataManager) {
    let MOCK_SLICE_COUNT = 4.5;

    let uniqueCounter = GaugeBonBon.uniqueCounter++;
    let me = this;
    /** CONSTANTS **/

    /** Externally Set ***/
        //Structure
    let externalDiv;
    let radius = 150;
    let thickness = 10;
    //Data
    let ratioValue = (1 / 6) * MOCK_SLICE_COUNT;
    let actualVal;
    let targetVal;
    let labelText;
    /** Internally Set **/
    let pathCalc = new DonutPathCalculator();
    let domState = new DOMState_GaugeBonBon();
    let gradientUtil = new GaugeGradientUtil(uniqueCounter);
    let rectBuilder = new GaugeRectanglesBuilder(uniqueCounter);
    let manager = new UIManager_OverlappingGauge(rectBuilder, gradientUtil, pathCalc, domState, uniqueCounter);
    //State
    let isNoDataState;
    //Structure
    let mainSVG;
    let bgRing;
    let bgRectsG;
    let mainRectsG;
    let valueP;
    let labelP;

    let mainMask_first;
    let arcPath1;

    let mainMask_second;
    let arcPath2;

    let inBetweenPath;

    let bgMask;
    let bgMaskPath;

    /** Public APIs **/
    this.setExternalDiv = function (divHTML) {
        externalDiv = JJPower.enhance(divHTML)
            .jjAddClass('GaugeBonBonPapaDiv');
    };

    this.setRadiusAndThickness = function (radiusI, thicknessI = 15, gradientStart, gradientEnd) {
        radius = radiusI;
        thickness = thicknessI;
        domState.setRadiusAndThickness(radius, thickness);
        gradientUtil.setColors(gradientStart, gradientEnd);
    };

    this.setData = function (actualValI, targetValI) {
        setValue_data(actualValI, targetValI);
    };

    this.setLabel = function (labelTextI) {
        updateLabel(labelTextI);
    };

    this.updateData = function (actualValI, targetValI) {
        setValue_data(actualValI, targetValI);
        updateValue();
    };

    this.drawComponent = function () {
        drawComponent();
    };

    this.resize = function () {
        resize();
    };

    /** Construction **/
    function drawComponent() {
        construct();
        domState.setPaths(arcPath1, arcPath2, inBetweenPath);
    }

    function construct() {
        let valuePWidth = 2 * radius - 2 * thickness - 20;
        valueP = externalDiv.jjAppend('p')
            .jjAddClass('GaugeBonBonValueP')
            .jjStyle({
                width: `${valuePWidth}px`,
            });

        labelP = externalDiv.jjAppend('p')
            .jjAddClass('GaugeBonBonLabelP')
            .jjStyle({
                width: `${valuePWidth + 10}px`,
            })
            .jjText(labelText);

        mainSVG = externalDiv.jjAppend('svg')
            .jjAddClass('GaugeBonBonSVG')
            .jjAttr({
                'currentVal': 0,
                'presentingVal': 0
            })
            .jjStyle({
                width: 2 * radius + 'px',
                height: 2 * radius + 'px'
            });

        bgRing = mainSVG.jjAppend('circle')
            .jjAddClass('CircleBGRingStroke')
            .jjAttr({
                cx: radius,
                cy: radius,
                r: radius - thickness / 2
            })
            .jjStyle({
                'stroke-width': thickness + 'px'
            });

        gradientUtil.generateInitialDefTag(mainSVG);
        manager.setRadiusAndElements(radius, mainSVG, bgRing, valueP);

        createMainMask();
        createBGMask();

        bgRectsG = mainSVG.jjAppend('g')
            .jjAddClass('BGRectangles');

        inBetweenPath = mainSVG.jjAppend('path')
            .jjAddClass('OverlappingGaugePath', 'InBetweenGaugePath')
            .jjStyle({ 'stroke-width': thickness + 1 + 'px' });

        mainRectsG = mainSVG.jjAppend('g')
            .jjAddClass('MainRectangles');

        rectBuilder.createAllRects(mainSVG, radius, thickness, bgRectsG, mainRectsG);

        manager.setFinalValue(ratioValue, actualVal, isNoDataState);
        requestAnimationFrame(animateNow);

        updateDataStateUI();
    }

    function createMainMask() {
        mainMask_first = mainSVG.jjAppend('mask')
            .jjAttr({
                id: `maskyMaskFirst${uniqueCounter}`
            });

        arcPath1 = mainMask_first.jjAppend('path')
            .jjAddClass('OverlappingGaugePath')
            .jjAttr({
                'stroke-linecap': 'round'
            })
            .jjStyle({
                'stroke-width': thickness + 'px'
            });

        mainMask_second = mainSVG.jjAppend('mask')
            .jjAttr({
                id: `maskyMaskSecond${uniqueCounter}`
            });

        arcPath2 = mainMask_second.jjAppend('path')
            .jjAddClass('OverlappingGaugePath')
            .jjAttr({
                'stroke-linecap': 'round'
            })
            .jjStyle({
                'stroke-width': thickness + 'px'
            });
    }

    function createBGMask() {
        bgMask = mainSVG.jjAppend('mask')
            .jjAttr({
                id: `bgMask${uniqueCounter}`
            });

        bgMaskPath = bgMask.jjAppend('path')
            .jjAddClass('OverlappingGaugePath', 'hideBgArc')
            .jjAttr({
                d: pathCalc.getBGCirclePath(radius, thickness)
            })
            .jjStyle({
                'stroke-width': thickness + 'px'
            });
    }

    function updateLabel(labelTextI) {
        labelText = labelTextI;
        if (labelP) {
            labelP.jjText(labelText);
        }
    }

    function updateValue() {
        manager.setFinalValue(ratioValue, actualVal, isNoDataState);
        manager.runUpdateAnimation();
        updateDataStateUI();
    }

    function setValue_data(actualValI, targetValI) {
        actualVal = actualValI;
        targetVal = targetValI;
        isNoDataState = !isFinite(actualVal) || actualVal == null;

        if (isNoDataState) {
            actualVal = 0;
        }
        actualVal = Math.abs(actualVal);
        if (!targetVal || targetVal < 0) {
            targetVal = actualVal;
        }

        ratioValue = actualVal / targetVal;
        if (isNaN(ratioValue)) {
            ratioValue = 0;
        }
    }


    /** Event Listeners **/

    /** Draw **/
    function animateNow() {
        manager.runIntroAnimation();
    }

    function updateDataStateUI() {
        if (isNoDataState) {
            applyNoDataState();
        } else {
            removeNoDataState();
        }

    }

    function applyNoDataState() {
        externalDiv.jjAddClass('GaugeBonBonNoData');
        valueP.jjText('_ _');
    }

    function removeNoDataState() {
        externalDiv.jjRemoveClass('GaugeBonBonNoData');
    }

    function resize() {

    }
}

GaugeBonBon.uniqueCounter = 0;