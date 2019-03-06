/**
 * Created by yavitzur on 23/01/2017.
 */

/**
 * Enhance your Element object with JJPower! Super efficient technique for DOM orchestration.
 * ***/

function JJPower() {
    JJPower.easeArray = [0, 0.0012, 0.0024, 0.0037, 0.0051, 0.0065, 0.0081, 0.0097, 0.0114, 0.0132, 0.015, 0.017, 0.019, 0.0211, 0.0234, 0.0257, 0.028, 0.0305, 0.0331, 0.0357, 0.0385, 0.0413, 0.0443, 0.0473, 0.0504, 0.0536, 0.0569, 0.0603, 0.0638, 0.0674, 0.0711, 0.0749, 0.0788, 0.0827, 0.0868, 0.091, 0.0952, 0.0996, 0.104, 0.1085, 0.1131, 0.1179, 0.1226, 0.1275, 0.1325, 0.1375, 0.1426, 0.1479, 0.1531, 0.1585, 0.1639, 0.1694, 0.175, 0.1806, 0.1863, 0.1921, 0.1979, 0.2038, 0.2097, 0.2157, 0.2217, 0.2277, 0.2339, 0.24, 0.2462, 0.2524, 0.2586, 0.2649, 0.2712, 0.2775, 0.2838, 0.2902, 0.2965, 0.3029, 0.3092, 0.3156, 0.322, 0.3284, 0.3347, 0.3411, 0.3474, 0.3538, 0.3601, 0.3664, 0.3727, 0.379, 0.3853, 0.3915, 0.3977, 0.4039, 0.41, 0.4162, 0.4223, 0.4283, 0.4344, 0.4404, 0.4463, 0.4523, 0.4582, 0.464, 0.4698, 0.4756, 0.4814, 0.4871, 0.4927, 0.4984, 0.5039, 0.5095, 0.515, 0.5204, 0.5258, 0.5312, 0.5365, 0.5418, 0.547, 0.5522, 0.5574, 0.5625, 0.5675, 0.5725, 0.5775, 0.5824, 0.5873, 0.5922, 0.597, 0.6017, 0.6064, 0.6111, 0.6157, 0.6203, 0.6249, 0.6294, 0.6338, 0.6382, 0.6426, 0.6469, 0.6512, 0.6555, 0.6597, 0.6639, 0.668, 0.6721, 0.6761, 0.6802, 0.6841, 0.6881, 0.692, 0.6958, 0.6996, 0.7034, 0.7072, 0.7109, 0.7146, 0.7182, 0.7218, 0.7254, 0.7289, 0.7324, 0.7358, 0.7393, 0.7427, 0.746, 0.7493, 0.7526, 0.7559, 0.7591, 0.7623, 0.7655, 0.7686, 0.7717, 0.7748, 0.7778, 0.7808, 0.7838, 0.7867, 0.7896, 0.7925, 0.7954, 0.7982, 0.801, 0.8038, 0.8065, 0.8092, 0.8119, 0.8146, 0.8172, 0.8198, 0.8224, 0.8249, 0.8275, 0.83, 0.8324, 0.8349, 0.8373, 0.8397, 0.8421, 0.8444, 0.8467, 0.849, 0.8513, 0.8535, 0.8558, 0.8579, 0.8601, 0.8623, 0.8644, 0.8665, 0.8686, 0.8707, 0.8727, 0.8747, 0.8767, 0.8787, 0.8806, 0.8826, 0.8845, 0.8864, 0.8882, 0.8901, 0.8919, 0.8937, 0.8955, 0.8973, 0.899, 0.9007, 0.9024, 0.9041, 0.9058, 0.9074, 0.9091, 0.9107, 0.9123, 0.9138, 0.9154, 0.9169, 0.9184, 0.9199, 0.9214, 0.9229, 0.9243, 0.9258, 0.9272, 0.9286, 0.93, 0.9313, 0.9327, 0.934, 0.9353, 0.9366, 0.9379, 0.9391, 0.9404, 0.9416, 0.9428, 0.944, 0.9452, 0.9464, 0.9475, 0.9487, 0.9498, 0.9509, 0.952, 0.9531, 0.9541, 0.9552, 0.9562, 0.9572, 0.9582, 0.9592, 0.9602, 0.9612, 0.9621, 0.9631, 0.964, 0.9649, 0.9658, 0.9667, 0.9675, 0.9684, 0.9692, 0.9701, 0.9709, 0.9717, 0.9725, 0.9732, 0.974, 0.9747, 0.9755, 0.9762, 0.9769, 0.9776, 0.9783, 0.979, 0.9796, 0.9803, 0.9809, 0.9816, 0.9822, 0.9828, 0.9834, 0.984, 0.9845, 0.9851, 0.9856, 0.9862, 0.9867, 0.9872, 0.9877, 0.9882, 0.9887, 0.9891, 0.9896, 0.9901, 0.9905, 0.9909, 0.9913, 0.9917, 0.9921, 0.9925, 0.9929, 0.9933, 0.9936, 0.994, 0.9943, 0.9946, 0.9949, 0.9952, 0.9955, 0.9958, 0.9961, 0.9963, 0.9966, 0.9968, 0.9971, 0.9973, 0.9975, 0.9977, 0.9979, 0.9981, 0.9983, 0.9985, 0.9986, 0.9988, 0.9989, 0.999, 0.9992, 0.9993, 0.9994, 0.9995, 0.9996, 0.9997, 0.9997, 0.9998, 0.9998, 0.9999, 0.9999, 1, 1, 1, 1];
    JJPower.isMobile = false;

    /** Prep Static Functions **/
    JJPower.enhance = function (element) {
        if (element) {
            Object.assign(element, JJPower.prototype);
        }
        return element;
    };

    JJPower.query = function () {
        const queryText = getGeneratedQueryText(...arguments);

        const element = document.querySelector(queryText);

        JJPower.enhance(element);
        return element;
    };

    JJPower.jjCreateElement = function (tagName) {
        var element;
        if (tagName.toUpperCase() == 'SVG') {
            element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        } else {
            element = document.createElement(tagName);
        }
        return JJPower.enhance(element);
    };

    JJPower.jjAnimateForever = function (frameFunc) {
        let animationObj = { id: -1, isRunning: true };
        repeatMe();
        return animationObj;

        /* Inner Function */
        function repeatMe(frameTime = 0) {
            if (!animationObj.isRunning) { //Sorry, hate returning in the middle of function, but really have to
                return;
            }
            frameFunc(frameTime);
            animationObj.id = requestAnimationFrame(repeatMe);
        }
    };

    JJPower.jjStopAnimatingForever = function (animationObj = {}) {
        animationObj.isRunning = false;
        cancelAnimationFrame(animationObj.id);
    };

    /** *Commonly used****/
    JJPower.prototype.jjWidth = function () {
        return this.getBoundingClientRect().width;
    };

    JJPower.prototype.jjAppend = function (tagName) {
        const me = this;
        let child;
        if (isSVGElement(tagName)) {
            child = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        } else {
            child = document.createElement(tagName);
        }
        JJPower.enhance(child);

        this.appendChild(child);
        return child;


        // Inner functions
        // Either the tag itself is SVG, or it's parent (this) is an SVG element
        function isSVGElement(tagName) {
            const isIt = (tagName.toUpperCase() == 'SVG' || (me instanceof SVGElement));
            return isIt;
        }
    };

    JJPower.prototype.jjQuery = function () {
        const queryText = getGeneratedQueryText(...arguments);

        const element = this.querySelector(queryText);
        JJPower.enhance(element);
        return element;
    };

    JJPower.prototype.jjQueryAll = function () {
        const queryText = getGeneratedQueryText(...arguments);

        let elements = this.querySelectorAll(queryText);
        elements = Array.from(elements);
        elements.forEach(JJPower.enhance);
        return elements;
    };

    JJPower.prototype.jjGetChildren = function () {
        let elements = this.children || this.childNodes;
        elements = Array.from(elements);
        elements.forEach(JJPower.enhance);
        return elements;
    };

    JJPower.prototype.jjStyle = function (styleMap) {
        const keys = Object.keys(styleMap);
        for (const key of keys) {
            this.style[key] = styleMap[key];
        }
        return this;
    };

    JJPower.prototype.jjAttr = function (attrMap) {
        const keys = Object.keys(attrMap);
        let val;
        for (const key of keys) {
            val = attrMap[key];
            this.setAttribute(key, attrMap[key]);
            if (val === undefined) {
                this.removeAttribute(key);
            }
        }
        return this;
    };

    JJPower.prototype.jjAddEventListener = function (eventName, callBack, capture, options = {}) {
        let mobileEvent = getMobileEventName(eventName, this);
        let fullOptions = Object.assign({capture}, options);
        if (mobileEvent) {
            this.addEventListener(mobileEvent, callBack, fullOptions);
        }
        this.addEventListener(eventName, callBack, fullOptions);

        return this;
    };

    JJPower.prototype.jjRemoveEventListener = function (eventName, callBack, capture) {
        let mobileEvent = getMobileEventName(eventName, this);
        if (mobileEvent) {
            this.removeEventListener(mobileEvent, callBack, {capture});
        }
        this.removeEventListener(eventName, callBack, {capture});

        return this;
    };

    JJPower.prototype.jjAddClass = function () {
        try { // If the user gives bad dataList (eg. empty string) don't overreact, stay cool
            const styleModuleObject = arguments[0];
            if (typeof styleModuleObject === 'string') { // This means we're in sandbox
                this.classList.add(...arguments);
            } else { // this means we're using css modules
                let className;
                for (let i = 1; i < arguments.length; i++) {
                    className = arguments[i];
                    this.classList.add(styleModuleObject[className]);
                }
            }
        } catch (e) {
        }

        return this;
    };

    JJPower.prototype.jjRemoveClass = function () {
        const styleModuleObject = arguments[0];
        if (typeof styleModuleObject === 'string') { // This means we're in sandbox
            this.classList.remove(...arguments);
        } else { // this means we're using css modules
            let className;
            for (let i = 1; i < arguments.length; i++) {
                className = arguments[i];
                this.classList.remove(styleModuleObject[className]);
            }
        }

        return this;
    };

    JJPower.prototype.jjToggleClass = function () {
        const styleModuleObject = arguments[0];
        let hasStyleModuleObject = false;
        let startIndex = 0;
        let className;
        if (typeof styleModuleObject !== 'string') { // this means we're using css modules
            hasStyleModuleObject = true;
            startIndex = 1;
        }

        for (let i = startIndex; i < arguments.length; i++) {
            className = (hasStyleModuleObject ? styleModuleObject[arguments[i]] : arguments[i]);
            if (this.classList.contains(className)) {
                this.classList.remove(className);
            } else {
                this.classList.add(className);
            }
        }

        return this;
    };

    JJPower.prototype.jjContainsClass = function () {
        let className = getGeneratedClassName(...arguments);
        let classList = this.classList;
        return classList.contains(className);
    };


    JJPower.prototype.jjClear = function () {
        while (this.firstChild) { // If the user gives bad dataList (eg. empty string) don't overreact, stay cool
            this.removeChild(this.firstChild);
        }
        return this;
    };

    JJPower.prototype.jjRemoveMe = function () {
        let parentNode = this.parentNode;
        if (parentNode) {
            parentNode.removeChild(this);
        }
    };

    JJPower.prototype.jjText = function (textContent) {
        this.textContent = textContent;
        return this;
    };

    JJPower.prototype.jjAddText = function (textContent) {
        let textNode = document.createTextNode(textContent);
        this.appendChild(textNode);
        return this;
    };

    JJPower.prototype.jjAddBoldText = function (textContent) {
        this.jjAppend('b')
            .jjText(textContent);
        return this;
    };

    JJPower.prototype.jjAddTextBreak = function () {
        this.jjAppend('br');
        return this;
    };

    JJPower.prototype.jjClone = function (isDeep) {
        const element = this.cloneNode(isDeep);
        JJPower.enhance(element);
        return element;
    };

    JJPower.prototype.jjSetData = function (dataObject) {
        this.__data__ = dataObject;
        return this;
    };

    JJPower.prototype.jjGetData = function () {
        return this.__data__;
    };

    JJPower.prototype.jjSetIndex = function (index) {
        this.setAttribute('jjIndex', index);
        return this;
    };

    JJPower.prototype.jjGetIndex = function () {
        return +this.getAttribute('jjIndex');
    };

    //Returns null if no papa found
    JJPower.prototype.jjGetClosestPapaWithClass = function () {
        const className = getGeneratedClassName(...arguments);
        let bingoPapa = this.closest('.' + className);
        return JJPower.enhance(bingoPapa);
    };

    //Returns null if no papa found
    JJPower.prototype.jjClosest = function () {
        const selectorStr = getGeneratedQueryText(...arguments);
        let bingoPapa = this.closest(selectorStr);
        return JJPower.enhance(bingoPapa);
    };

    JJPower.prototype.jjIsAncestor = function (ancestor) {
        let papa = this;
        while (papa && (papa !== ancestor)) {
            papa = papa.parentNode;
        }
        return papa;
    };


    JJPower.prototype.jjGetStylePixelNumberValue = function (styleName) {
        let strOrig = this.style[styleName];
        let numStr = strOrig.replace('px', '');
        return +numStr;
    };

    /** Measurements Calculations **/
    //This is expensive! Uses getBoundingClientRect
    JJPower.prototype.jjMouseCoordinatesRelativeToMe = function (event) {
        let clientRect = this.getBoundingClientRect();
        let x = event.clientX - clientRect.left;
        let y = event.clientY - clientRect.top;

        return {
            x: x,
            y: y,
            rect: clientRect
        }
    };

    /** Inline Style **/
    JJPower.prototype.jjQuickTransform = function (x, y, deg) {
        if (deg) {
            this.style.transform = `translate(${x}px, ${y}px) rotate(${deg}deg)`
        } else {
            this.style.transform = `translate(${x}px, ${y}px)`
        }

        this.jjTotallyUnreliableY = y; //Ugly workaround for specific issue
        this.jjTotallyUnreliableX = x; //Ugly workaround for specific issue
    };

    JJPower.prototype.jjApplyTransform = function (x = 0, y = 0, rotation, rotateFirst, translateUnit = 'px') {
        let hasTranslate = (x != 0 || y != 0);

        let transformStr = '';
        let isSVG = this instanceof SVGElement;

        let translateStr = '';
        let rotateStr = '';

        if (hasTranslate) {
            translateStr = getTranslateStr();
        }
        if (rotation) {
            rotateStr = getRotateStr();
        }

        if (rotateFirst) {
            transformStr = rotateStr + ' ' + translateStr;
        } else {
            transformStr = translateStr + ' ' + rotateStr;
        }
        transformStr.trim();


        if (isSVG) {
            this.setAttribute('transform', transformStr);
        } else {
            this.style.transform = transformStr;
        }

        this.jjTotallyUnreliableY = y; //Ugly workaround for specific issue
        this.jjTotallyUnreliableX = x; //Ugly workaround for specific issue

        return this;

        //Inner functions
        function getTranslateStr() {
            let translateStr;
            if (isSVG) {
                translateStr = `translate(${x}, ${y})`;
            } else {
                translateStr = `translate(${x}${translateUnit}, ${y}${translateUnit})`;
            }
            return translateStr;
        }

        function getRotateStr() {
            let rotateStr;
            if (isSVG) {
                rotateStr = `rotate(${rotation})`;
            } else {
                rotateStr = `rotate(${rotation}deg)`;
            }
            return rotateStr;
        }
    };

    /** Animation **/
    JJPower.prototype.jjAnimate = function (frameFunction, animationDuration, endFunction, isLinear, timingArr) { // Frame function runs each frame, and takes the current progress param!
        let me = this;
        timingArr = timingArr || JJPower.easeArray;
        let timingLen = timingArr.length - 1;
        const startTime = performance.now();
        isLinear = isLinear || animationDuration > 4000;

        let id = requestAnimationFrame(repeatAnimation);

        if (!me.animationList) {
            me.animationList = [];
        }
        let animationObj = { t: 0, id: id, isRunning: true };
        me.animationList.push(animationObj);

        return animationObj;

        /* Inner Functions */
        function repeatAnimation(nowTime) {
            if (!animationObj.isRunning) { //Sorry, hate returning in the middle of function, but really have to
                return;
            }

            let progressTime = getProgressTime(nowTime, startTime);

            let t = progressTime / animationDuration;
            if (!isLinear) {
                t = JJPower.easeInTiming(t, timingArr, timingLen);
            }

            frameFunction(t, me);

            if (progressTime < animationDuration) {
                id = requestAnimationFrame(repeatAnimation);
            } else if (endFunction) {
                endFunction(me);
            }

            animationObj.t = t;
            animationObj.id = id;
        }

        function getProgressTime(nowTime, startTime) {
            let prog = nowTime - startTime;
            prog = Math.max(0, prog);
            prog = Math.min(animationDuration, prog);
            return prog;
        }
    };

    JJPower.easeInTiming = function (t, timingArr, timingLen) {
        let real = t * timingLen;
        let base = Math.floor(real);
        let next = Math.ceil(real);
        let retT = getValueByProgress(timingArr[base], timingArr[next], real - base);
        return retT;

        /* Inner Function */
        function getValueByProgress(startValue, endValue, t) {
            return startValue + (endValue - startValue) * t;
        }
    };

    JJPower.prototype.jjStopAnimation = function () {
        let me = this;
        if (me.animationList) {
            for (let animationObj of me.animationList) {
                animationObj.isRunning = false;
                cancelAnimationFrame(animationObj.id);
            }
        }
        return me;
    };

    /** *Awful but necessary *****/
    // Used to time css animations. We need to assign the animation start state, then reflow so it will be set, and then assign the end state
    JJPower.prototype.jjForceStyleRecalc = function () {
        let computedStyle = window.getComputedStyle(this);
        return computedStyle.transform;
    };

    /******* Private Functions ******/

    /** Mobile **/
    function getMobileEventName(origEventName, element) {
        if (element == document && origEventName == 'click') {
            return 'touchstart';
        }

        switch (origEventName) {
            case 'mousedown':
                return 'touchstart';
            case 'mousemove':
                return 'touchmove';
            case 'mouseup':
                return 'touchend';
            case 'mouseenter':
                return '';
            case 'mouseleave':
                return '';
            case 'mouseover':
                return '';
            case 'mouseout':
                return '';
            default:
                return origEventName
        }
    }

    function getCorrespondingMobileEvent(origEventName) {

    }

    /** CSS Modules **/
    function getGeneratedClassName() {
        let className;
        const param1 = arguments[0];
        const param2 = arguments[1];

        if (!param2) { // This means we received only a string representing the selector
            className = param1;
        } else { // this means we're using css modules, and also received the styles object
            className = param2;
            const stylesObject = param1;
            className = stylesObject[className] || param2;
        }

        return className;
    };

    function getGeneratedQueryText() {
        let queryText;
        const param1 = arguments[0];
        const param2 = arguments[1];
        const stylesObject = param1;

        if (!param2) { // This means we received only a string representing the selector
            queryText = param1;
        } else { // this means we're using css modules, and also received the styles object
            queryText = param2;
            queryText = queryText.replace(/(\.[a-zA-Z0-9]+)/g, replaceFunction);
        }
        return queryText;


        /* Inner Function */
        function getStyleObjectClassSelector(origQueryText) {
            let classSelector = origQueryText.replace('.', '');
            classSelector = stylesObject[classSelector];
            if (!classSelector) {
                classSelector = origQueryText.replace('.', '');
            }
            classSelector = `.${classSelector}`;

            return classSelector;
        }

        function replaceFunction(match, p1) {
            let classSelector = getStyleObjectClassSelector(p1, stylesObject);
            return classSelector;
        }
    };

    /** Finally. Enhance the document (mainly for attaching mobile friendly event listeners) **/
    JJPower.enhance(document);
}

JJPower.getInstance = function () {
    if (!JJPower.instance) {
        JJPower.instance = new JJPower();
    }
    return JJPower.instance;
};

JJPower.getInstance();

