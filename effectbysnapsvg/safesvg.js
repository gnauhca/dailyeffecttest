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
    'stroke-dasharray': '1267 1267',
    'stroke-dashoffset': '1267'
});
safeSvg.greenOutArc0.sdata = {
    'zIndex': 10,
    'animate': function() {
        setTimeout(function() {
            Snap.animate(1267, 0, function(v) {
                safeSvg.greenOutArc0.attr({
                    'stroke-dashoffset': v
                });
            }, 3000, mina.easeout);
        }, 2000);
    }
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


/************* scan ************/
// scanArc4
safeSvg.scanGroup = s.group();
var scanArc4 = s.path('M -83 153 A 174 174 0 1 1 82 153L0 0');
scanArc4.attr({
    'fill': 'none',
    'stroke': '#acaaf3',
    'stroke-width': 1.5,
    'stroke-linecap': 'round',
    'stroke-dasharray': '1100 1100',
    'stroke-dashoffset': '1100'
});
scanArc4.sdata = {
    'animate': function() {
        setTimeout(function() {
            Snap.animate(0, 1, function(v) {
                scanArc4.attr({
                    'stroke-dashoffset': -1100 * (1-v)
                });
            }, 2000, mina.easeinout);
        }, 0);
    }
}
safeSvg.scanGroup.append(scanArc4);

// scanDash5
var scanDash5 = s.path('M -123 115 A 169 169 0 1 1 123 115');
scanDash5.attr({
    'fill': 'none',
    'stroke': '#acaaf3',
    'stroke-width': 1,
    'stroke-dasharray': '1 1200'
});
scanDash5.sdata = {
    'animate': function() {
        setTimeout(function() {
            Snap.animate(1200, 3, function(v) {
                scanDash5.attr({
                    'stroke-dasharray': '1 ' + (v|0)
                });
            }, 3000);
        }, 1000);
    }
}
safeSvg.scanGroup.append(scanDash5);


// gradientCircle6
var scanGradient = s.gradient('R(80, 39, 380)rgba(188,200,255,0.6)-rgba(188,200,255,0)');
var gradientCircle6 = s.circle(0,0,170);
gradientCircle6.attr({
    'fill': scanGradient,
    'opacity': 0
});
gradientCircle6.sdata = {
    'animate': function() {
        setTimeout(function() {
            Snap.animate(0, 1, function(v) {
                gradientCircle6.attr({
                    'opacity': v
                });
            }, 1000);
        }, 2000);
    }
}

safeSvg.scanGroup.append(gradientCircle6);
safeSvg.scanGroup.sdata = {
    'animate': function() {
        setTimeout(function() {
            Snap.animate(0, 1800, function(v) {
                safeSvg.scanGroup.attr({
                    'transform': 'rotate('+v+')'
                });
            }, 3000, mina.easeinout);
        }, 2000);
    }
}



var scanmaskGradient =  s.gradient('L(200,30,-30,50)rgba(94,99,227,1)-rgba(94,99,227,0.95):50-rgba(94,99,227,0)');
var scanmaskCircleMask = s.circle(0,0,175).attr({'fill': '#fff'});
var scanMask9 = s.rect(-200,0,400,200);
scanMask9.attr({
    'fill': scanmaskGradient,
    'transform': 'rotate(62)',
    'mask': scanmaskCircleMask,
    'opacity': 0
});
scanMask9.sdata = {
    'animate': function() {
        setTimeout(function() {
            Snap.animate(0, 1, function(v) {
                scanMask9.attr({
                    'opacity': v
                });
            }, 3000);
        }, 0);
    }
}


safeSvg.scanGroup.append(scanMask9);



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
    'opacity': 0.6,
    'stroke-dasharray': '0 100'
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
    'zIndex': -1,
    'animate': function() {
        setTimeout(function() {
            Snap.animate(0, 1, function(v) {
                lineGroup.children().forEach(function(line) {
                    line.attr({
                        'stroke-dasharray': 200 * v + ' 200'
                    });
                });
            }, 1000, mina.easeinout);
        }, 500);
    }
}
safeSvg.lineGroup = lineGroup;


safeSvg.shieldImages = s.image('./safe-shield.png', -56, -64, 112, 128).attr({
    'opacity': 0,
    'transform': 'scale(3,3)'
});

safeSvg.shieldImages.sdata = {
    'animate': function() {
        setTimeout(function() {
            safeSvg.shieldImages.animate({
                'opacity': 1,
                'transform': 'scale(1,1)'
            }, 500, mina.easeout);
        }, 5000);
    }
}

safeSvg.shieldOkImages = s.image('./safe-ok.png', -28, -19, 56, 38).attr({
    'opacity': 0,
    'transform': 'scale(6,6)'
});
safeSvg.shieldOkImages.sdata = {
    'animate': function() {
        setTimeout(function() {
            safeSvg.shieldOkImages.animate({
                'opacity': 1,
                'transform': 'scale(1,1)'
            }, 500, mina.easeout);
        }, 5000);
    }
}


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


window.safeSvgStart = function() {
    (function play(elem) {
        if (elem.sdata && elem.sdata.animate) {
            elem.sdata.animate.call(elem);
        }
        if (elem.children) {
            elem.children().forEach(function(e) {
                play(e);
            });
        }
    })(group);
}