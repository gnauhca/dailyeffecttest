const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

require('./index.scss');

console.log(Snap);


var s = Snap(1000, 1000);

var sElems = {};

sElems.circle0 = s.circle(0, 0, 200);
sElems.circle0.attr({
    'stroke': "#495b89",
    'strokeWidth': 1,
    'fill': 'none'
});

sElems.arc0 = s.circle(0, 0, 204);
sElems.arc0.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 8,
    'fill': 'none',
    'stroke-dasharray': '220 430'
    // 'stroke-dasharray': '0 ' + Math.PI * 2 * 204
});


sElems.dashCircle0 = s.circle(0, 0, 193);
sElems.dashCircle0.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 5'
});

Snap.animate([100, 400], [1, 5], function(v) {
    sElems.dashCircle0.attr({
        'stroke-dasharray': v.join(' '),
        'stroke-dashoffset': v[0] + v[1]
    });
}, 1000, '', mina.bounce);




////////////


sElems.circle2 = s.circle(0, 0, 250);
sElems.circle2.attr({
    'stroke': "#495b89",
    'strokeWidth': 1,
    'fill': 'none'
});

sElems.dashCircle2 = s.circle(0, 0, 241);
sElems.dashCircle2.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 8,
    'fill': 'none',
    'stroke-dasharray': '1 10'
});


////////////


sElems.circle3 = s.circle(0, 0, 100);
sElems.circle3.attr({
    'stroke': "#bb216a",
    'strokeWidth': 1,
    'fill': 'none'
});

sElems.arc3 = s.circle(0, 0, 102);
sElems.arc3.attr({
    'stroke': "#bb216a",
    'strokeWidth': 5,
    'fill': 'none',
    'stroke-dasharray': '150 160'
});


////////////
sElems.dashCircle4 = s.circle(0, 0, 81);
sElems.dashCircle4.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 5'
});


////////////
sElems.circle5 = s.circle(0, 0, 60);
sElems.circle5.attr({
    'stroke': "#9293b1",
    'strokeWidth': 2,
    'fill': 'none'
});


////////////
sElems.dashCircle6 = s.circle(0, 0, 51);
sElems.dashCircle6.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 6'
});


///////////
sElems.dashCircle7 = s.circle(0, 0, 41);
sElems.dashCircle7.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 8'
});


///////////
sElems.circle8 = s.circle(0, 0, 18);
sElems.circle8.attr({
    'stroke': "none",
    'fill': '#788ebd'
});




var group = s.group();

for(var key in sElems) {
    group.append(sElems[key]);
    var x = key.match(/\d$/)[0];
    sElems[key].attr({
        'transform': 'translate('+ x*50 +' '+ x*30 +')'
    });
}

Snap.animate(0, 100000, function(r) {
    for(var key in sElems) {
        var x = key.match(/\d$/)[0];
        var sign = x % 2? 1: -1;

        sElems[key].attr({
            'transform': 'translate('+ x*50 +' '+ x*30 +') rotate('+sign * r+')'
        });
    }  
}, 10000000);

group.attr({
    'transform': 'translate(500 600) scale(2)'
});

group.animate({
    'transform': 'translate(500 500) skewX(-30)'
}, 4000);