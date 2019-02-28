function SportyListDnDInteractionUtil() {
    const MAX_SHIFT_COUNT = 20;
    const POSITIONS = SportyListDnDInteractionUtil.POSITIONS;

    let listDiv;
    let itemsArr;
    let currentIndex;
    let prevIndex;
    let origHIntIndex;
    let hintHeight;
    let dropHintDiv;

    /** Public APIs **/
    this.getIsMouseStillOnSamePositionRelativeToShiftItem = function (shiftItem, currentMouseEvent, dropHintDiv, triggeredByMouseMove) {
        return getIsMouseStillOnSamePositionRelativeToShiftItem(shiftItem, currentMouseEvent, dropHintDiv, triggeredByMouseMove);
    };

    this.shiftRelevantItems = function (listDiv, itemsArr, currentIndex, prevIndex, origHIntIndex, hintHeight, dropHintDiv) {
        return shiftRelevantItems(listDiv, itemsArr, currentIndex, prevIndex, origHIntIndex, hintHeight, dropHintDiv);
    };

    this.prepareEveryoneElseForRelease = function (listDiv, itemsArr, currentDropIndex) {
        prepareEveryoneElseForRelease(listDiv, itemsArr, currentDropIndex);
    };

    this.shiftHintDiv = function (hintDiv) {
        shiftHintDiv(hintDiv);
    };

    this.shiftHintDiv = function (hintDiv) {
        shiftHintDiv(hintDiv);
    };

    this.assignItemAboveHintClass = function (listDiv, itemsArr, dropIndex) {
        assignItemAboveHintClass(listDiv, itemsArr, dropIndex);
    };

    this.clearEarlierDDClasses = function (listDiv) {
        clearItemAboveHintClass(listDiv);
    };

    /** Private Functions **/

    /** DOM Shift **/

    function shiftRelevantItems(listDiv, itemsArr, currentIndex, prevIndex, origHIntIndex, hintHeight, dropHintDiv) {
        let areMovingUp = (currentIndex >= prevIndex);
        let rangeStartIndex;
        let rangeEndIndex;

        if (areMovingUp) {
            rangeStartIndex = prevIndex;
            rangeEndIndex = currentIndex - 1;
        } else {
            rangeStartIndex = currentIndex + 1;
            rangeEndIndex = prevIndex;
        }
        shiftItemsByIndexRange(itemsArr, rangeStartIndex, rangeEndIndex, origHIntIndex, areMovingUp, hintHeight);
    }

    function shiftItemsByIndexRange(itemsArr, startIndex, endIndex, origHIntIndex, areMovingUp, hintHeight) {
        let item;
        for (let i = startIndex; i <= endIndex; i++) {
            item = itemsArr[i];
            shiftItemByIndex(item, i, origHIntIndex, areMovingUp, hintHeight);
        }
    }

    function shiftItemByIndex(item, index, origHIntIndex, isMovingUp, hintHeight) {
        let wasOriginallyAbove = (index < origHIntIndex) || (!isMovingUp && (index === origHIntIndex));
        if (isMovingUp) {
            if (wasOriginallyAbove) {
                shiftItem(item, 0);
            } else {
                shiftItem(item, -hintHeight);
            }
        } else { //Moving down
            if (wasOriginallyAbove) {
                shiftItem(item, hintHeight);
            } else {
                shiftItem(item, 0);
            }
        }

    }

    function shiftItem(item, yShift) {
        item.jjQuickTransform(0, yShift);
    }

    function shiftHintDiv(hintDiv) {
        let yShift = hintDiv.jjTop - hintDiv.origJJTop;
        hintDiv.jjQuickTransform(0, yShift);
    }

    function prepareEveryoneElseForRelease(listDiv, itemsArr, currentDropIndex) {
        let shiftItems = [];
        let item;
        for (let i = 0; i < itemsArr.length; i++) {
            item = itemsArr[i];
            if (item.bcDelta && i !== currentDropIndex) {
                shiftItems.push(item);
            }
        }
        if (shiftItems.length > 0) {
            for (let shiftItem of shiftItems) {
                adjustItemTransitionForReleaseAnimation(shiftItem)
            }
            listDiv.jjForceStyleRecalc();
            for (let shiftItem of shiftItems) {
                shiftItem.style.transition = null;
                shiftItem.jjQuickTransform(0, 0);
            }
        }
    }

    function adjustItemTransitionForReleaseAnimation(item) {
        item.jjQuickTransform(0, item.bcDelta)
    }

    /** Mouse Stuff **/
    function getIsMouseStillOnSamePositionRelativeToShiftItem(shiftItem, currentMouseEvent, dropHintDiv, triggeredByMouseMove) {
        if (shiftItem) {
            let shiftItemHeight = shiftItem.jjFullHeight;
            let shiftItemTop = shiftItem.jjTop;
            let isMouseStillInsideSameItem = getIsInside(currentMouseEvent.clientY, shiftItemHeight, shiftItemTop);
            if (isMouseStillInsideSameItem) {
                if (!triggeredByMouseMove) {
                    return true;
                }
                let isDropTargetAboveShiftItem = (dropHintDiv.jjTop < shiftItemTop);
                let mousePosition = getMousePositionInThirds(currentMouseEvent.clientY, shiftItemHeight, shiftItemTop);
                let mouseOnTopAndTargetAbove = (mousePosition !== POSITIONS.bottomThird && isDropTargetAboveShiftItem);
                let mouseOnBottomAndTargetBelow = (mousePosition !== POSITIONS.topThird && !isDropTargetAboveShiftItem);
                if (mouseOnTopAndTargetAbove || mouseOnBottomAndTargetBelow) {
                    return true;
                }
            }
        }
        return false;
    }

    function getMousePositionInThirds(y, itemHeight, itemTop) {
        if (y < itemTop + itemHeight * 0.33) {
            return POSITIONS.topThird;
        } else if (y > itemTop + itemHeight * 0.67) {
            return POSITIONS.bottomThird;
        } else {
            return POSITIONS.middleThird
        }
    }

    function getIsInside(y, itemHeight, itemTop) {
        return (y >= itemTop && (y < itemTop + itemHeight));
    }

    /** Class Assignments **/
    function clearItemAboveHintClass(listDiv) {
        let itemAboveHintArray = listDiv.jjQueryAll('.draggableItemAboveHint');
        for (let itemAboveHint of itemAboveHintArray) {
            itemAboveHint.jjRemoveClass('draggableItemAboveHint');
        }
    }

    function assignItemAboveHintClass(listDiv, itemsArr, dropIndex) {
        clearItemAboveHintClass(listDiv);
        let itemAboveHint = itemsArr[dropIndex - 1];
        if (itemAboveHint) {
            itemAboveHint.jjAddClass('draggableItemAboveHint');
        }
    }

}

SportyListDnDInteractionUtil.POSITIONS = {
    topThird: 0,
    middleThird: 1,
    bottomThird: 2
};

SportyListDnDInteractionUtil.getInstance = function () {
    if (!SportyListDnDInteractionUtil.instance) {
        SportyListDnDInteractionUtil.instance = new SportyListDnDInteractionUtil();
    }
    return SportyListDnDInteractionUtil.instance;
};