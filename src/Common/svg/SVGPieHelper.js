/**
 * Created by yavitzur on 15/05/2017.
 */
function SVGPieHelper(){
    /** Externally Set **/
    let outerRadius;
    let innerRadius;
    let cx;
    let cy;
    /** Internally Set **/
    let pathUtil = SVGPathUtil.getInstance();

    /** Public Functions **/
    //usually cx=r/2 cy=-r/2
    this.setPieParams = function(cxI, cyI, outerRadiusI, innerRadiusI){
        cx = cxI;
        cy = cyI;
        outerRadius = outerRadiusI;
        innerRadius = innerRadiusI;
    };

    this.getArcPath = function(degStart, degEnd){
        degStart -= Math.PI / 2;
        degEnd -= Math.PI / 2;

        return pathUtil.getSliceText(cx, cy, degStart, degEnd, outerRadius, innerRadius);
    };

    this.getGaugePath = function(degStart, degEnd){
        degStart -= Math.PI / 2;
        degEnd -= Math.PI / 2;

        return pathUtil.getGaugePathText(cx, cy, degStart, degEnd, outerRadius, outerRadius - innerRadius);
    };

    this.getXYOnArc = function(cx, cy, r, deg){
        return pathUtil.getXYOnArc(cx, cy, r, deg);
    };
}