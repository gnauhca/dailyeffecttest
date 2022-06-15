var Block = (function() {


	function Block(type, col, row, width, height, left, top, floorBlock) {
		this.type = 0,
		this.belongFaceType = type,//所属面
		this.col = 0,
		this.row = 0,
		this.width = 0,//百分比
		this.height = 0,//百分比
		this.left = 0,
		this.top = 0;
		this.blockEle = document.createElement('div');
		
		if (floorBlock) {
			this.blockEle.setAttribute('alt', 'floorBlock')
		} else {
			this.blockEle.innerHTML = '<div class="arrow-up"></div><div class="arrow-right"></div><div class="arrow-down"></div><div class="arrow-left"></div>';
		}
		this.reset(type, col, row, width, height, left, top);

	}

	//Type of block, Type determine the color of block;
	Block.prototype.setType = function(type) {
		this.type = type;
		this.blockEle.className = 'block block-' + type;
	}

	Block.prototype.getType = function() {
		return this.type;
	}

	Block.prototype.distory = function() {
		this.blockEle = null;
	}

	Block.prototype.reset = function(type, col, row, width, height, left, top) {
		this.type = type,
		this.col = col,
		this.row = row,
		this.width = width,
		this.height = height,
		this.left = left,
		this.top = top;

		var that = this;
		//为了让每个block出现时有动画
		this.blockEle.style.top = this.top + this.height/2 + '%';
		this.blockEle.style.left = this.left + this.width/2 + '%';			
		setTimeout(function() {
			that.blockEle.style.width = that.width + '%';
			that.blockEle.style.height = that.height + '%';
			that.blockEle.style.top = that.top + '%';
			that.blockEle.style.left = that.left + '%';			
		},100);

		this.setType(this.type);




		var arrowEles = this.blockEle.getElementsByTagName('div');

		if (arrowEles.length === 0) {
			return;
		}

		var block = this,
			rowRotateData = {},//箭头横向（left right）转的时候要用的旋转数据，在sizeEdges里
			colRotateData = {};//箭头竖向（up down）转的时候要用的旋转数据，在sizeEdges里

		//确定横竖分别会触发的旋转方向，主要就是用faceType查common.js的rotateDir
		for (var dir in rotateDir) {
			var edges = rotateDir[dir].sizeEdges;
			for (var i = 0; i < edges.length; i++) {
				if (edges[i].face == this.belongFaceType) {
					if (edges[i].rowOrCol == 'row') {
						rowRotateData.rotateType = dir;
						rowRotateData.stackDir = edges[i].stackDir;
						rowRotateData.readDir = edges[i].readDir;
					} else {
						colRotateData.rotateType = dir;
						colRotateData.stackDir = edges[i].stackDir;
						colRotateData.readDir = edges[i].readDir;
					}
				}
			}
		}
		for (var i = 0; i < arrowEles.length; i++) {
			var arrowType = arrowEles[i].className.replace('arrow-', ''),
				rotateType = '',
				dir = '',
				floorNum = 0;

			switch (arrowType) {
				case 'up':
					rotateType = colRotateData.rotateType;
					dir = -colRotateData.readDir;
					floorNum = (colRotateData.stackDir == 1 ? block.col : cube_floor_num - 1 - block.col);
					break;
				case 'down':
					rotateType = colRotateData.rotateType;
					dir = colRotateData.readDir;
					floorNum = (colRotateData.stackDir == 1 ? block.col : cube_floor_num - 1 - block.col);
					break;
				case 'left':
					rotateType = rowRotateData.rotateType;
					dir = -rowRotateData.readDir;
					floorNum = (rowRotateData.stackDir == 1 ? block.row : cube_floor_num - 1 - block.row);
					break;
				case 'right':
					rotateType = rowRotateData.rotateType;
					dir = rowRotateData.readDir;
					floorNum = (rowRotateData.stackDir == 1 ? block.row : cube_floor_num - 1 - block.row);
					break;
			}
			arrowEles[i].setAttribute('alt', rotateType + ',' + dir + ',' + floorNum);
			arrowEles[i].style.borderWidth = (cube.getCurrentCubeSize()/cube_floor_num)/6 + 'px';
		}
	}
	return Block;
})();