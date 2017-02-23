const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

require('./index.scss');

var s = Snap(1000, 1000);

var safeSvg = {};


// green
var greenGradient = s.gradient('L(0,0,60,0)#7cfcfb-#03f8aa');
safeSvg.greenOutArc0 = s.path('M -231 170 A 287 287 0 1 1 231 170');
safeSvg.greenOutArc0.attr({
    'stroke': greenGradient,
    'stroke-width': 14,
    'stroke-linecap': 'round',
    'fill': 'none',
});
safeSvg.greenOutArc0.sdata = {
    'zIndex': 10
};

// dash1
safeSvg.dash1 = s.path('M -217 171 A 276 276 0 1 1 217 171');
safeSvg.dash1.attr({
    'fill': 'none',
    'stroke': '#c7c5ff',
    'stroke-width': 1,
    'stroke-dasharray': '1 3'
});
safeSvg.dash1.sdata = {
    'zIndex': 10
};

var maskRectGradient = s.gradient('L(0,180,0,0)rgba(94,99,227,1)-rgba(94,99,227,0)');
safeSvg.maskRect = s.rect(-300, 0, 600,300).attr({
    'fill': maskRectGradient
});

safeSvg.maskRect.sdata = {
    'zIndex': -1
}

// growCircle2
var growGradient = s.gradient('R(0, 0, 280)rgba(134,162,255,0.7)-rgba(134,162,255,0)');
safeSvg.growCircle2 = s.circle(0,0,280);
safeSvg.growCircle2.attr({
    'fill': growGradient
});
safeSvg.growCircle2.sdata = {
    'zIndex': -10
}

// fillCircle3
safeSvg.fillCircle3 = s.circle(0,0,250);
safeSvg.fillCircle3.attr({
    'fill': '#5657d6'
});
safeSvg.fillCircle3.sdata = {
    'zIndex': -10
}

// scanArc4
safeSvg.scanArc4 = s.path('M -83 153 A 174 174 0 1 1 82 153L0 0');
safeSvg.scanArc4.attr({
    'fill': 'none',
    'stroke': '#acaaf3',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
});

// scanDash5
safeSvg.scanDash5 = s.path('M -123 115 A 169 169 0 1 1 123 115');
safeSvg.scanDash5.attr({
    'fill': 'none',
    'stroke': '#acaaf3',
    'stroke-width': 1,
    'stroke-dasharray': '1 3'
});


// gradientCircle6
var scanGradient = s.gradient('R(80, 39, 380)rgba(188,200,255,0.6)-rgba(188,200,255,0)');
safeSvg.gradientCircle6 = s.circle(0,0,170);
safeSvg.gradientCircle6.attr({
    'fill': scanGradient
});


// ringCircle
safeSvg.ringCircle7 = s.circle(0,0,117);
safeSvg.ringCircle7.attr({
    'fill': '#412db7'
});
safeSvg.ringCircle7.sdata = {
    'zIndex': -5
}

// ringCircle
safeSvg.ringCircle8 = s.circle(0,0,78);
safeSvg.ringCircle8.attr({
    'fill': '#5856d5'
});
safeSvg.ringCircle8.sdata = {
    'zIndex': -4
}


// inner line

var line = s.path('M0 0L 0 166');
line.attr({
    'fill': 'none',
    'stroke': '#4126b5',
    'stroke-width': 1,
    'opacity': 0.6
});

var lineGroup = s.group(line);

for (var i = 1; i < 8; i++) {
    var lineClone = line.clone();
    lineClone.attr({
        'transform': 'rotate('+ i*45 +')'
    });
    lineGroup.append(lineClone);
}
lineGroup.sdata = {
    'zIndex': -1
}
safeSvg.lineGroup = lineGroup;


var scanmaskGradient =  s.gradient('L(200,30,-30,50)rgba(94,99,227,1)-rgba(94,99,227,0.95):50-rgba(94,99,227,0)');
var scanmaskCircleMask = s.circle(0,0,190).attr({'fill': '#fff'});
safeSvg.scanMask9 = s.rect(-200,0,400,200);
safeSvg.scanMask9.attr({
    'fill': scanmaskGradient,
    'transform': 'rotate(62)',
    'mask': scanmaskCircleMask
});

// to center
var group = s.group();
group.attr({'transform': 'translate(500 500)'});


var elems = [];
for (var key in safeSvg) {
    elems.push(safeSvg[key]);
    safeSvg[key].sdata = safeSvg[key].sdata || {};
    safeSvg[key].sdata.zIndex = safeSvg[key].sdata.zIndex || 0;
}

elems.sort(function(a, b) {
    return a.sdata.zIndex - b.sdata.zIndex;
});
elems.forEach(function(elem) {
    group.append(elem);
});