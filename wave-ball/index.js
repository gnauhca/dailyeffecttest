import {ani as waveAni} from './wave-ani.js';
import {ani as ballAni} from './ball-ani.js';
import {TIME} from './time.js';

let waveCvs = document.getElementById('wave-cvs');
waveAni.setUp(waveCvs);

let ballCvs = document.getElementById('ball-cvs');
ballCvs.width = 1920;
ballCvs.height = 1079;

ballAni.setUp(ballCvs);

waveAni.start();
ballAni.start();

let bannerAni = {
    start() {
        TIME.start();
    },
    stop() {
        TIME.stop();
    }
};

bannerAni.start();