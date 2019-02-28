function UIManager_SlicyDonut(dataState, domState, labelComponent) {
    let drawUtil = new SlicyDonutDrawUtil(dataState, domState);
    let notchUtil = new SlicyDonutNotchUtil(dataState, domState);
    let interactionUtil = new InteractionUtil_SliceDonut(dataState, domState, labelComponent);
    let animationUtil = new AnimationUtil_SlicyDonut(dataState, domState, labelComponent);

    /** Public APIs **/
    this.runIntroAnimation = function () {
        //justDrawWithoutAnimation();
        runIntroAnimation();
    };

    /** Private Functions **/
    function runIntroAnimation() {
        drawUtil.positionMaskCircle();
        notchUtil.positionAllNotches();
        animationUtil.animatePathsOneByOne();
        interactionUtil.attachMouseInteractions();
    }

    function justDrawWithoutAnimation(){
        notchUtil.positionAllNotches();
        drawUtil.drawAllPaths();
        interactionUtil.attachMouseInteractions();
        labelComponent.showDefaultLabel();
    }
}