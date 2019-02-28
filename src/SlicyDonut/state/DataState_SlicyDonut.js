function DataState_SlicyDonut() {
    let me = this;
    this.SLICE_COUNT = 5;
    /** Original **/
    this.origDataObj;

    /** Processed **/
    this.origSum;
    this.origValrr = [];
    this.valueArr = [];
    this.aggrArr = [];

    /** Public APIs **/
    this.setOrigData = function (dataObj) {
        this.origDataObj = dataObj;
        this.origValArr = dataObj;
        processData(this.origValArr);
        calculateAggrArr();
    };

    /** Private Functions **/
    function calculateAggrArr() {
        me.aggrArr = [];
        let aggrVal = 0;
        for (let val of me.valueArr) {
            me.aggrArr.push(aggrVal);
            aggrVal += val;
        }
    }

    function processData(dataArr) {
        me.origSum = dataArr.reduce((a, b) => a + b, 0); //Yakky sum function
        me.valueArr = [];
        for (let data of dataArr) {
            me.valueArr.push(data / me.origSum);
        }
    }
}