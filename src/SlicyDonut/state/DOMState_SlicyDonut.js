function DOMState_SlicyDonut() {
    /** Layout **/
    this.innerR = 90;
    this.thickness = 10;
    this.compWidth;
    this.compHeight;
    this.cx;
    this.cy;

    /** Structure **/
    this.pathArr;
    this.notchArr;
    this.mainSVG;
    this.notchG;
    this.maskCircle;
    this.labelDiv;
    /** Setters **/
    this.setRadiusAndThickness = function (innerR, thickness) {
        this.innerR = innerR;
        this.thickness = thickness;
    };

    this.setComponentSize = function (bcRect) {
        this.compWidth = bcRect.width;
        this.compHeight = bcRect.height;

        this.cx = this.compWidth / 2;
        this.cy = this.compHeight / 2;
    };

    this.setPaths = function (pathArr) {
        this.pathArr = pathArr;
    };

    this.setNotchs = function (notchArr) {
        this.notchArr = notchArr;
    };

    this.setDOMElements = function (mainSVG, notchG, maskCircle, labelDiv) {
        this.mainSVG = mainSVG;
        this.notchG = notchG;
        this.maskCircle = maskCircle;
        this.labelDiv = labelDiv;
    };
}