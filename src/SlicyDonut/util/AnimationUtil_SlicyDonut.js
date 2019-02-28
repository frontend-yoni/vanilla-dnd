function AnimationUtil_SlicyDonut(dataState, domState, labelComponent){
    const SLICE_ANIMATION_DURATION = 500;

    let drawUtil = new SlicyDonutDrawUtil(dataState, domState);

    /** Public APIs **/
    this.animatePathsOneByOne = function () {
        animatePathsOneByOne();
    };

    /** Private Functions **/
    function animatePathsOneByOne() {
        domState.mainSVG.jjAddClass('AnimatingSlices');
        animateSlice(0);
    }

    function animateSlice(sliceIndex) {
        let pathElement = domState.pathArr[sliceIndex];


        unMarkAsCurrentlyAnimatingSlice();
        markAsCurrentlyAnimating(pathElement);

        labelComponent.onHighlight(sliceIndex);

        pathElement.jjAnimate(sliceFrame, SLICE_ANIMATION_DURATION, sliceAnimationEnd);
    }

    function sliceFrame(t, pathElement) {

        drawUtil.drawPathByProgress(pathElement, t);
    }

    function sliceAnimationEnd(pathElement) {
        let nextIndex = pathElement.jjGetIndex() + 1;
        if (nextIndex < domState.pathArr.length) {
            animateSlice(nextIndex);
        } else {
            onOneByOneAllFinished();
        }
    }

    function onOneByOneAllFinished() {
        domState.mainSVG.jjRemoveClass('AnimatingSlices');
        unMarkAsCurrentlyAnimatingSlice();

        labelComponent.onHighlight(-1);
    }

    /** CSS Games **/
    function markAsCurrentlyAnimating(pathElement){
        pathElement.jjAddClass('CurrentAnimatingSlice');
    }

    function unMarkAsCurrentlyAnimatingSlice() {
        for (let pathElement of domState.pathArr) {
            pathElement.jjRemoveClass('CurrentAnimatingSlice');
        }
    }
}