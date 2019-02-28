function SlicyDonutDrawUtil(dataState, domState) {
    let pathCalc = new SlicyDonutPathCalculator(domState);
    let genUtils = JJGeneralUtils.getInstance();

    /** Public APIs **/
    this.drawAllPaths = function () {
        drawAllPaths();
        positionMaskCircle();
    };

    this.positionMaskCircle = function(){
        positionMaskCircle();
    };

    this.drawPathByProgress = function(pathElement, progress){
        drawPathByProgress(pathElement, progress);
    };

    /** Private Functions **/
    function drawAllPaths() {
        let pathArr = domState.pathArr;
        let valArr = dataState.valueArr;
        let aggrArr = dataState.aggrArr;

        let pathElement;
        for (let i = 0; i < pathArr.length; i++) {
            pathElement = pathArr[i];
            drawPath(pathElement, aggrArr[i], aggrArr[i] + valArr[i]);
        }
    }

    function drawPath(pathElement, startVal, endVal) {
        let pathStr = pathCalc.getPathStr(startVal, endVal);
        pathElement.setAttribute('d', pathStr);
    }

    function positionMaskCircle(){
        domState.maskCircle.jjAttr({
            cx: domState.cx,
            cy: domState.cy,
            r: domState.innerR
        })
    }

    /** Animation **/
    function drawPathByProgress(pathElement, progress){
        let index = pathElement.jjGetIndex();
        let startVal = dataState.aggrArr[index];
        let endVal = dataState.aggrArr[index] + dataState.valueArr[index];
        let currVal = genUtils.getValueByProgress(startVal, endVal, progress);

        let pathStr = pathCalc.getPathStr(startVal, currVal);
        pathElement.setAttribute('d', pathStr);

    }
}