import * as THREE from 'three';
const TWEEN = require('@tweenjs/tween.js').default;

function getLookAt(mesh) {
	var lookAt = new THREE.Vector3(0, 0, -1);
	var euler = new THREE.Euler( 0, 0, 0, 'XYZ' )

	euler.copy(mesh.rotation);

	lookAt.applyEuler(euler);
	lookAt.add(mesh.position);
	return lookAt;
}

/**
* 计算相机 fov 的函数
* @param k : 想要看到最大正方形区域边长为 w 和 相机到目标距离 d  k = w/d
* @param r : 屏幕宽高比
*/
THREE.Camera.prototype.setFovAndAspect = function(r, k = 1) {
	this.aspect = r;
	this.fov = Math.atan(k/(2*(r<1?r:1)))*2 * (180 / Math.PI);
	this.updateProjectionMatrix();
}


// Object3DAnimate
THREE.Object3D.prototype.animate = function(target, dur, delay=0, tweenObj) {
	var object3D = this;
	var init = {};
	var dest = {};
	
	var attrs = ['x', 'y', 'z', 'r', 'g', 'b', 'opacity'];
	var separater = '_';

	function setInit(key) {
		let keyArr = key.split('_');
		let subObj = object3D;

		keyArr.forEach(function(subKey) { subObj = subObj[subKey]; });
		init[key] = subObj;
	}

	if (object3D instanceof THREE.Vector3 && target instanceof THREE.Vector3) {
		// 向量
		['x', 'y', 'z'].forEach(function(pos) {
			init[pos] = object3D[pos];
			dest[pos] = target[pos];
		});
	} else {
		// object3d or material
		for (let key in target) {
			let destKey = key;

			if (key === 'lookAt') {
				let initLookAt = object3D.userData.lookAt || getLookAt(object3D);
				['x','y','z'].forEach(function(lookAtKey) {
					init['lookAt_' + lookAtKey] = initLookAt[lookAtKey];
					dest['lookAt_' + lookAtKey] = target['lookAt'][lookAtKey];
				});
			} else {
				if (/color/i.test(key) > 0 && !(target[key] instanceof THREE.Color)) {
					target[key] = new THREE.Color(target[key]);
				}
				if (typeof target[key] === 'object') {
					for (let cKey in target[key]) {
						destKey = key;
						if (attrs.indexOf(cKey) !== -1) {
							destKey += '_' + cKey;
							dest[destKey] = target[key][cKey];
							setInit(destKey);
						}
					}
				} else {
					dest[destKey] = target[key];
					setInit(destKey);
				}
			}
		}
	}

	// console.log(init,dest);
  var tween;
  tweenObj = tweenObj || {};
  tween = new TWEEN.Tween(init)
    .to(dest, dur)
    .easing(tweenObj.easing || TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function(current) {
      for (let currentKey in current) {
        if (currentKey.indexOf('lookAt') === -1) {
          let keyArr = currentKey.split('_');
          let last = keyArr.pop();
          let subObj = object3D;
          keyArr.forEach(function(key) { subObj = subObj[key]; });
          subObj[last] = current[currentKey];
        }
      }
      // console.log(object3D.position);

      if (current.lookAt_x) {
        object3D.lookAt(
          new THREE.Vector3(current.lookAt_x, current.lookAt_y, current.lookAt_z)
        );
      }
      tweenObj.onUpdate && tweenObj.onUpdate.call(this);
    })
    .onComplete(function() {
      var completeRemove = true;
      if (tweenObj.onComplete) {
        if (tweenObj.onComplete() === false)
        completeRemove = false;
      }

      object3D.userData.tweens = object3D.userData.tweens.filter(_tween=>_tween!==tween)
    })
    .start();

  object3D.userData = object3D.userData || {};
  object3D.userData.tweens =  object3D.userData.tweens||[];
  object3D.userData.tweens.push(tween);
}

function stopAnimate() {
	if (this.userData && this.userData.tweens) {
		this.userData.tweens.forEach(tween => tween.stop());
		delete this.userData.tweens;
	}
	return this;
}

function updateAnimate(delta = 16) {
	if (this.userData && this.userData.tweens) {
    // this.userData.tweens.forEach(tween => tween.update(delta));
    TWEEN.update();
    // console.log('TWEEN update' + delta);
	}
	return this;
}

THREE.Material.prototype.animate = THREE.Object3D.prototype.animate;
THREE.Vector3.prototype.animate = THREE.Object3D.prototype.animate;
THREE.Object3D.prototype.stopAnimate = stopAnimate;
THREE.Material.prototype.stopAnimate = stopAnimate;
THREE.Vector3.prototype.stopAnimate = stopAnimate;

THREE.Object3D.prototype.updateAnimate = updateAnimate;
THREE.Material.prototype.updateAnimate = updateAnimate;
THREE.Vector3.prototype.updateAnimate = updateAnimate;

// var box = document.createElement('div');
// box.style.setProperty('background-color', '#008800');
// box.style.setProperty('width', '100px');
// box.style.setProperty('height', '100px');
// document.body.appendChild(box);

// // Setup the animation loop.
// function animate(time) {
// 	requestAnimationFrame(animate);
// 	TWEEN.update(time);
// }
// requestAnimationFrame(animate);