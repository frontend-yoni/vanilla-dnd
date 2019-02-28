function SlicyDonutNotchUtil(dataState, domState) {
    let pathCalc = new SlicyDonutPathCalculator(domState);

    /** Public APIs **/
    this.positionAllNotches = function () {
        positionAllNotches();
    };

    /** Private Functions **/
    function positionAllNotches() {
        let notchArr = domState.notchArr;
        let valArr = dataState.valueArr;
        let aggrArr = dataState.aggrArr;

        let notch;
        for (let i = 0; i < notchArr.length; i++) {
            notch = notchArr[i];
            positionNotch(notch, aggrArr[i] + valArr[i]);
        }
    }

    function positionNotch(notchElement, val) {
        let pathStr = pathCalc.getNotchPathStr(val);
        notchElement.setAttribute('d', pathStr);
    }
}