const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

require('./index.scss');

console.log(Snap);


var s = Snap(500, 500);

var circle = s.circle(0, 0, 100);
circle.attr({
    stroke: "#000",
    strokeWidth: 2,
    fill: 'none',
    'stroke-dasharray':"1,5",
    transform: 'translate(250, 250)'
    
});
Snap.animate(5, 4, function (val) {
    circle.attr({
        'stroke-dashoffset': val * 1000,
        'stroke-dasharray':"1," + val,
        
    });
}, 6000);


circle.animate({
    r: 80,
    'stroke-dasharray':"1,1",
   transform: 'translate(250, 250) skewX(30)',
}, 1000);
circle.transform();