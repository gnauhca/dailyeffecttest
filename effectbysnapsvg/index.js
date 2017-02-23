const Snap = require(`imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js`);

require('./index.scss');

console.log(Snap);


var animate = {
    'stroke-dasharray': function(options) {
        var that = this;
        this.attr({'stroke-dasharray': options.init.join(' ')});
        setTimeout(function() {
            Snap.animate(options.init, options.final, function(v) {
                // console.log(v);
                that.attr({
                    'stroke-dasharray': v.join(' ')
                });
            }, options.dur, options.easing || mina.linear);
        }, options.delay);
    },

    'stroke-dashoffset': function(options) {
        var that = this;
        this.attr({'stroke-dashoffset': options.init});
        setTimeout(function() {
            Snap.animate(options.init, options.final, function(v) {
                that.attr({
                    'stroke-dashoffset': v
                });
            }, options.dur, options.easing || mina.linear);
        }, options.delay);
    },

    'opacity': function(options) {
        var that = this;
        this.attr({'opacity': options.init});
        setTimeout(function() {
            Snap.animate(options.init, options.final, function(v) {
                that.attr({
                    'opacity': v
                });
            }, options.dur, options.easing || mina.linear);
        }, options.delay);
    },

}; 




var s = Snap(1000, 1000);

var  sElems = {

};

sElems.circle0 = s.circle(0, 0, 200);
sElems.circle0.attr({
    'stroke': "#495b89",
    'strokeWidth': 1,
    'fill': 'none'
});
sElems.circle0.data = {
  animate: {
    'stroke-dasharray': {
        'init': [0, 1800],
        'final': [1800, 0],
        'dur': 2000,
        'delay': 400
    },
  },
};

sElems.arc0 = s.circle(0, 0, 204);
sElems.arc0.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 8,
    'fill': 'none',
    'stroke-dasharray': '220 430'
    // 'stroke-dasharray': '0 ' + Math.PI * 2 * 204
});
sElems.arc0.data = {
  animate: {
    'stroke-dashoffset': {
        'init': 2600,
        'final': 0,
        'dur': 4000,
        'delay': 0
    },
    'stroke-dasharray': {
        'init': [0, 800],
        'final': [220, 430],
        'dur': 1000,
        'delay': 0
    }
  }
};

sElems.dashCircle0 = s.circle(0, 0, 193);
sElems.dashCircle0.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 5'
});

sElems.dashCircle0.data = {
  animate: {
    'stroke-dasharray': {
        'init': [1, 300],
        'final': [1, 5],
        'dur': 4000,
        'delay': 0
    },
    'stroke-dashoffset': {
        'init': -2800,
        'final': 0,
        'dur': 4000,
        'delay': 1250
    },
  }  
};





////////////
sElems.circle2 = s.circle(0, 0, 250);
sElems.circle2.attr({
    'stroke': "#495b89",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1800 1800'
});
sElems.circle2.data = {
  animate: {
    'stroke-dashoffset': {
        'init': -1800,
        'final': 0,
        'dur': 3000,
        'delay': 1250
    },
  }  
};


sElems.dashCircle2 = s.circle(0, 0, 241);
sElems.dashCircle2.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 8,
    'fill': 'none',
    'stroke-dasharray': '1 10'
});
sElems.dashCircle2.data = {
  animate: {
    'stroke-dasharray': {
        'init': [1, 1800],
        'final': [1, 10],
        'dur': 4000,
        'delay': 0
    },
    'stroke-dashoffset': {
        'init': 1600,
        'final': 0,
        'dur': 4000,
        'delay': 0
    }
  }  
};

////////////
sElems.circle3 = s.circle(0, 0, 100);
sElems.circle3.attr({
    'stroke': "#bb216a",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': [800, 800]
});
sElems.circle3.data = {
  animate: {
    'stroke-dashoffset': {
        'init': -800,
        'final': 0,
        'dur': 3000,
        'delay': 1250
    },
  }  
};



sElems.arc3 = s.circle(0, 0, 102);
sElems.arc3.attr({
    'stroke': "#bb216a",
    'strokeWidth': 5,
    'fill': 'none',
    'stroke-dasharray': '150 160'
});
sElems.arc3.data = {
  animate: {
    'stroke-dashoffset': {
        'init': 2600,
        'final': 0,
        'dur': 4000,
        'delay': 0
    },
    'stroke-dasharray': {
        'init': [0, 800],
        'final': [150, 160],
        'dur': 4000,
        'delay': 1000
    }
  }  
};

