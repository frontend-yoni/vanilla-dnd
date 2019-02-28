/**
 * Created by yavitzur on 07/02/2017.
 */
class JJGeneralUtils {

    constructor() {
        this.numFormatter = FormattingUtil ? new FormattingUtil() : {};
        this.idCounter = 0;
    }

    /** Public functions **/

    /** DOM **/
    getScrollWidth(divPapa) {
        if (!divPapa) {
            divPapa = JJPower.enhance(document.getElementsByTagName('body')[0]);
        }
        if (JJGeneralUtils.scrollBarWidth === undefined) {
            this._calculateScrollBarWith(divPapa);
        }
        return JJGeneralUtils.scrollBarWidth;
    }

    checkIfMouseInside(div, mouseEvent, bcRect, pad_v = 0, pad_h = 0) {
        if (!bcRect) {
            bcRect = div.getBoundingClientRect();
        }
        let x = mouseEvent.clientX;
        let y = mouseEvent.clientY;
        let inside_h = ((x + pad_h > bcRect.left) && (x - pad_h < bcRect.left + bcRect.width));
        let inside_v = ((y + pad_v > bcRect.top) && (y - pad_v < bcRect.top + bcRect.height));
        return (inside_h && inside_v);
    }

    getClosestPapa(element, bingoSelector, stopScanningSelector) {
        let bingo;
        let stop;
        while (!bingo && !stop && element) {
            bingo = element.matches(bingoSelector);
            stop = element.matches(stopScanningSelector);
            element = element.parentElement;
        }
        return bingo;
    }


    /** String **/
    formatNiceNumber(num, doNotTrimZeroZeroDecimal) {
        num = +num;
        let niceNum = this.numFormatter.formatNiceNumber(num, doNotTrimZeroZeroDecimal);
        if (num > 0 && num < 0.01) {
            niceNum = `0${this.getDecimalSeparator()}01`;
        }
        if (num < 0 && num > -0.01) {
            niceNum = `-0${this.getDecimalSeparator()}01`;
        }
        return niceNum;
    }

    getDecimalSeparator() {
        if (!this.DECIMAL_SEPARATOR) {
            let jjLang = JJLanguages.getInstance();
            this.DECIMAL_SEPARATOR = jjLang.getJson('d3Locale')['decimal'];
        }
        return this.DECIMAL_SEPARATOR;
    }

    formatSuperTinyNum(num, decimalCount) {
        num = +num;
        let niceNum = this.numFormatter.formatSuperTinyNum(num, decimalCount);
        return niceNum;
    }

    replaceAll(origString, oldChar, newChar) {
        return origString.replace(new RegExp(oldChar, 'g'), newChar);
    }

    /** Events **/
    updateXYForTocuchEvent(e) { //In case of touch event, set clientX/Y by e.touches
        if (e.touches) {
            e.clientX = e.touches[0].clientX;
            e.clientY = e.touches[0].clientY;
        }
    }

    /** Style **/
    getNumValOfStyle(element, prop) {
        return +getComputedStyle(element)[prop].replace('px', '') || 0;
    }

    /** Dates **/
    getNowTime() {
        return new Date().getTime();
    }

