var floor = (function() {
	var floor = {},
		floorEles = {
			'frontMask': null,//当存在中间夹层是显示的盖板
			'backMask': null,//当存在中间夹层是显示的盖板
			'front': null,
			'left': null,
			'back': null,
			'right': null,
			'up': null,
			'bottom': null,
			'floorBox': null,//整个层包裹元素，旋转部分
			'floorWrap': null//包含全部floor元素
		},
		sizeEdges = {
			up:[],
			right: [],
			bottom: [],
			left: []
		},//四边存的block
		frontFace = null,//这是face对象
		backFace = null,//这是face对象
		blockWidthPercent = 0,//一块block的百分比25、33.333。。。。
		hasBeenInit = false;


	function init() {
		floorEles.floorWrap = document.getElementById('floorWrap');

		//制作上下层蒙板
		floorEles.frontMask = document.createElement('div');
		floorEles.frontMask.className = 'floor-frontmask';

		floorEles.backMask = document.createElement('div');
		floorEles.backMask.className = 'floor-backmask';

		//制作旋转所用，旋转部分
		frontFace = new Face('front');
		backFace = new Face('back');

		floorEles.floorBox = document.createElement('div');
		floorEles.floorBox.className = 'floor-box';

		floorEles.front = frontFace.getFaceEle();
		floorEles.front.className = 'floor-front';
		
		floorEles.back =  backFace.getFaceEle();
		floorEles.back.className = 'floor-back';
		
		floorEles.up = document.createElement('div');
		floorEles.left = document.createElement('div');
		floorEles.bottom = document.createElement('div');
		floorEles.right = document.createElement('div');

		floorEles.up.style.top = '50%';
		floorEles.left.style.top = '50%';
		floorEles.bottom.style.top = '50%';
		floorEles.right.style.top = '50%';


		floorEles.floorBox.appendChild(floorEles.front);
		floorEles.floorBox.appendChild(floorEles.back);
		floorEles.floorBox.appendChild(floorEles.up);
		floorEles.floorBox.appendChild(floorEles.left);
		floorEles.floorBox.appendChild(floorEles.bottom);
		floorEles.floorBox.appendChild(floorEles.right);

		//初始化最初变换
		floorEles.frontMask.style.transform = 'translateZ(0px)';
		floorEles.backMask.style.transform = 'rotateY(180deg) translateZ(0px)';
		floorEles.front.style.transform = 'translateZ(0px)';
		floorEles.back.style.transform = 'rotateY(180deg) translateZ(0px)';

		floorEles.up.style.transform = 'rotateX(90deg) rotateY(0deg) translateZ(0px)';
		floorEles.left.style.transform = 'rotateX(90deg) rotateY(270deg) translateZ(0px)';
		floorEles.bottom.style.transform = 'rotateX(90deg) rotateY(180deg) translateZ(0px)';
		floorEles.right.style.transform = 'rotateX(90deg) rotateY(90deg) translateZ(0px)';


		//全部挂到floorwrap
		floorEles.floorWrap.appendChild(floorEles.frontMask);
		floorEles.floorWrap.appendChild(floorEles.backMask);
		floorEles.floorWrap.appendChild(floorEles.floorBox);
	}


	//sizeBlockArr是sizeEdges中的某个，里面是block对象， sizeData 是形如['front','left','bottom'..]，一面中一层的颜色信息
	function setSizeData(sizeBlockArr, sizeData) {
		for (var i = 0; i < sizeData.length; i++) {
			sizeBlockArr[i].setType(sizeData[i]);
		}
	}

	//rotateType旋转类型：x/y/z；floorNum：该方向下的第几层；旋转层数据；方向；持续时间；旋转完之后的回调
	floor.rotate = function(rotateType, floorNum, rotateFloorData, dir, durTime, callback) {
		var cubeSize = cube.getCurrentCubeSize(),
			blockSize = cubeSize/cube_floor_num,
			blockWidthPercent = 100/cube_floor_num;

		//设置旋转数据
		rotateFloorData.faceUp && frontFace.setFaceData(rotateFloorData.faceUp.faceData);
		rotateFloorData.faceBottom && backFace.setFaceData(rotateFloorData.faceBottom.faceData);
		
		//设置四边的数据
		setSizeData(sizeEdges.up, rotateFloorData.sizeEdges[0].floorData);
		setSizeData(sizeEdges.right, rotateFloorData.sizeEdges[1].floorData);
		setSizeData(sizeEdges.bottom, rotateFloorData.sizeEdges[2].floorData);
		setSizeData(sizeEdges.left, rotateFloorData.sizeEdges[3].floorData);

		//设置floor位置，和transition时间
		var floorWrapTransform = '';
		switch (rotateType) {
			case 'z':
				floorWrapTransform = '';
				break; 
			case 'x':
				floorWrapTransform = 'rotateY(90deg)';
				break;
			case 'y':
				floorWrapTransform = 'rotateX(-90deg)';
		}
		floorWrapTransform += 'translateZ(' + ((floorNum - (cube_floor_num-1)/2) * blockSize) + 'px)';
		floorEles.floorWrap.style.transform = floorWrapTransform;

		//设置上下蒙板
		floorEles.backMask.style.opacity = (floorNum == 0 ? '0' : '1');
		floorEles.frontMask.style.opacity = (floorNum == cube_floor_num - 1 ? '0' : '1');

		floorEles.floorWrap.style.opacity = 1;

		floorEles.floorBox.style.transition = 'transform ' + durTime/1000 + 's';
		floorEles.floorBox.style.transform = 'rotateZ(' + (dir == 1 ? 90 : -90) + 'deg)';

		setTimeout(function() {
			callback();
			floorEles.floorWrap.style.opacity = 0;
			floorEles.floorWrap.style.transform = 'scale(0.1)';
			floorEles.floorBox.style.transform = '';
		}, durTime-100);
	}

	floor.reset = function() {

		var cubeSize = cube.getCurrentCubeSize(),
			blockSize = cubeSize/cube_floor_num,
			blockWidthPercent = 100/cube_floor_num;

		if (!hasBeenInit) {
			init();
			hasBeenInit = true;
		}

		floorEles.up.style.height = blockWidthPercent + '%';
		floorEles.left.style.height = blockWidthPercent + '%';
		floorEles.bottom.style.height = blockWidthPercent + '%';
		floorEles.right.style.height = blockWidthPercent + '%';
		//console.log(floorEles.up, blockWidthPercent);

		floorEles.up.style.width =  '100%';
		floorEles.left.style.width =  '100%';
		floorEles.bottom.style.width =  '100%';
		floorEles.right.style.width =  '100%';

		floorEles.up.style.marginTop = -blockWidthPercent/2 + '%';
		floorEles.left.style.marginTop = -blockWidthPercent/2 + '%';
		floorEles.bottom.style.marginTop = -blockWidthPercent/2 + '%';
		floorEles.right.style.marginTop = -blockWidthPercent/2 + '%';

		//前后面以及前后面mask, 四边   translateZ
		floorEles.frontMask.style.transform = floorEles.frontMask.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
		floorEles.backMask.style.transform = floorEles.backMask.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
		floorEles.front.style.transform = floorEles.front.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');
		floorEles.back.style.transform = floorEles.back.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + blockSize/2 + 'px)');

		floorEles.up.style.transform = floorEles.up.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		floorEles.right.style.transform = floorEles.right.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		floorEles.bottom.style.transform = floorEles.bottom.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');
		floorEles.left.style.transform = floorEles.left.style.transform.replace(/translateZ\([\d\.]*px\)/, 'translateZ(' + cubeSize/2 + 'px)');


		//前后面的blocks
		frontFace.reset(cube_floor_num);
		backFace.reset(cube_floor_num);

		//todo:置空前后里面的block的箭头
		var divEles = frontFace.faceEle.getElementsByTagName('div'),

			divEles2 = backFace.faceEle.getElementsByTagName('div');

		for (var i = 0; i < divEles.length; i++) {
			if (divEles[i].className.indexOf('arrow') != -1) {
				var parent = divEles[i].parentNode;
				parent.removeChild(divEles[i]);
			} 
		}

		for (var i = 0; i < divEles2.length; i++) {
			if (divEles2[i].className.indexOf('arrow') != -1) {
				var parent = divEles2[i].parentNode;
				parent.removeChild(divEles2[i]);
			} 
		}


		//四边block,blockType统一先设置成front
		for ( var sizeType in sizeEdges) {
			var sizeArr = sizeEdges[sizeType];
			for (var i = 0; i < cube_floor_num; i++) {
				if (sizeArr[i]) {
					sizeArr[i].reset('front', i, 0, (100/cube_floor_num), 100, (100/cube_floor_num) * i, 0);
				} else {
					//blocks里面放的都是Block实例，具体属性在block.js
					sizeArr[i] = new Block('front', i, 0, (100/cube_floor_num), 100, (100/cube_floor_num) * i, 0, true);//最后一个参数代表只是floor（用于旋转的block）

					//将blockEle添加到size;
					floorEles[sizeType].appendChild(sizeArr[i].blockEle);
				}
			}
			//删除多余的block
			var k = cube_floor_num;
			while (k < sizeArr.length) {
				if (sizeArr[k]) {
					//console.log(sizeArr[k]);
					sizeArr[k].blockEle.parentNode.removeChild(sizeArr[k].blockEle);
					sizeArr[k].distory();
					sizeArr[k] = null;
				}
				k++;
			}
			sizeArr.length = cube_floor_num;
		}

	}

	return floor;
})();