////////////
sElems.dashCircle4 = s.circle(0, 0, 81);
sElems.dashCircle4.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 5'
});
sElems.dashCircle4.data = {
  animate: {
    'stroke-dasharray': {
        'init': [1, 500],
        'final': [1, 5],
        'dur': 4000,
        'delay': 0
    }
  }  
};

////////////
sElems.circle5 = s.circle(0, 0, 60);
sElems.circle5.attr({
    'stroke': "#9293b1",
    'strokeWidth': 2,
    'fill': 'none',
    'stroke-dasharray': '600 600'
});
sElems.circle5.data = {
  animate: {
    'stroke-dashoffset': {
        'init': 600,
        'final': 0,
        'dur': 2000,
        'delay': 0
    },
  }  
};


////////////
sElems.dashCircle6 = s.circle(0, 0, 51);
sElems.dashCircle6.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
});

sElems.dashCircle6.data = {
  animate: {
    'stroke-dasharray': {
        'init': [1, 400],
        'final': [1, 6],
        'dur': 4000,
        'delay': 0
    },
    'stroke-dashoffset': {
        'init': 400,
        'final': 0,
        'dur': 4000,
        'delay': 0
    },
  }  
};

///////////
sElems.dashCircle7 = s.circle(0, 0, 41);
sElems.dashCircle7.attr({
    'stroke': "#8a9dbe",
    'strokeWidth': 1,
    'fill': 'none',
    'stroke-dasharray': '1 8'
});
sElems.dashCircle7.data = {
  animate: {
    'stroke-dasharray': {
        'init': [1, 300],
        'final': [1, 8],
        'dur': 4000,
        'delay': 0
    },
  }  
};    

///////////
sElems.circle8 = s.circle(0, 0, 13);
sElems.circle8.attr({
    'stroke': "none",
    'fill': '#788ebd'
});
sElems.circle8.data = {
  animate: {
    'opacity': {
        'init': 0,
        'final': 1,
        'dur': 800,
        'delay': 6000
    },
  }  
};   




var group = s.group();
group.attr({'opacity': 0});

var elems = [];
for(var key in sElems) {
    elems.push(sElems[key])

    var index = key.match(/\d$/)[0];
    sElems[key].data.index = Number(index);
}
elems.reverse();
for (var i = 0; i < elems.length; i++) {
    group.append(elems[i]);
}

function drawCircle() {
    group.attr({
        'transform': 'translate(500 500)'
    });

    for (var i = 0; i < elems.length; i++) {
        for (var key in elems[i].data.animate) {
            animate[key].call(elems[i], elems[i].data.animate[key]);
        }
    }
}

function rotate() {
    var rSpeed = [4,3,2,1,5,0,6,9,0];
    var signs = [1,1,-1,1,-1,1,-1,1,-1];
    var sign;
    var speed;
    var index;
    var sign;
    var angle;

    Snap.animate(0, 10000000000000, function(v) {
        for(var i = 0; i < elems.length; i++) {
            index = elems[i].data.index;
            speed = rSpeed[elems[i].data.index];
            sign = signs[elems[i].data.index]
            angle = sign * speed * v;
            elems[i].r = angle;
            elems[i].attr({
                'transform': 'translate('+ (elems[i].data.tx || 0) + ' ' + (elems[i].data.ty || 0) +') rotate('+ angle +')'
            });
        }
    }, 1000000000000000);
}



function groupMove() {
    var skew = -30;
    var scaleSub = 0.2;
    var ratio = 0.6;
    var zs = [-100, 0, 0, 40, 55, 130, 135, 135, 140];
    var tx;
    var ty;

    Snap.animate(0, 1, function(v) {
        group.attr({
            'transform': 'translate(500 500) skewX('+skew * v+') scale('+(1-scaleSub*v)+', '+(1-scaleSub*v)+')'
        });

        for(var i = 0; i < elems.length; i++) {
            tx = zs[elems[i].data.index] * v;
            ty = tx * ratio;
            elems[i].attr({
                'transform': 'translate('+ tx + ' ' + ty +') rotate(' + (elems[i].data.r || 0) + ')'
            });
            elems[i].data.tx = tx;
            elems[i].data.ty = ty;
        }


    }, 5000, mina.easeinout);


}

function start() {
    drawCircle();
    group.attr({'opacity': 1});
    setTimeout(rotate, 2000);
    setTimeout(groupMove, 1000);
}

start();
/*group.animate({
    'transform': 'translate(500 500) skewX(-30)'
}, 4000);*/
