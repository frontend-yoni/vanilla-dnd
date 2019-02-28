//rectBuilder = GaugeRectanglesBuilder, gradientUtil = GaugeGradientUtil, pathCalc = DonutPathCalculator, domState = DOMState_GaugeBonBon
function UIManager_OverlappingGauge(rectBuilder, gradientUtil, pathCalc, domState, uniqueCounter) {
    const DEFAULT_ANIMATION_DURATION = 1000;
    const ANIMATION_TYPE = UIManager_OverlappingGauge.ANIMATION_TYPE;
    let maskID_first = `url(#maskyMaskFirst${uniqueCounter})`;
    let maskID_second = `url(#maskyMaskSecond${uniqueCounter})`;

    let generalUtil = JJGeneralUtils.getInstance();
    /* components */
    let dataState = new DataState_GaugeBonBon();
    let gradientCalc = new GradientForGaugeCalculator(dataState);

    /* Data */
    let finalValue;
    let prevValue;
    let presentationValue;
    let isNoDataState;
    let prevPresentationValue = 0;
    let sliceCount;
    let hasDecimal;
    /* structures */
    let svg;
    let valueP;
    let rectArr;
    let bgRing;
    /* layout */
    let radius;

    /* State */
    let animationStartValue;
    let animationStartPresentationValue;
    let totalLoopCount;
    let currentLoopIndex = 0;
    let prevLoopIndex = 0;
    let animationType;

    this.setRadiusAndElements = function (radiusI, svgI, bgRingI, valuePI) {
        radius = radiusI;
        svg = svgI;
        valueP = valuePI;
        bgRing = bgRingI;
    };

    this.setFinalValue = function (finalValueI, actualValI, isNoDataStateI) {
        finalValue = finalValueI;
        presentationValue = actualValI;
        isNoDataState = isNoDataStateI;
    };

    this.runIntroAnimation = function () {
        prevValue = 0;
        prepAndLaunchAnimation();
    };

    this.runUpdateAnimation = function () {
        prepAndLaunchAnimation();
    };

    /** Private Functions **/
    function runCSSAnimation_intro() {
        svg.jjAddClass('activateGaugeIntro');
        svg.jjForceStyleRecalc();
        svg.jjRemoveClass('activateGaugeIntro');
    }

    function runCSSRingAnimation_hide() {
        svg.jjAddClass('activateGaugeHide');
    }

    /** Prep **/
    function startPrep() {
        svg.jjRemoveClass('activateGaugeHide');
        calculatePrepParams();
        initializeAnimation();
        updatePaths(animationStartValue);
        updateAnimationType();
    }

    /** Animation **/
    function prepAndLaunchAnimation() {
        startPrep();
        goGoAnimation();

        switch (animationType) {
            case ANIMATION_TYPE.HIDE:
                runCSSRingAnimation_hide();
                break;
            case ANIMATION_TYPE.INTRO:
                runCSSAnimation_intro();
                break;
        }
    }

    function goGoAnimation() {
        svg.jjAnimate(fullFrameFunc, DEFAULT_ANIMATION_DURATION);
    }

    function initializeAnimation() {
        svg.jjStopAnimation();
        updateBGRectVisibility();
        updateGradientPlates();
        updateBottomLeftRectMaskByID(maskID_second);
    }

    function fullFrameFunc(t) {
        let currentVal = generalUtil.getValueByProgress(animationStartValue, finalValue, t);
        let presentingVal = generalUtil.getValueByProgress(animationStartPresentationValue, presentationValue, t);
        svg.setAttribute('currentVal', currentVal.toFixed(3));
        svg.setAttribute('presentingVal', presentingVal.toFixed(3));
        currentLoopIndex = getCurrentLoopIndex(currentVal);

        arcFrameFunc(t, currentVal);
        gradientFrameFunc(t, currentVal);
        rectFrameFunc(t, currentVal);

        if (!isNoDataState) {
            let valText = geValueTextForAnimation(presentingVal);
            valueP.jjText(valText);
        }
        prevLoopIndex = currentLoopIndex;
    }

    function arcFrameFunc(t, currentVal) {
        let visibleVal = getMainArcValue(currentVal);
        updatePaths(visibleVal);
    }

    function gradientFrameFunc(t, currentVal) {
        if (currentLoopIndex !== prevLoopIndex) {
            updateGradientPlates();
            updateBGRectVisibility();
        }
    }

    function rectFrameFunc(t, currentVal) {
        updateBottomMaskIfNeeded(currentVal);
    }

    /** Mid Animation **/
    function updateGradientPlates() {
        updateMainGradients(finalValue);
        if (currentLoopIndex > 0) {
            updateBGGradients();
        }
    }

    function updateBGRectVisibility() {
        if (currentLoopIndex > 0) {
            showBGArc();
        } else {
            hideBGArc();
        }

        /* Inner Function */
        function hideBGArc() {
            svg.jjAddClass('hideBgArc');
        }

        function showBGArc() {
            svg.jjRemoveClass('hideBgArc');
        }
    }

    function updateBottomMaskIfNeeded(currentVal) {
        let arcVal = currentVal - Math.floor(currentVal);
        if (arcVal <= 0.5 && arcVal > 0) {
            updateBottomLeftRectMaskByID(maskID_first);
        } else {
            updateBottomLeftRectMaskByID(maskID_second);
        }
    }

    /** Util **/
    function calculatePrepParams() {
        animationStartValue = +svg.getAttribute('currentVal');
        animationStartPresentationValue = +svg.getAttribute('presentingVal');
        currentLoopIndex = getCurrentLoopIndex(animationStartValue);
        totalLoopCount = Math.ceil(finalValue);
        dataState.updateState(finalValue);
        sliceCount = dataState.sliceCount;

        rectArr = rectBuilder.getRectArr();

        hasDecimal = (presentationValue !== Math.floor(presentationValue));
    }

    function updateMainGradients() {
        let isFinalLoop = (currentLoopIndex + 1 >= finalValue);
        let gradientVals = gradientCalc.calcAllGradients(currentLoopIndex, isFinalLoop);
        gradientUtil.applyGradients(gradientVals, true);
    }

    function updateBGGradients() {
        let gradientVals = gradientCalc.calcAllGradients(currentLoopIndex - 1);
        gradientUtil.applyGradients(gradientVals, false);
    }

    function getMainArcValue(val) {
        let floorVal = Math.floor(val);
        let arcVal = val - floorVal;
        if (val === floorVal && val) {
            arcVal = 1;
        }
        return arcVal;
    }

    function getCurrentLoopIndex(currentVal) {
        let newIndex = Math.floor(currentVal);
        if (newIndex === currentVal && newIndex) {
            newIndex--;
        }
        return newIndex;
    }

    /** Rectangles **/
    function geValueTextForAnimation(value) {
        if (hasDecimal) {
            return value.toFixed(3);
        } else {
            return Math.round(value);
        }
    }

    function updateBottomLeftRectMaskByID(maskID) {
        rectArr[3].setAttribute('mask', maskID);
    }

    /** Path **/
    function updatePaths(val) {
        let pathStrArr = pathCalc.getBothPathStr(val, domState.r, domState.thickness);
        domState.path1.jjAttr({
            d: pathStrArr[0]
        });
        domState.path2.jjAttr({
            d: pathStrArr[1]
        });

        let inBetweenStr = '';
        if (currentLoopIndex > 0) {
            inBetweenStr = pathStrArr[0] + pathStrArr[1];
        }
        domState.inBetweenPath.jjAttr({
            d: inBetweenStr
        });
    }

    /** State **/
    function updateAnimationType() {
        if (!finalValue) {
            animationType = ANIMATION_TYPE.HIDE;
        } else if (!prevValue) {
            animationType = ANIMATION_TYPE.INTRO;
        } else {
            animationType = ANIMATION_TYPE.PROGRESS;
        }
        prevValue = finalValue;
        prevPresentationValue = presentationValue;
    }
}

UIManager_OverlappingGauge.ANIMATION_TYPE = {
    INTRO: 0,
    HIDE: 1,
    PROGRESS: 2
};