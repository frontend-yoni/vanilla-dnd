function SlicyDonutCenterLabel(dataState, domState) {
    let me = this;
    /** CONSTANTS **/
    const DEFAULT_TEXT = 'Total Members in Program';
    let textOptions = [
        'Registered',
        'Highly Likely',
        'Likely',
        'Less Likely',
        'Unlikely'
    ];
    /** Externally Set ***/
        //Structure
    let externalDiv;

    /** Internally Set **/
        //Structure
    let platesPapa;
    let platesArray;

    /** Public APIs **/
    this.setExternalDiv = function (divHTML) {
        externalDiv = JJPower.enhance(divHTML);
    };

    this.onHighlight = function (highlightIndex) {
        onHighlight(highlightIndex);
    };

    this.drawComponent = function () {
        drawComponent();
    };

    this.showDefaultLabel = function () {
        showDefaultLabel();
    };

    /** Construction **/
    function drawComponent() {
        construct();
    }

    function construct() {
        let textWidth = domState.innerR * 1.5;
        platesPapa = externalDiv.jjAppend('div')
            .jjAddClass('SlicyDonutCenterLabelPlatesPapa').jjStyle({
                width: textWidth + 'px'
            });

        platesArray = [];
        for (let i = -1; i < dataState.valueArr.length; i++) {
            platesArray[i] = constructPlate(i);
        }        
    }

    function constructPlate(index) {
        let valueStr = getValueByIndex(index);
        let textStr = getTextByIndex(index);

        let plateDiv = platesPapa.jjAppend('div')
            .jjAddClass('SlicyDonutCenterLabelPlate');

        let valueP = plateDiv.jjAppend('p')
            .jjAddClass('SlicyDonutCenterLabelValue')
            .jjText(valueStr);
        let textP = plateDiv.jjAppend('p')
            .jjAddClass('SlicyDonutCenterLabelText')
            .jjText(textStr);

        plateDiv.jjSetIndex(index);

        return plateDiv;
    }

    /** Draw **/
    function showDefaultLabel() {
        onHighlight(-1);
    }

    function swapPlatesWithAnimation(highlightIndex) {
        hideOldPlates();
        showNewPlate(highlightIndex);
    }

    function hideOldPlates() {
        let oldPlates = platesPapa.jjQueryAll('.visible');
        for (let oldPlate of oldPlates) {
            hideOldPlate(oldPlate);
        }

    }

    function hideOldPlate(oldPlate) {
        oldPlate.jjRemoveClass('visible');
    }

    function showNewPlate(highlightIndex) {
        let newPlate = platesArray[highlightIndex];
        newPlate.jjAddClass('visible');
    }

    /** Interaction **/
    function onHighlight(highlightIndex) {
        swapPlatesWithAnimation(highlightIndex);
    }

    /** Basic DOM **/
    function setInnerHTML(plate, valueStr, textStr) {
        plate.jjQuery('.SlicyDonutCenterLabelValue')
            .jjText(valueStr);

        plate.jjQuery('.SlicyDonutCenterLabelText')
            .jjText(textStr);
    }

    /** Util **/
    function getTextByIndex(index) {
        let text = textOptions[index];
        if (!text) {
            text = DEFAULT_TEXT;
        }
        return text;
    }

    function getValueByIndex(index) {
        let val = dataState.origValArr[index];
        if (val === undefined) {
            val = dataState.origSum;
        }
        return val;
    }
}