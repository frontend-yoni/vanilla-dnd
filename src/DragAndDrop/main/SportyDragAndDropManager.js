function SportyDragAndDropManager() {
    let me = this;
    let alreadyInitialized;
    let genUtil = JJGeneralUtils.getInstance();
    let domUtil = new SportyDDDomUtil(me);
    let scrollUtil = new DragAndDropScrollManager();
    /** Externally Set **/
    let externalAPI = {
        onBeforeStart: emptyFunc,
        onStart: emptyFunc,
        onMove: emptyFunc,
        onRelease: emptyFunc,
        onComplete: emptyFunc,
        getDelayTime: emptyFunc
    };
    let disregardClassArr = [];
    /** Internally Set **/
    let managementAnimationObject;
    /* State */
    let ddTargetContainer;
    let ddItem;
    /* Mouse */
    let isDragging;
    let startEvent;
    let currentEvent;
    let prevEvent;
    /* Lifecycle */
    let framesAnimationObj;

    /** Public APIs **/
    this.makeMyKidsDraggable = function (targetContainerI, scrollDivI) {
        ddTargetContainer = targetContainerI;
        scrollUtil.setScrollContainer(scrollDivI);
        domUtil.setDDTargetContainer(targetContainerI);
        makeKidsDraggable();
    };

    this.setDropTargetBCRect = function (dropTargetBCRectI) {
        domUtil.setDropTargetBCRect(dropTargetBCRectI);
    };

    this.updateLayoutMeasurements = function () {
        scrollUtil.updateLayoutMeasurements();
    };

    this.activateNow = function (e, targetContainerI, scrollDivI) {
        ddTargetContainer = targetContainerI;
        scrollUtil.setScrollContainer(scrollDivI);
        domUtil.setDDTargetContainer(targetContainerI);
        initializeIfNeeded();
        onMouseDown(e);
    };

    /***
     *
     * @param onStart(item, mouseEvent)
     * @param onMove(item, mouseEvent)
     * @param onRelease(item, mouseEvent)
     * @param onComplete(item, mouseEvent)
     */
    this.setResponseFunctions = function (onStart = emptyFunc, onMove = emptyFunc, onRelease = emptyFunc, onComplete = emptyFunc, onDown = emptyFunc, onBeforeStart = emptyFunc, getDelayTime = emptyFunc) {
        externalAPI = { onBeforeStart, onStart, onMove, onRelease, onComplete, onDown, getDelayTime };
    };

    this.setDisregardClasses = function (classArr = []) {
        disregardClassArr = classArr;
    };

    /** Internal API to be called by child components **/
    this.reactToDropAnimationEnd = function () {
        externalAPI.onComplete(ddItem, currentEvent);
    };

    this.getIsDecentScrollSpeed_v = function () {
        return scrollUtil.getIsDecentScrollSpeed_v();
    };

    /** Private Functions **/
    function makeKidsDraggable() {
        initializeIfNeeded();
        ddTargetContainer.jjAddEventListener('mousedown', onMouseDown, false, { passive: false });
    }

    function startDDManagementAnimation() {
        managementAnimationObject = JJPower.jjAnimateForever(ddFrame);
    }

    function stopDDManagementAnimation() {
        JJPower.jjStopAnimatingForever(managementAnimationObject);
    }

    function ddFrame(frameTime) {
        if (currentEvent !== prevEvent) {
            runMoveFrame();
        }
        scrollUtil.runScrollFrame(currentEvent, frameTime);
        prevEvent = currentEvent;
    }

    /** Event Listeners **/
    function onMouseDown(e) {
        if (e.touches) {
            e.preventDefault();
        }
        genUtil.updateXYForTocuchEvent(e);
        ddItem = domUtil.getDraggableItem(e);
        if (e.button === 2) { //Right click
            return;
        }
        if (checkShouldDisregard(e.target) || !ddItem) {
            return;
        }
        scrollUtil.onPreDragMouseDown(e);
        externalAPI.onDown(e);
        startEvent = e;
        document.jjAddEventListener('mouseup', onMouseUp);
        document.jjAddEventListener('mousemove', onMouseMove, false, { passive: false });

        isDragging = false;
    }

    function onMouseMove(e) {
        e.preventDefault();

        genUtil.updateXYForTocuchEvent(e);
        currentEvent = e;
        if (!isDragging) {
            onDragStart(e);
        }

        isDragging = true; //Only after first move consider it a drag.

    }

    function onMouseUp() {
        document.jjRemoveEventListener('mousemove', onMouseMove);
        if (isDragging) {
            onDragRelease();
        }

        isDragging = false;
    }

    /** DnD LifeCycle **/
    function onDragStart() {
        externalAPI.onBeforeStart(ddItem, startEvent);
        domUtil.reactToDragStart(ddItem, startEvent);
        scrollUtil.activateNow(startEvent);
        externalAPI.onStart(ddItem, startEvent);

        startDDManagementAnimation();
    }

    function runMoveFrame() {
        domUtil.runDOMUtilMoveFrame(currentEvent);
        if (scrollUtil.getIsMouseInside()) {
            externalAPI.onMove(ddItem, currentEvent);
        }
    }

    function onDragRelease() {
        document.jjRemoveEventListener('mouseup', onMouseUp);
        externalAPI.onRelease(ddItem, currentEvent);
        let delayTime = externalAPI.getDelayTime() || 0;
        domUtil.reactToDragRelease(delayTime);
        scrollUtil.allDone();

        stopDDManagementAnimation();
    }

    /** Prep **/
    function initializeIfNeeded() {
        if (!alreadyInitialized) {
            domUtil.initialize();
        }
    }

    function emptyFunc(item, mouseEvent) {
    }

    function checkShouldDisregard(element) {
        let classArr = element.classList;
        let bingo = genUtil.getClosestPapa(element, 'button', '.ddDraggable');

        return bingo;
    }
}