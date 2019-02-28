function SlicyDonut(directPapaComponent, dataManager) {
    let me = this;
    let dataState = new DataState_SlicyDonut();
    let domState = new DOMState_SlicyDonut();
    let labelComponent = new SlicyDonutCenterLabel(dataState, domState);
    let uiManager = new UIManager_SlicyDonut(dataState, domState, labelComponent);

    /** CONSTANTS **/

    /** Externally Set ***/
        //Structure
    let externalDiv;
    //Data
    let data;

    /** Internally Set **/
        //Structure
    let mainSVG;
    let labelDiv;
    let mainG;
    let notchG;
    let maskCircle;
    let pathArr;
    let notchArr;

    /** Public APIs **/
    this.setExternalDiv = function (divHTML) {
        externalDiv = JJPower.enhance(divHTML);
    };

    this.setData = function (dataI) {
        dataState.setOrigData(dataI);
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
        uiManager.runIntroAnimation();
    }

    function construct() {
        mainSVG = externalDiv.jjAppend('svg')
            .jjAddClass('SlicyDonutSVG');

        labelDiv = externalDiv.jjAppend('div')
            .jjAddClass('SlicyDonutLabelDiv');

        mainG = mainSVG.jjAppend('g')
            .jjAddClass('SlicyDonutMainG');

        maskCircle = mainSVG.jjAppend('circle')
            .jjAddClass('SlicyDonutMaskCircle');

        notchG = mainSVG.jjAppend('g')
            .jjAddClass('SlicyDonutNotchG');

        domState.setDOMElements(mainSVG, notchG, maskCircle, labelDiv);
        addAllPaths();
        addAllNotches();

        let bcRect = externalDiv.getBoundingClientRect();
        domState.setComponentSize(bcRect);

        labelComponent.setExternalDiv(labelDiv);
        labelComponent.drawComponent();
    }

    function addAllPaths() {
        pathArr = [];
        for (let i = 0; i < dataState.SLICE_COUNT; i++) {
            addPath(i);
        }
        domState.setPaths(pathArr);
    }

    function addPath(i) {
        let path = mainG.jjAppend('path')
            .jjAddClass('SlicyDonutPath', `SlicyDonutPath_${i}`)
            .jjSetIndex(i);

        pathArr.push(path);
    }

    function addAllNotches() {
        notchArr = [];
        for (let i = 0; i < dataState.SLICE_COUNT; i++) {
            addNotch(i);
        }
        domState.setNotchs(notchArr);
    }

    function addNotch(i) {
        let notch = notchG.jjAppend('path')
            .jjAddClass('SlicyDonutNotch', `SlicyDonutNotch_${i}`)
            .jjSetIndex(i);

        notchArr.push(notch);
    }

    /** Draw **/
    function resize() {

    }
}