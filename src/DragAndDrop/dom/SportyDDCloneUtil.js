function SportyDDCloneUtil(papaDomUtil) {
    const ROTATE_DEG = 3;
    const SportyDragAndDropRelaseAnimationDuration = 200; //Must align with CSS SportyDragAndDropRelaseAnimationDuration
    let html;

    /* Clone */
    let cloneContainer;
    let itemClone;
    /* Orig */
    let targetContainer;
    let ddItem;
    let dropTargetBCRect;
    /* Measurements */
    let itemBCRect;
    let origComputedStyle;
    /* Mouse */
    let startEvent;
    let currentEvent;

    /** Public APIs **/
    this.initialize = function () {
        html = JJPower.query('html');
    };

    this.reactToDragStart = function (ddItemI, startEventI, targetContainerI) {
        startEvent = startEventI;
        currentEvent = startEvent;
        ddItem = ddItemI;
        targetContainer = targetContainerI;
        itemBCRect = ddItem.getBoundingClientRect();
        origComputedStyle = window.getComputedStyle(ddItem);
        createClone();
    };

    this.runCloneMoveFrame = function (currentEventI) {
        currentEvent = currentEventI;
        positionClone();
    };

    this.reactToDragRelease = function (extraDuration) {
        beginReleaseSequence(extraDuration);
    };

    this.setDropTargetBCRect = function (dropTargetBCRectI) {
        dropTargetBCRect = dropTargetBCRectI;
    };

    /** Private Function **/

    /** Interaction **/
    function createClone() {
        let containerPapa = JJPower.enhance(ddItem.parentNode);
        cloneContainer = containerPapa.jjAppend('div')
            .jjAddClass('SportyDDCloneContainer');

        itemClone = ddItem.cloneNode(true);
        itemClone = JJPower.enhance(itemClone);
        itemClone.jjAddClass('SportyDDActualClone');

        cloneContainer.appendChild(itemClone);
        adjustCloneSize();
    }

    function removeClone() {
        if (cloneContainer) {
            cloneContainer.jjRemoveMe();
        }
    }

    /** Life Cycle **/
    function beginReleaseSequence(extraDuration) {
        html.jjAddClass('SportyDDReleaseSequenceInitiated');

        if (extraDuration) {
            let duration = SportyDragAndDropRelaseAnimationDuration + extraDuration;
            cloneContainer.jjStyle({
                transition: `${duration}ms transform`
            })
        }

        cloneContainer.jjAddClass('SportyDDCloneReleaseAnimation');
        applyDropCoordinates();
        cloneContainer.jjAddEventListener('transitionend', onDropTransitionEnd);
    }

    /** Adjustments **/
    function adjustCloneSize() {
        cloneContainer.jjStyle({
            width: itemBCRect.width + 'px',
            height: itemBCRect.height + 'px',
            top: itemBCRect.top + 'px',
            left: itemBCRect.left + 'px',
            'transform-origin': getTransformOrigin()
        });
        replaceMissingBorderWithPadding();
        positionClone();
    }

    function replaceMissingBorderWithPadding() {
        let ocs = origComputedStyle;

        let topPad = `calc(${ocs.paddingTop} + ${ocs.borderTopWidth})`;
        let bottomPad = `calc(${ocs.paddingBottom} + ${ocs.borderBottomWidth})`;
        let leftPad = `calc(${ocs.paddingLeft} + ${ocs.borderLeftWidth})`;
        let rightPad = `calc(${ocs.paddingRight} + ${ocs.borderRightWidth})`;

        itemClone.jjStyle({
            'padding-top': topPad,
            'padding-bottom': bottomPad,
            'padding-left': leftPad,
            'padding-right': rightPad
        });
    }

    function positionClone() {
        let xDelta = currentEvent.clientX - startEvent.clientX;
        let yDelta = currentEvent.clientY - startEvent.clientY;
        cloneContainer.jjQuickTransform(xDelta, yDelta, ROTATE_DEG);
    }

    function getTransformOrigin() {
        let relativeX = currentEvent.clientX - itemBCRect.left;
        let relativeY = currentEvent.clientY - itemBCRect.top;
        return `${relativeX}px ${relativeY}px`
    }

    function applyDropCoordinates() {
        let left = dropTargetBCRect.left;
        let top = dropTargetBCRect.top;

        let relativeX = left - itemBCRect.left;
        let relativeY = top - itemBCRect.top;

        cloneContainer.jjQuickTransform(relativeX, relativeY, 0);
    }

    /** Event Listeners **/
    function onDropTransitionEnd(e) {
        html.jjRemoveClass('SportyDDReleaseSequenceInitiated');
        removeClone();
        papaDomUtil.reactToDropAnimationEnd();
    }
}