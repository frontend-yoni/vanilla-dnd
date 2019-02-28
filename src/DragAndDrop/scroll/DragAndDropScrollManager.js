function DragAndDropScrollManager() {
    let generalUtil = JJGeneralUtils.getInstance();
    const DIRECTIONS = DragAndDropScrollManager.MOVE_DIRECTION_TYPE_VERTICAL;
    const POSITION = DragAndDropScrollManager.MOUSE_POSITON_SATE;
    /** Constants **/
    let SCROLL_ACTIVATION_AREA_SIZE = 75; //The area on the edges of the container that moving the mouse there triggers scroll
    let MIN_PIXEL_PER_SECOND = 200;
    let MAX_PIXEL_PER_SECOND = 800;
    let MID_PIXEL_PER_SECOND = (MIN_PIXEL_PER_SECOND + MAX_PIXEL_PER_SECOND) / 2;
    /** External Div **/
    let scrollingDiv;
    let frameTime = 0;
    let isVertical = true;
    let isHorizontal = false;
    let mouseEvent;
    /** Internally Set **/
    let bcRect;
    let pixelPerSecond_h;
    let pixelPerSecond_v;
    let mouseOutWithMaxSpeed_v = false; //Did the mouse leave the container when scroll speed was max
    let lastFrameTime;
    let isInsideScrollDiv;
    let mousePositionState;
    let mouseMoveDirection = DIRECTIONS.NONE;
    let prevMouseEvent;

    /** Public APIs **/
    this.setScrollContainer = function (scrollingDivI, isVerticalI = true, isHorizontalI) {
        scrollingDiv = JJPower.enhance(scrollingDivI);
        isVertical = isVerticalI;
        isHorizontal = isHorizontalI;
    };

    this.onPreDragMouseDown = function(mouseEventI){
        prevMouseEvent = mouseEventI;
    };

    this.activateNow = function (mouseEventI) {
        mouseEvent = mouseEventI;
        activateNow();
    };

    this.runScrollFrame = function (mouseEventI, frameTimeI) {
        mouseEvent = mouseEventI;
        frameTime = frameTimeI;
        runFrame();
    };

    this.allDone = function () {
        detachGlobalEvents();
        detachWheelEvent();
        mouseMoveDirection = DIRECTIONS.NONE;
    };

    this.getIsMouseInside = function () {
        return isInsideScrollDiv;
    };

    this.updateLayoutMeasurements = function () {
        updateBCRect();
    };

    this.getIsDecentScrollSpeed_v = function () {
        return Math.abs(pixelPerSecond_v) >= MID_PIXEL_PER_SECOND;
    };

    /** Private Functions **/

    function attachGlobalEvents() {
        document.jjAddEventListener('scroll', onDocScroll);
        scrollingDiv.jjAddEventListener('scroll', onInnerScroll);
    }

    function detachGlobalEvents() {
        document.jjRemoveEventListener('scroll', onDocScroll);
        scrollingDiv.jjRemoveEventListener('scroll', onInnerScroll);
    }

    function attachWheelEvent() {
        document.jjAddEventListener('wheel', onWheel);
    }

    function detachWheelEvent() {
        document.jjRemoveEventListener('wheel', onWheel);
    }

    function runFrame() {
        let inside = generalUtil.checkIfMouseInside(scrollingDiv, mouseEvent, bcRect);
        mouseMoveDirection = calcMouseDirection();
        let position = calculatePositionState(isInsideScrollDiv, inside, mousePositionState);

        switch (position) {
            case POSITION.Just_In:
                uponEnter();
                break;
            case POSITION.Still_Inside:
                uponMovingInside();
                break;
            case POSITION.Just_Left:
                uponLeave();
                break;
        }

        if (isInsideScrollDiv && !inside) {
            mouseOutWithMaxSpeed_v = (Math.abs(pixelPerSecond_v) === MAX_PIXEL_PER_SECOND);
        }

        isInsideScrollDiv = inside;
        mousePositionState = position;
        prevMouseEvent = mouseEvent;
        lastFrameTime = frameTime;
    }

    function calcMouseDirection() {
        let suggestedDirection = mouseMoveDirection;
        if (prevMouseEvent) {
            let prevY = prevMouseEvent.clientY;
            let currY = mouseEvent.clientY;
            if (currY > prevY) {
                suggestedDirection = DIRECTIONS.DOWN;
            } else if (currY < prevY) {
                suggestedDirection = DIRECTIONS.UP;
            }
        }
        return suggestedDirection;
    }

    function uponEnter() {
        attachWheelEvent();
    }

    function uponLeave() {
        detachWheelEvent();
    }

    function uponMovingInside() {
        determineScrollSpeeds();
        if (pixelPerSecond_v || pixelPerSecond_h) {
            performScrolling();
        }
    }

    function calculatePositionState(wasInside, inside, prevPosition) {
        let position;

        if (!wasInside && inside) {
            position = POSITION.Just_In;
        } else if (wasInside && inside) {
            position = POSITION.Still_Inside;
        } else if (prevPosition === POSITION.Still_Inside && mouseOutWithMaxSpeed_v) {
            position = POSITION.Still_Inside;
        } else if (prevPosition === POSITION.Just_In && wasInside) {
            position = POSITION.Still_Inside;
        } else if (prevPosition === POSITION.Still_Inside && wasInside) {
            position = POSITION.Still_Inside;
        } else {
            position = POSITION.Just_Left;
        }

        return position;
    }

    /** Event Listeners **/
    function activateNow() {
        isInsideScrollDiv = false;
        attachGlobalEvents();
        updateBCRect();
    }

    function onDocScroll(e) {
        if (e.isInnerScroll) {
            return;
        }
        updateBCRect();
    }

    function onInnerScroll(e) {
        e.isInnerScroll = true;
    }

    function onWheel(e) {
        if (e.deltaY) {
            scrollVertically(e.deltaY);
        }
        if (e.deltaX) {
            scrollHorizontally(e.deltaX);
        }
    }

    /** Scroll Animation **/
    function performScrolling() {
        if (isVertical) {
            verticalScrollFrame();
        }
        if (isHorizontal) {
            horizontalScrollFrame();
        }
    }

    function verticalScrollFrame() {
        determineScrollSpeed_Vertical();
        if (pixelPerSecond_v) {
            performScroll_Vertical();
        }
    }

    function horizontalScrollFrame() {
        determineScrollSpeed_Horizontal();
        if (pixelPerSecond_h) {
            performScroll_Horizontal();
        }
    }

    function determineScrollSpeeds() {
        if (isVertical) {
            determineScrollSpeed_Vertical();
        }
        if (isHorizontal) {
            determineScrollSpeed_Horizontal();
        }
    }

    /** Util **/
    function determineScrollSpeed_Horizontal() {
        let leftDelta = mouseEvent.clientX - bcRect.left;
        let rightDelta = bcRect.width - leftDelta;
        if (leftDelta <= SCROLL_ACTIVATION_AREA_SIZE) { //Left side
            pixelPerSecond_h = -1 * calculateScrollSpeed(leftDelta);
        } else if (rightDelta <= SCROLL_ACTIVATION_AREA_SIZE) { //Right side
            pixelPerSecond_h = calculateScrollSpeed(rightDelta);
        } else { //None
            pixelPerSecond_h = 0;
        }
    }

    function performScroll_Horizontal() {
        let shiftPixels = getShiftPixels(pixelPerSecond_h);
        scrollHorizontally(shiftPixels);
    }

    function determineScrollSpeed_Vertical() {
        let topDelta = mouseEvent.clientY - bcRect.top;
        let bottomDelta = bcRect.height - topDelta;

        if (topDelta <= SCROLL_ACTIVATION_AREA_SIZE) { //Top side
            pixelPerSecond_v = -1 * calculateScrollSpeed(topDelta);
        } else if (bottomDelta <= SCROLL_ACTIVATION_AREA_SIZE) { //Bottom side
            pixelPerSecond_v = calculateScrollSpeed(bottomDelta);
        } else { //None
            pixelPerSecond_v = 0;
        }

        //If the mouse moved to the other direction, don't scroll
        if (pixelPerSecond_v < 0 && mouseMoveDirection === DIRECTIONS.DOWN) {
            pixelPerSecond_v = 0;
        } else if (pixelPerSecond_v > 0 && mouseMoveDirection === DIRECTIONS.UP) {
            pixelPerSecond_v = 0;
        }
    }

    function performScroll_Vertical() {
        let shiftPixels = getShiftPixels(pixelPerSecond_v);
        scrollVertically(shiftPixels);
    }

    function getShiftPixels(pixelPerSecond) {
        let secondsPast = (frameTime - lastFrameTime) / 1000;
        let shiftPixels = secondsPast * pixelPerSecond;
        shiftPixels = Math.round(shiftPixels) || shiftPixels;
        return shiftPixels;
    }

    function calculateScrollSpeed(delta) {
        let speed = 0;
        let ratio;

        if (delta > 0 && delta <= SCROLL_ACTIVATION_AREA_SIZE) {
            ratio = 1 - delta / SCROLL_ACTIVATION_AREA_SIZE;
        }
        else if (delta <= 0) {
            ratio = 1;
        }

        if (ratio >= 0) {
            speed = generalUtil.getValueByProgress(MIN_PIXEL_PER_SECOND, MAX_PIXEL_PER_SECOND, ratio);
        }
        return speed;
    }

    function scrollVertically(shiftPixels) {
        let newScrollTop = scrollingDiv.scrollTop + shiftPixels;
        newScrollTop = Math.max(newScrollTop, 0);
        if (shiftPixels && newScrollTop !== scrollingDiv.scrollTop) {
            scrollingDiv.scrollTop = newScrollTop;
        }

    }

    function scrollHorizontally(shiftPixels) {
        let newScrollLeft = scrollingDiv.scrollLeft + shiftPixels;
        newScrollLeft = Math.max(newScrollLeft, 0);
        if (shiftPixels && newScrollLeft !== scrollingDiv.scrollLeft) {
            scrollingDiv.scrollLeft = newScrollLeft;
        }
    }

    /** Measurements Calculations **/
    function updateBCRect() {
        bcRect = scrollingDiv.getBoundingClientRect();
    }
}

DragAndDropScrollManager.MOVE_DIRECTION_TYPE_VERTICAL = {
    'NONE': 'NONE',
    'UP': 'UP',
    'DOWN': 'DOWN'
};

DragAndDropScrollManager.MOUSE_POSITON_SATE = {
    'Still_Inside': 'Still_Inside',
    'Just_Left': 'Just_Left',
    'Just_In': 'Just_In'
};