    shiftXDays(dateObject, shiftCount) {
        const newDateObject = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate() + shiftCount);
        return newDateObject;
    }

    shiftXMonths(dateObject, shiftCount) {
        let day = dateObject.getDate();
        let correctMonth = new Date(dateObject.getFullYear(), dateObject.getMonth() + shiftCount);
        let monthEndDay = new Date(correctMonth.getFullYear(), correctMonth.getMonth() + 1, 0).getDate();
        let correctDay = Math.min(day, monthEndDay);

        let newDateObject = new Date(correctMonth.getFullYear(), correctMonth.getMonth(), correctDay);
        return newDateObject;
    }

    getMonthRange(dateObject) {
        let monthStartDay = new Date(dateObject.getFullYear(), dateObject.getMonth());
        let monthEndDay = new Date(dateObject.getFullYear(), dateObject.getMonth() + 1);
        return [monthStartDay, monthEndDay];
    }

    isSameDay(dateObject1, dateObject2) {
        let isIt;
        if (!dateObject1 || !dateObject2) {
            isIt = false;
        } else {
            isIt = (dateObject1.getDate() == dateObject2.getDate() &&
                dateObject1.getMonth() == dateObject2.getMonth() &&
                dateObject1.getFullYear() == dateObject2.getFullYear());
        }

        return isIt;
    }

    isSameDayMinute(dateObject1, dateObject2) {
        const isIt = (this.isSameDay(dateObject1, dateObject2) &&
            dateObject1.getMinutes() == dateObject2.getMinutes());

        return isIt;
    }

    isValidValue(value) {
        const valueNumber = +value;
        const validValue = (!isNaN(valueNumber) && isFinite(valueNumber));
        return validValue;
    }

    getHourString(dateObject) {
        let hour = dateObject.getHours();
        const minute = dateObject.getMinutes();
        let suffix = 'am';

        if (hour > 12) {
            suffix = 'pm';
            hour -= 12;
        } else if (hour == 12) {
            suffix = 'pm';
        }

        let minuteStr = minute;
        if (minute < 10) {
            minuteStr = `0${minute}`;
        }
        const retStr = `${hour}:${minuteStr} ${suffix}`;

        return retStr;
    }

    /** Array **/
    convertNonNumbersToZeros(array) {
        return array.map(val => {
            if (!isFinite(val)) {
                val = 0;
            }
            return val;
        });
    }

    copyPartOfArray(array, startIndex, entryCount) {
        return array.slice(startIndex, startIndex + entryCount);
    }

    reverseCopyArray(array) {
        let copy = this.copyPartOfArray(array, 0, array.length);
        copy.reverse();
        return copy;
    }

    getValueListFromEntryList(seriesEntryList, valuePropertyName, convertNaNToZero) {
        return seriesEntryList.map(entry => {
            let value = +entry[valuePropertyName];
            if (convertNaNToZero && !this.isValidValue(value)) {
                value = 0;
            }
            return value;
        });
    }

    getMatrixFromObjectList(objectList, innerListPropertyName) {
        let retMatrix = [];
        for (let obj of objectList) {
            retMatrix.push(obj[innerListPropertyName]);
        }
        return retMatrix;
    }

    getValueMatrixFromEntryMatrix(entryMatrix, valuePropertyName, convertNaNToZero) {
        let retMatrix = [];
        let valueList;
        for (let entryList of entryMatrix) {
            valueList = this.getValueListFromEntryList(entryList, valuePropertyName, convertNaNToZero);
            retMatrix.push(valueList);
        }
        return retMatrix;
    }

    relocateToNewIndexInArray(arr, oldIndex, newIndex) {
        let item = arr[oldIndex];
        arr.splice(oldIndex, 1);
        arr.splice(newIndex, 0, item);
    }

    /** Math **/
    random(start, end) {
        const diff = end - start;
        const value = start + Math.floor(Math.random() * (diff + 1));
        return value;
    }

    trimDecimals(num, digits = 2) {
        let mul = Math.pow(10, digits);
        num *= mul;
        num = Math.floor(num / mul);
        return num;
    }

    getValueByProgress(startValue, endValue, t) {
        return startValue + (endValue - startValue) * t;
    }

    getProgressByValue(minValue, maxValue, value) {
        return (value - minValue) / (maxValue - minValue);
    }

    /** Data Generators **/
    generateUniqueID() {
        return this.idCounter++;
    }

    /** Kinda Inheritance **/
    getInstance(component) {
        if (!component.instance) {
            component.instance = new component;
        }
        return component.instance;
    }

    /** External Resources **/
    tryToLoadImage(imageUrl, errorCallBack, callBackParam) {
        let mockImg = JJPower.jjCreateElement('img')
            .jjAttr({
                src: imageUrl
            })
            .jjAddEventListener('error', onError);

        /* Inner Function */
        function onError() {
            errorCallBack(callBackParam);
            mockImg.removeEventListener('error', onError);
        }
    }

    /** Animation **/

    /** Private Functions **/
    _calculateScrollBarWith(divPapa) {
        const junkElement = divPapa.jjAppend('div')
            .jjStyle({
                position: 'fixed',
                width: `${100}px`,
                height: `${100}px`,
                overflow: 'scroll'
            });

        const scrollBarWidth = junkElement.offsetWidth - junkElement.clientWidth;
        JJGeneralUtils.scrollBarWidth = scrollBarWidth;

        divPapa.removeChild(junkElement);
    }
}

JJGeneralUtils.getInstance = function () {
    if (!JJGeneralUtils.instance) {
        JJGeneralUtils.instance = new JJGeneralUtils();
    }
    return JJGeneralUtils.instance;
};
