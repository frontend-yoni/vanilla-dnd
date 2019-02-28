function SlicyDonutSandBox() {
    let compCount = 0;
    let MOCK_DATA_1 = [100, 250, 75, 75, 100];
    let MOCK_DATA_2 = [0, 330, 90, 90, 90];
    let VALUE_COUNT = 5;
    let testDiv;
    let plusDiv;

    this.setTestDiv = function (testDivI) {
        testDiv = testDivI;
    };

    this.drawComponent = function () {
        plusDiv = testDiv.jjAppend('PlusDiv')
            .jjAddClass('PlusDiv')
            .jjAddEventListener('click', introduceNewDonut);

        introduceNewDonut();
        introduceNewDonut();
    };


    function introduceNewDonut() {
        let compDiv = testDiv.jjAppend('div')
            .jjAddClass('compDiv');
        
        testDiv.appendChild(plusDiv);
        let comp = new SlicyDonut();

        let data = generateMockValueArray();
        if (compCount == 0) {
            data = MOCK_DATA_1;
        }
        if (compCount == 1) {
            data = MOCK_DATA_2;
        }

        comp.setExternalDiv(compDiv);
        comp.setData(data);
        comp.drawComponent();

        compCount++;
    }

    function generateMockValueArray() {
        let arr = [];
        let val;
        for (let i = 0; i < VALUE_COUNT; i++) {
            val = Math.floor(Math.random() * 300);
            arr.push(val);
        }
        return arr;
    }
}