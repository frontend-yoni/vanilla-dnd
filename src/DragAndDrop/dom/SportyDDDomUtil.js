function SportyDDDomUtil(papaDDManager) {
    let me = this;
    let cloneUtil = new SportyDDCloneUtil(me);

    /* Structure */
    let htmlElement;
    let ddTargetContainer;
    /* State */
    let ddItem;

    /** Public APIs **/
    this.initialize = function () {
        htmlElement = JJPower.query('html');
        cloneUtil.initialize();
    };

    this.setDDTargetContainer = function (ddTargetContainerI) {
        ddTargetContainer = ddTargetContainerI;
        ddTargetContainer.jjAddClass('MyKidsAreDraggableContainer');
    };

    this.reactToDragStart = function (ddItemI, startEventI) {
        ddItem = ddItemI;
        freezeMouseEvents();
        cloneUtil.reactToDragStart(ddItem, startEventI, ddTargetContainer);
    };

    this.reactToDragRelease = function (extraDuration) {
        cloneUtil.reactToDragRelease(extraDuration);
    };

    this.runDOMUtilMoveFrame = function (currentEventI) {
        cloneUtil.runCloneMoveFrame(currentEventI);
    };

    this.setDropTargetBCRect = function (dropTargetBCRectI) {
        cloneUtil.setDropTargetBCRect(dropTargetBCRectI);
    };

    this.getDraggableItem = function (e) {
        return getDraggableItem(e);
    };

    /** Internal API to be called by child components **/
    this.reactToDropAnimationEnd = function () {
        unFreezeMouseEvents();
        papaDDManager.reactToDropAnimationEnd();
    };

    /** Private Function **/
    function getDraggableItem(e) {
        let origDiv = e.target;
        let prevDiv;
        while (origDiv !== ddTargetContainer) {
            prevDiv = origDiv;
            origDiv = origDiv.parentNode;
        }
        return JJPower.enhance(prevDiv);
    }

    /** Interaction **/
    function freezeMouseEvents() {
        htmlElement.jjAddClass('SportyDragAndDropActivated');
        ddTargetContainer.jjAddClass('SportyDDActivatedContainer');
    }

    function unFreezeMouseEvents() {
        htmlElement.jjRemoveClass('SportyDragAndDropActivated');
        ddTargetContainer.jjRemoveClass('SportyDDActivatedContainer');
    }
}