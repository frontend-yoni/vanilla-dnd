function GaugeGradientBuilder(uniqueCounter, isBG) {
    let startColor = '#1a237e';
    let endColor = '#42b3d5';
    let papaTag;

    let gradientArr;

    this.setColors = function (gradientStart = '#1a237e', gradientEnd = '#42b3d5') {
        startColor = gradientStart;
        endColor = gradientEnd;
    };

    this.buildAllGradientTags = function (papaTagI) {
        papaTag = papaTagI;
        gradientArr = [];
        for (let i = 0; i < 6; i++) {
            buildInitialGradientTag(i);
        }

        return gradientArr;
    };

    function buildInitialGradientTag(index) {
        let gradientTag = papaTag.jjAppend('linearGradient')
            .jjAttr({
                id: generateID(index)
            });

        let coordinates = getOrdinaryCoordinates(index);
        gradientTag.jjAttr(coordinates);
        attachColorsTags(gradientTag);

        gradientArr.push(gradientTag);
    }

    function attachColorsTags(gradientTag) {
        gradientTag.jjAppend('stop')
            .jjAttr({
                offset: '0',
                'stop-color': startColor
            });

        gradientTag.jjAppend('stop')
            .jjAttr({
                offset: 1,
                'stop-color': endColor
            });
    }

    /** static functions **/
    function getOrdinaryCoordinates(index) {
        let coordinates = {};
        switch (index) {
            case 0:
                coordinates = { x1: 0, y1: 0, x2: 6, y2: 6 };
                break;
            case 1:
                coordinates = { x1: 0, y1: -1, x2: 0, y2: 5 };
                break;
            case 2:
                coordinates = { x1: 3, y1: -2, x2: -3, y2: 4 };
                break;
            case 3:
                coordinates = { x1: 4, y1: 4, x2: -2, y2: -2 };
                break;
            case 4:
                coordinates = { x1: 0, y1: 5, x2: 0, y2: -1 };
                break;
            case 5:
                coordinates = { x1: -5, y1: 6, x2: 1, y2: 0 };
                break;
        }

        return coordinates;
    }

    /** Misc Util **/
    function generateID(index) {
        let id = 'grad';
        if (isBG) {
            id += 'BG';
        }
        id += `${index}`;
        if (uniqueCounter > 0) {
            id += `_${uniqueCounter}`;
        }
        return id;
    }

}