function SlicyDonutCenterLabelBubble(dataState, domState) {
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
    //Data
    let prevVal;
    let prevTextIndex;

    /** Internally Set **/
        //Structure
    let platesPapa;
    let defaultViewDiv;
    let bubbleDiv;
    let bubbleShape;
    let bubbleContent;

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
        hideBuble();
    };

    /** Construction **/
    function drawComponent() {
        construct();
    }

    function construct() {
        let textWidth = domState.innerR * 1.5;
        platesPapa = externalDiv.jjAppend('div')
            .jjAddClass('SlicyDonutCenterLabelPlatesPapa')
            .jjStyle({
                width: textWidth + 'px'
            });

        defaultViewDiv = constructPlate(-1);

        bubbleDiv = platesPapa.jjAppend('div')
            .jjAddClass('SlicyDonutCenterLabelBubblePapa')
            .jjStyle({
                width: 2 * domState.innerR - 5 + 'px',
                height: 2 * domState.innerR - 5 + 'px'
            });
        populateBubble();
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

    function populateBubble() {
        bubbleShape = bubbleDiv.jjAppend('div')
            .jjAddClass('SlicyDonutCenterLabelBubbleShape');

        let choopchick = bubbleShape.jjAppend('div')
            .jjAddClass('SlicyDonutCenterLabelBubbleChoopchick');

        let valueP = bubbleDiv.jjAppend('p')
            .jjAddClass('SlicyDonutCenterLabelValue')
            .jjText(2000);
        let textP = bubbleDiv.jjAppend('p')
            .jjAddClass('SlicyDonutCenterLabelText')
            .jjText('Yoni Boni');
    }

    function updateBubbleLabel(highlightIndex) {
        let valueStr = getValueByIndex(highlightIndex);
        let textStr = getTextByIndex(highlightIndex);
        setInnerHTML(bubbleDiv, valueStr, textStr);
    }

    function showBuble() {
        bubbleDiv.jjAddClass('showBubble');
    }

    function hideBuble() {
        bubbleDiv.jjRemoveClass('showBubble');
    }

    /** Draw **/
    function rotateBubbleToPosition(highlightIndex) {
        let startVal = dataState.aggrArr[highlightIndex];
        let endVal = startVal + dataState.valueArr[highlightIndex];
        let ratio = (startVal + endVal) / 2;
        let deg = ratio * 360;
        bubbleShape.jjQuickTransform(0, 0, deg);
    }

    /** Interaction **/
    function onHighlight(highlightIndex) {
        if (highlightIndex < 0) {
            hideBuble();
        } else {
            updateBubbleLabel(highlightIndex);
            showBuble();
            rotateBubbleToPosition(highlightIndex);
        }
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