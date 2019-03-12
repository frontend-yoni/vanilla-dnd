//restoreDomWhenDone: On complete, make sure the DOM is restored to start position. (user will adjust it from outside by updating data list order)
function SportySimpleListDD(noMarginBetweenItems, restoreDomWhenDone) {
    let genUtil = new JJGeneralUtils();
    const SportyDragAndDropRelaseAnimationDuration = 200; //Must align with CSS SportyDragAndDropRelaseAnimationDuration
    let interUtil = SportyListDnDInteractionUtil.getInstance();
    const SCROLL_TIMEOUT = 62;
    /** Externally Set **/
    let externalAPI = { onStart: emptyFunc, onComplete: emptyFunc };
    let placeholderText = 'Drop content here';
    let listDiv;
    let scrollDiv;
    /** Internally Set **/
    let itemArray;
    let dropHintDiv;
    let origDragItem;
    /* Measurements */
    let hintFullHeight;
    let listBCRect;
    let initialScrollTop;
    let initialScrollHeight;
    let scrollTop;
    let bcTopDiff;

    /* Scroll */
    let scrollTimer;
    let lastVisibleDropIndex;
    /* State */
    let currentDropIndex;
    let prevDropIndex;
    let currentMouseEvent;
    let shiftItem;
    let origIndex;
    let isDragging;
    let releaseDelayTime = 0;
    let lastRearrangeTime;
    /* State - Visible Section */
    let visibleStartIndex;
    let visibleEndIndex;
    let firstVisibleRelativeTop;

    let ddManager = new SportyDragAndDropManager();

    /** Public APIs **/
    this.setListDiv = function (listDivI, scrollDivI = listDivI) {
        listDiv = JJPower.enhance(listDivI);
        scrollDiv = JJPower.enhance(scrollDivI);
        initializeDDManager();
    };

    this.setPlaceholderText = function (placeholderTextI) {
        placeholderText = placeholderTextI;
    };

    /***
     *
     * @param onStart(item, mouseEvent)
     * @param onComplete(origIndex, newIndex, itemDiv)
     */
    this.setResponseFunctions = function (onStart = emptyFunc, onComplete = emptyFunc) {
        externalAPI = { onStart, onComplete };
    };


    this.activateImmidiatelyOnMouseDown = function (e, listDivI, scrollDivI = listDivI) {
        listDiv = JJPower.enhance(listDivI);
        scrollDiv = JJPower.enhance(scrollDivI);
        ddManager.setResponseFunctions(onStart, onMove, onRelease, onComplete, onDown, onBeforeStart, getDelayTime);
        ddManager.activateNow(e, listDiv, scrollDiv);
    };

    /** Private Functions **/
    function initializeDDManager() {
        ddManager.makeMyKidsDraggable(listDiv, scrollDiv);
        ddManager.setResponseFunctions(onStart, onMove, onRelease, onComplete, onDown, onBeforeStart, getDelayTime);
    }

    function prepItemArray() {
        itemArray = listDiv.jjGetChildren();
        assignItemHeights();
    }

    /** Life Cycle **/
    function onDown() {
        prepItemArray();
    }

    function onBeforeStart(item, mouseEvent) {
        externalAPI.onStart(item, mouseEvent);
    }

    function getDelayTime() {
        return releaseDelayTime;
    }

    function onStart(item, mouseEvent) {
        isDragging = true;
        currentMouseEvent = mouseEvent;
        scrollDiv.jjAddEventListener('scroll', onInnerScroll);
        document.jjAddEventListener('scroll', onAnyScroll);
        origDragItem = item;
        preCalculations(item);
        introduceDropHint();
        setInitialMeasurements();
    }

    function onMove(item, mouseEvent) {
        currentMouseEvent = mouseEvent;
        rearrangeItemsIfNeeded(true);
    }

    function onRelease(item, mouseEvent) {
        scrollDiv.jjRemoveEventListener('scroll', onInnerScroll);
        document.jjRemoveEventListener('scroll', onAnyScroll);
        setReleaseTargetForDragClone();

        let timeSinceRearrange = genUtil.getNowTime() - lastRearrangeTime;
        //In case the release occurred while still animating the rearrange animation, delay the release
        if (timeSinceRearrange < SportyDragAndDropRelaseAnimationDuration) {
            releaseDelayTime = SportyDragAndDropRelaseAnimationDuration - timeSinceRearrange;
            setTimeout(updateDOMOnRelease, releaseDelayTime);
        } else {
            releaseDelayTime = 0;
            updateDOMOnRelease();
        }
    }

    function onComplete(item, mouseEvent) {
        isDragging = false;
        resetDOMAfterDrop();
        externalAPI.onComplete(origIndex, currentDropIndex, item);
        interUtil.clearEarlierDDClasses(listDiv);
    }

    /** Interaction **/
    function rearrangeItemsIfNeeded(triggeredByMouseMove) { //If not mousemove this was called by scroll
        if (interUtil.getIsMouseStillOnSamePositionRelativeToShiftItem(shiftItem, currentMouseEvent, dropHintDiv, listBCRect, scrollTop, triggeredByMouseMove)) {
            return;
        }
        shiftItem = undefined;

        currentDropIndex = getDropIndex(currentMouseEvent);

        if (currentDropIndex !== prevDropIndex) {
            shiftItem = getShiftItem();
            rearrangeItems();
        }
        prevDropIndex = currentDropIndex;
    }

    function rearrangeItems() {
        genUtil.relocateToNewIndexInArray(itemArray, prevDropIndex, currentDropIndex);

        updateItemsJJTop();
        updateVisibleIndices(); //Before animation stuff!

        interUtil.shiftRelevantItems(listDiv, itemArray, currentDropIndex, prevDropIndex, origIndex, hintFullHeight, dropHintDiv);
        interUtil.shiftHintDiv(dropHintDiv);

        interUtil.assignItemAboveHintClass(listDiv, itemArray, currentDropIndex);
        lastRearrangeTime = genUtil.getNowTime();
    }

    function getShiftItem() {
        let nextItem = getNextItem();
        let item = nextItem || itemArray[itemArray.length - 1];
        if (currentDropIndex > prevDropIndex) {
            item = itemArray[currentDropIndex];
        }
        return item;
    }

    function getNextItem() {
        let nextIndex = currentDropIndex + 1;
        if (nextIndex <= prevDropIndex) {
            nextIndex--;
        }
        return itemArray[nextIndex];
    }

    function shrinkHint() {
        dropHintDiv.jjForceStyleRecalc();
        if (releaseDelayTime) {
            dropHintDiv.jjAddClass('ease');
        } else {
            dropHintDiv.jjRemoveClass('ease');
        }
        dropHintDiv.style.height = origDragItem.jjHeight + 'px';
    }

    function resetDOMAfterDrop() {
        if (!restoreDomWhenDone) {
            repositionDraggedDivInDOM();
        }

        removeDropHint();
        for (let item of itemArray) {
            item.jjQuickTransform(0);
            item.style.transform = '';
            item.style.transition = null;
        }
    }

    function repositionDraggedDivInDOM() {
        listDiv.insertBefore(origDragItem, dropHintDiv);
    }

    function repositionHintDivInDOM() {
        let nextItem = getNextItem();
        if (nextItem) {
            listDiv.insertBefore(dropHintDiv, nextItem);
        } else {
            listDiv.appendChild(dropHintDiv);
        }
        dropHintDiv.jjQuickTransform(0, 0);

        for (let item of itemArray) {
            item.jjQuickTransform(0, 0);
            item.style.transition = 'none';
        }
    }

    function updateDOMOnRelease() {
        repositionHintDivInDOM();
        shrinkHint();
    }

    /** Calculations **/
    function getDropIndex(mouseEvent) {
        let relativeY = mouseEvent.clientY - listBCRect.top + scrollTop;
        let itemTop = firstVisibleRelativeTop;
        let match;
        let height;
        let bingoIndex;

        for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
            height = getFullHeightByIndex(i);
            match = getIsInside(relativeY, height, itemTop);
            if (match) {
                bingoIndex = i;
                break;
            }
            itemTop += height;
        }

        if (!match) {
            if (relativeY < itemTop) {
                bingoIndex = visibleStartIndex;
            } else {
                bingoIndex = visibleEndIndex;
            }
        }

        return bingoIndex;
    }

    function getIsInside(y, itemHeight, itemTop) {
        return (y >= itemTop && (y < itemTop + itemHeight));
    }

    function getFullHeightByIndex(index, hintIndex = prevDropIndex) {
        let height = itemArray[index].jjFullHeight;
        if (index === hintIndex) {
            height = hintFullHeight;
        }
        return height;
    }


    /** Measurements **/
    function setInitialMeasurements() {
        listBCRect = calculateActualBCRect();
        scrollTop = scrollDiv.scrollTop;
        updateItemsJJTop();
        dropHintDiv.origJJTop = dropHintDiv.jjTop;
        updateVisibleIndices();
    }

    function updateVisibleIndices() {
        visibleStartIndex = -1;
        visibleEndIndex = -1;
        let visible;
        let height;

        for (let i = 0; i < itemArray.length; i++) {
            height = getFullHeightByIndex(i);
            visible = getIsVisible(height, itemArray[i].jjTop);

            if (visible && visibleStartIndex < 0) { //First visible identified
                visibleStartIndex = i;
            } else if (visibleStartIndex >= 0 && !visible) { //We just got out of the visible range
                visibleEndIndex = i - 1;
            }
        }

        if (visibleEndIndex < 0) { //We never got out of the visible range
            visibleEndIndex = itemArray.length - 1;
        }

        let firstVisibleElement = itemArray[visibleStartIndex];
        if (firstVisibleElement === origDragItem) {
            firstVisibleElement = dropHintDiv;
        }
        firstVisibleRelativeTop = firstVisibleElement.jjTop;
    }

    function updateItemsJJTop() {
        let itemTop = 0;
        let height;

        for (let i = 0; i < itemArray.length; i++) {
            height = getFullHeightByIndex(i, currentDropIndex);
            itemArray[i].jjTop = itemTop;
            itemTop += height;
        }
        dropHintDiv.jjTop = itemArray[currentDropIndex].jjTop;
    }

    function getIsVisible(itemHeight, relativeItemTop) {
        let itemTop = relativeItemTop - scrollTop;
        return (itemTop + itemHeight > 0) && (itemTop < listBCRect.height);
    }

    function calcFullHeight(item, naiveHeight) {
        return naiveHeight
            + genUtil.getNumValOfStyle(item, 'margin-bottom')
            + genUtil.getNumValOfStyle(item, 'margin-top');
    }

    /** Builder **/
    function introduceDropHint() {
        origDragItem.origDisplay = origDragItem.style.display;
        origDragItem.style.display = 'none';
        dropHintDiv = createDropHintDiv();
        shiftItem = itemArray[origIndex + 1];
        listDiv.insertBefore(dropHintDiv, origDragItem);

        initialHintPositionCalculations();

        ddManager.updateLayoutMeasurements();
        dropHintDiv.style.height = origDragItem.jjHeight + 'px';

        lastVisibleDropIndex = origIndex;
        interUtil.assignItemAboveHintClass(listDiv, itemArray, origIndex);
        requestAnimationFrame(_ => requestAnimationFrame(animateHintInto)); //Ugly delay tp activate animation
    }

    function animateHintInto() {
        dropHintDiv.jjAddClass('animateHeightOfHint');
        dropHintDiv.style.height = '';
    }

    function createDropHintDiv() {
        let hintDiv = JJPower.jjCreateElement('div')
            .jjAddClass('SportySimpleListDDDrpHint');

        if (noMarginBetweenItems) {
            hintDiv.jjAddClass('NoMarginBetweenItemsSoAddInternally');
            let innerDiv = hintDiv.jjAppend('div')
                .jjAddClass('SportySimpleListDDDrpHint_innerDiv')
                .jjText(placeholderText);
        } else {
            hintDiv.jjText(placeholderText);
        }

        return hintDiv;
    }

    function removeDropHint() {
        if (dropHintDiv) {
            dropHintDiv.jjRemoveMe();
        }
        origDragItem.style.display = origDragItem.origDisplay;
    }

    function hideHintMaybe() {
        if (lastVisibleDropIndex !== currentDropIndex && ddManager.getIsDecentScrollSpeed_v()) {
            dropHintDiv.jjAddClass('DnDHideHint');
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(showHint, SCROLL_TIMEOUT);
        }
    }

    function showHint() {
        dropHintDiv.jjRemoveClass('DnDHideHint');
        lastVisibleDropIndex = currentDropIndex;
    }

    /** Prep **/
    function preCalculations(item) {
        currentDropIndex = itemArray.indexOf(item);
        prevDropIndex = currentDropIndex;
        origIndex = currentDropIndex;
        initialScrollTop = scrollDiv.scrollTop;
        initialScrollHeight = scrollDiv.scrollHeight;
    }

    function initialHintPositionCalculations() {
        hintFullHeight = calcFullHeight(dropHintDiv, dropHintDiv.getBoundingClientRect().height);
        initialScrollTop = scrollDiv.scrollTop;
    }

    function setReleaseTargetForDragClone() {
        let maxScrollTopAfterRelease = initialScrollHeight - listBCRect.height;
        let scrollTopBeforeShrink = scrollDiv.scrollTop;
        let willScrollMoveWhenHintShrinks = scrollTopBeforeShrink > maxScrollTopAfterRelease;
        if (willScrollMoveWhenHintShrinks) { //Position hint where it should be after shrinking
            dropHintDiv.jjRemoveClass('animateHeightOfHint');
            dropHintDiv.style.height = origDragItem.jjHeight + 'px';
        }

        ddManager.setDropTargetBCRect(dropHintDiv.getBoundingClientRect());

        if (willScrollMoveWhenHintShrinks) { //Restore hint to right before shrinking
            dropHintDiv.style.height = '';
            dropHintDiv.jjForceStyleRecalc();
            dropHintDiv.jjAddClass('animateHeightOfHint');
            scrollDiv.scrollTop = scrollTopBeforeShrink;
        }
    }

    function assignItemHeights() {
        for (let item of itemArray) {
            item.jjHeight = item.getBoundingClientRect().height;
            item.jjFullHeight = calcFullHeight(item, item.jjHeight);
        }
    }

    function calculateActualBCRect() {
        let origBCRect = listDiv.getBoundingClientRect();
        let scrollDivBCRect = scrollDiv.getBoundingClientRect();

        let bcRect = {
            top: origBCRect.top,
            height: origBCRect.height,
            left: origBCRect.left,
            right: origBCRect.right,
        };

        bcRect.top = scrollDivBCRect.top;
        bcRect.height = Math.min(bcRect.height, scrollDivBCRect.height);
        return bcRect;
    }

    /** Event Listeners **/
    function onInnerScroll(e) {
        scrollTop = scrollDiv.scrollTop;
        bcTopDiff = scrollTop - initialScrollTop;
        e.innerScroll_SportySimpleListDD = true;
        updateVisibleIndices();
        rearrangeItemsIfNeeded();

        hideHintMaybe();
    }

    function onAnyScroll(e) {
        if (e.innerScroll_SportySimpleListDD) {
            return;
        }
        listBCRect = calculateActualBCRect();
        updateVisibleIndices();
    }

    function emptyFunc(item, mouseEvent) {
    }
}