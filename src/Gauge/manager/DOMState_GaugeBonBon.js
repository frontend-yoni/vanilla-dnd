function DOMState_GaugeBonBon() {
    /** Layout **/
    this.r;
    this.thickness;

    /** Structure **/
    this.path1;
    this.path2;
    this.inBetweenPath;

    /** Setters **/
    this.setRadiusAndThickness = function (r, thickness) {
        this.r = r;
        this.thickness = thickness;
    };

    this.setPaths = function (path1, path2, inBetweenPath) {
        this.path1 = path1;
        this.path2 = path2;
        this.inBetweenPath = inBetweenPath;
    };
}