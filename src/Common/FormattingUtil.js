/**
 * Created by yavitzur on 04/04/2017.
 */

//Don't look, it's awful
function FormattingUtil() {
    let jjLang = window.JJLanguages ? window.JJLanguages.getInstance() : {};

    function isReasonable(num) {
        let isNotBroken = isFinite(num);
        let isWeird = !isNotBroken || (num.toString().indexOf('e') >= 0);
        return isNotBroken && !isWeird;
    }

    /** CONST **/
    const SIZE_INDICATOR_SUFFIXES = {
        1000: '',
        1000000: 'K',
        1000000000: 'M',
        1000000000000: 'B',
        1000000000000000: 'T',
        1000000000000000000: 'S'
    };

    this.formatNiceNumber = function (num, doNotTrimZeroZeroDecimal) {
        var DECIMAL_SEPARATOR = jjLang.getJson('d3Locale')['decimal'];
        let niceNumString;
        if (isReasonable(num)) { //Check if NaN or some other weird case
            niceNumString = formatTo4Chars(num);
            let niceNum = +(niceNumString.replace(/K|M|B|T|S/g, '').replace(DECIMAL_SEPARATOR, '.'));
            let floorNum = Math.floor(niceNum);
            if (!doNotTrimZeroZeroDecimal && niceNum == floorNum) {
                let suffix = niceNumString[niceNumString.length - 1];
                niceNumString = floorNum.toString();
                if (!isReasonable(+suffix)) {
                    niceNumString = niceNumString + suffix;
                }
            }
        }
        else {
            niceNumString = 'N/A';
        }
        return niceNumString;
    };

    this.formatSuperTinyNum = function (num, decimalCount = 5) {
        let niceNum;
        if (isReasonable(num)) { //Check if NaN or some other weird case
            niceNum = formatToXChars(num, decimalCount + 1);
        }
        else {
            niceNum = 'N/A';
        }
        return niceNum;
    };

    //Multiply factor to get to x digits (used to make numbers nicer)
    function multiplierToBulkUpToXDigits(num, digitsCount) {
        var bulkDigits = 0;
        var retNum = num;
        var numOfDigits = getNumberOfDigits(retNum);
        while (numOfDigits < digitsCount && numOfDigits != Infinity) {
            retNum *= 10;
            bulkDigits++;
            numOfDigits = getNumberOfDigits(retNum);
        }
        return Math.pow(10, bulkDigits);
    }

    //Multiply factor to get to x digits (used to make numbers nicer)
    function multiplierToSlimDownToXDigits(num, digitsCount) {
        var bulkDigits = 0;
        var retNum = num;
        var numOfDigits = getNumberOfDigits(retNum);
        while (numOfDigits > digitsCount && numOfDigits != Infinity) {
            retNum /= 10;
            bulkDigits++;
            numOfDigits = getNumberOfDigits(retNum);
        }
        return Math.pow(10, bulkDigits);
    }

    function buildNumFirstDigits(d1, d2, d3) {
        return d1 * 100 + d2 * 10 + d3;
    }

    //Return 0 for fractions smaller than 1
    function getNumberOfDigits(num) {
        if (num < 1) {
            return 0;
        }
        var counter = 1;
        var absNum = Math.abs(num);
        while (absNum / 10 >= 1 && absNum != Infinity) {
            absNum = absNum / 10;
            counter++;
        }
        return counter;
    }

    function formatToXChars(numInput, digitsCount) {
        var DECIMAL_SEPARATOR = jjLang.getJson('d3Locale')['decimal'];
        var iMath = Math;

        if (numInput == 0) {
            return '0';
        }
        //In case there won't be decimal digits, we can round the num
        let roundAndAbsolute = iMath.round(iMath.abs(numInput));
        if (roundAndAbsolute >= iMath.pow(10, digitsCount)) {
            numInput = iMath.round(numInput);
            var currentDigitCount = getNumberOfDigits(roundAndAbsolute);
            var digitsToDiscard = currentDigitCount - digitsCount;
            var discardMultiplier = iMath.pow(10, digitsToDiscard);

            numInput = Math.round(numInput / discardMultiplier) * discardMultiplier;
        }

        var retString = '';
        var isNegative = (numInput < 0);
        var absoluteNum = iMath.abs(numInput);
        var originalAbsoluteNum = absoluteNum;
        var originalDigitCount = digitsCount;

        var bulkOrSlimMultiplier;
        var isBulkedUp;
        var firstNumWithMoreThanXDigits;
        var cleanRoundNumber;

        //in case there's lots of zeros on the left, we need to disregard them
        if (absoluteNum < 1) {
            var tempNum = absoluteNum;
            while (tempNum < 1 && tempNum != Infinity) {
                tempNum *= 10;
                digitsCount--;
            }
            if (digitsCount <= 0) {
                return '0';
            }
        }

        firstNumWithMoreThanXDigits = iMath.pow(10, digitsCount);
        if (absoluteNum < firstNumWithMoreThanXDigits) { //for small numbers, bulk up to x digits
            isBulkedUp = true;
            bulkOrSlimMultiplier = multiplierToBulkUpToXDigits(absoluteNum, digitsCount);
            absoluteNum *= bulkOrSlimMultiplier; //bulk up/down to deal with decimal digits too, must trim back in the end
        } else {  //for big numbers, slim down to x digits
            isBulkedUp = false;
            bulkOrSlimMultiplier = multiplierToSlimDownToXDigits(absoluteNum, digitsCount);
            absoluteNum /= bulkOrSlimMultiplier; //bulk up/down to deal with decimal digits too, must trim back in the end
        }
        absoluteNum = iMath.round(absoluteNum);

        if (absoluteNum == firstNumWithMoreThanXDigits) {  //Edge case where we round up to exactly 1000 or 1000000
            absoluteNum /= 10;
            bulkOrSlimMultiplier /= 10;
        }

        var digitsArray = getDigitsArray(absoluteNum, digitsCount);
        if (isBulkedUp) {
            cleanRoundNumber = absoluteNum / bulkOrSlimMultiplier;
        } else {
            cleanRoundNumber = absoluteNum * bulkOrSlimMultiplier;
        }


        if (originalAbsoluteNum < 1) {
            var leftZeros = [];
            while (cleanRoundNumber < 0.1 && cleanRoundNumber != Infinity) {
                cleanRoundNumber *= 10;
                leftZeros.push('0');
            }
            var actualDigits = leftZeros.concat(digitsArray);
            retString = '0' + DECIMAL_SEPARATOR;

            while (actualDigits.length < originalDigitCount) {
                actualDigits.push('0');
            }

            for (var i = 0; i < originalDigitCount - 1; i++) {
                retString += actualDigits[i];
            }
        } else {
            var magnitude = getCorrespondingMagnitude(cleanRoundNumber);
            var decimalPointPosition = getNumberOfDigitsBeforeDecimalPoint(cleanRoundNumber, magnitude) - 1;
            for (var i = 0; i < originalDigitCount; i++) {
                retString += digitsArray[i];
                if (i == decimalPointPosition && i < originalDigitCount - 1) {
                    retString += DECIMAL_SEPARATOR;
                }
            }
            retString += SIZE_INDICATOR_SUFFIXES[magnitude];
        }

        if (isNegative) {
            retString = '-' + retString;
        }

        return retString;
    }

    function getNumberOfDigitsBeforeDecimalPoint(cleanRoundNumber, magnitude) {
        var trimmedMagnitude = magnitude / 1000;
        var slimmedNum = cleanRoundNumber / trimmedMagnitude;
        var retNumOfDigits = getNumberOfDigits(slimmedNum);
        return retNumOfDigits;
    }

    function getCorrespondingMagnitude(cleanRoundNumber) {
        var orderOfMagnitudes = Object.keys(SIZE_INDICATOR_SUFFIXES);
        var magnitude;
        for (var i = 0; i < orderOfMagnitudes.length; i++) {
            magnitude = +orderOfMagnitudes[i];
            if (magnitude > cleanRoundNumber) {
                return magnitude;
            }
        }
        return orderOfMagnitudes.length - 1; //the fallback is the biggest magnitude
    }

    function getDigitsArray(num, numOfDigits) {
        var retArray = [];
        var currentDigit;
        for (var i = 0; i < numOfDigits; i++) {
            currentDigit = Math.floor(num / Math.pow(10, numOfDigits - 1 - i)) % 10;
            retArray.push(currentDigit);
        }
        return retArray;
    }

    function formatTo4Chars(numInput) {
        return formatToXChars(numInput, 3);
    }

    function formatTo7Chars(numInput) {
        return formatToXChars(numInput, 6);
    }
}