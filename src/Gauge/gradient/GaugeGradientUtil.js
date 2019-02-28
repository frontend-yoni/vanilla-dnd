function GaugeGradientUtil(uniqueCounter) {
    let mainBuilder = new GaugeGradientBuilder(uniqueCounter);
    let bgBuilder = new GaugeGradientBuilder(uniqueCounter, true);
    let mainGradientArr;
    let bgGradientArr;

    let svg;
    let defTag;
    let mainLayerTag;
    let bgLayerTag;
    /** Public APIs **/
    this.setSVG = function (svgI) {
        svg = svgI;
    };

    this.generateInitialDefTag = function (svgI) {
        svg = svgI;
        createDef();
    };

    this.setColors = function(gradientStart, gradientEnd){
        mainBuilder.setColors(gradientStart, gradientEnd);
        bgBuilder.setColors(gradientStart, gradientEnd);
    };

    this.applyGradients = function (gradientValsObject, isMain) {
        applyGradients(gradientValsObject, isMain);
    };

    /** Private Functions **/
    function createDef() {
        defTag = svg.jjAppend('defs');
        createMainGradientTag();
        createBGGradientTag();
    }

    function createMainGradientTag() {
        mainLayerTag = defTag.jjAppend('g')
            .jjAddClass('mainLayerTag');
        mainGradientArr = mainBuilder.buildAllGradientTags(mainLayerTag);
    }

    function createBGGradientTag() {
        bgLayerTag = defTag.jjAppend('g')
            .jjAddClass('bgLayerTag');
        bgGradientArr = bgBuilder.buildAllGradientTags(bgLayerTag);
    }

    function applyGradients(gradientValsObject, isMain) {
        let gradientArr = mainGradientArr;
        if(!isMain){
            gradientArr = bgGradientArr;
        }

        gradientArr[0].jjAttr(gradientValsObject.topRight);
        gradientArr[1].jjAttr(gradientValsObject.midRight);
        gradientArr[2].jjAttr(gradientValsObject.bottomRight);
        gradientArr[3].jjAttr(gradientValsObject.bottomLeft);
        gradientArr[4].jjAttr(gradientValsObject.midLeft);
        gradientArr[5].jjAttr(gradientValsObject.topLeft);
    }
}