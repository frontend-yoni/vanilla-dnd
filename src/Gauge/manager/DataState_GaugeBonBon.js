function DataState_GaugeBonBon() {
    this.gradientUnit;
    this.sliceCount;
    this.tinyLastSliceSize;
    this.realGradientUnit;

    this.updateState = function (finalValue) {
        this.realGradientUnit = 1 / (6 * finalValue);
        this.gradientUnit = Math.min(1, this.realGradientUnit);
        this.sliceCount = Math.ceil(6 * finalValue);
        this.tinyLastSliceSize = 1 - (this.sliceCount - 6 * finalValue);
    }
}