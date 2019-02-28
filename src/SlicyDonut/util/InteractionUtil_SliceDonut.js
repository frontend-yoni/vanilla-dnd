function InteractionUtil_SliceDonut(dataState, domState, labelComponent) {
    /** Public APIs **/
    this.attachMouseInteractions = function () {
        attachMouseInteractions();
    };

    /** Private Functions **/
    function attachMouseInteractions() {
        for (let slice of domState.pathArr) {
            slice.jjAddEventListener('mouseenter', onHover);
            slice.jjAddEventListener('mouseleave', onOut);
            domState.mainSVG.jjAddEventListener('mouseleave', onOut);
        }
    }

    function onHover(e) {
        let slice = JJPower.enhance(e.currentTarget);
        unMarkAsHovered();
        markAsHovered(slice);

        labelComponent.onHighlight(slice.jjGetIndex());
    }

    function onOut(e) {
        let relatedTarget = JJPower.enhance(e.relatedTarget);
        let isInsideDonut = (relatedTarget.jjContainsClass('SlicyDonutMaskCircle'));
        if (!isInsideDonut) {
            unMarkAsHovered();
            labelComponent.onHighlight(-1);
        }
    }

    /** Highlights **/
    function markAsHovered(slice) {
        domState.mainSVG.jjAddClass('SlicyDonutHoverState');
        slice.jjAddClass('SlicyDonutHoverSlice');
    }

    function unMarkAsHovered() {
        for (let slice of domState.pathArr) {
            slice.jjRemoveClass('SlicyDonutHoverSlice');
        }
        domState.mainSVG.jjRemoveClass('SlicyDonutHoverState');
    }
}