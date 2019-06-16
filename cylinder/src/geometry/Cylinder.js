import Face from '../Face.js';
import Group from '../Group.js';
import { Vector3 } from '../math/Vector3.js';
import { Matrix4 } from '../math/Matrix4.js';
import * as CONST from '../CONST.js';
import * as util from '../util/util.js';

export default class Cylinder extends Group {
  constructor(options) {
    super();

    this.options = options;
    // this.radiusBottom = radiusBottom;
    // this.radiusTop = radiusTop;
    // this.height = height;
    // this.sideBackground = sideBackground;
    // this.topBackground = topBackground;
    // this.bottomBackground = bottomBackground;
    // this.radiusSegment = radiusSegment;

    this.createFaces(options);
  }

  createFaces(options) {

    const { radiusTop, radiusBottom, height, radiusSegment, sideBackground, topBackground, bottomBackground } = options;

    let segmentRadian = Math.PI * 2 / radiusSegment;
    let segmentRadianHalf = segmentRadian / 2;
    let cosSegmentRadianHalf = Math.cos(segmentRadianHalf);
    let sinSegmentRadianHalf = Math.sin(segmentRadianHalf);

    // 顶面
    let topTriangleHeight = radiusTop * cosSegmentRadianHalf;
    let topTriangleWidth = radiusTop * sinSegmentRadianHalf * 2;

    // 底面
    let bottomTriangleHeight = radiusBottom * cosSegmentRadianHalf;
    let bottomTriangleWidth = radiusBottom * sinSegmentRadianHalf * 2;

    let maxTriangleWidth = Math.max(topTriangleWidth, bottomTriangleWidth);

    // sub
    let endHeightSub = bottomTriangleHeight - topTriangleHeight;
    let endWidthSub = bottomTriangleWidth - topTriangleWidth;
    let endWidthSubHalf = endWidthSub / 2;
    let endWidthSubHalfAbs = Math.abs(endWidthSubHalf);

    // console.log(topTriangleHeight, bottomTriangleHeight);

    // 侧面
    let sideFaceRadian = Math.atan(endHeightSub / height);
    let sideHeight = height / Math.cos(sideFaceRadian);

    let sideBaseMatrix = new Matrix4().makeTranslation(0, sideHeight / 2, 0);

    sideBaseMatrix.multiplyMatrices(
      new Matrix4().makeRotationX(sideFaceRadian),
      sideBaseMatrix
    );

    sideBaseMatrix.multiplyMatrices(
      new Matrix4().makeTranslation(0, -height / 2, topTriangleHeight),
      sideBaseMatrix
    );

    let sideFaceStyles = {
      'height': sideHeight
    };
    if (endWidthSub > 0) {
      Object.assign(sideFaceStyles, {
        '-webkit-clip-path': `polygon(0 100%, ${endWidthSubHalfAbs}px 0, ${Math.abs(bottomTriangleWidth)-endWidthSubHalfAbs}px 0, 100% 100%)`,
        'width': bottomTriangleWidth
      });
    } else if (endWidthSub < 0) {
      Object.assign(sideFaceStyles, {
        '-webkit-clip-path': `polygon(0 0, ${endWidthSubHalfAbs}px 100%, ${Math.abs(topTriangleWidth)-endWidthSubHalfAbs}px 100%, 100% 0%)`,
        'width': topTriangleWidth
      });
    } else {
      Object.assign(sideFaceStyles, {
        'width': topTriangleWidth
      });
    }

    if (sideBackground) {
      Object.assign(sideFaceStyles, {
        'background': sideBackground,
        'background-size': `auto ${sideHeight}px`
      });
    }

    for (let i = 0; i < radiusSegment; i++) {
      let sideFace = new Face(null, { name: `cylinder-side${i}` });
      let faceMatrix = new Matrix4().makeRotationAxis(
        new Vector3(0, 1, 0),
        i * segmentRadian
      );


      util.setStyles(sideFace.elem, sideFaceStyles);
      if (sideBackground) {
        sideFace.elem.style['background-position'] = `${-maxTriangleWidth * i}px 0`
      }

      faceMatrix.multiplyMatrices(
        faceMatrix,
        sideBaseMatrix
      );

      sideFace.setModelMatrix(faceMatrix);
      // sideFace.elem.innerHTML = 'css css css css css css css css css css css css css css css css css css css css css css css css css '
      this.add(sideFace);
    }

    if (options.open) {
      return;
    }

    // 顶面
    let topVertices = [];
    let bottomVertices = [];
    let topStyles = {
      width: radiusTop * 2,
      height: radiusTop * 2,
      background: topBackground,
      'background-size': '100% 100%'
    };
    let bottomStyles = {
      width: radiusBottom * 2,
      height: radiusBottom * 2,
      background: bottomBackground,
      'background-size': '100%'
    };
    let startRadian = -segmentRadianHalf - CONST.R90;

    for (let i = 0; i < radiusSegment; i++) {
      let currentRadian = startRadian - i * segmentRadian;
      topVertices.push([
        Math.cos(currentRadian) * radiusTop + radiusTop,
        Math.sin(currentRadian) * radiusTop + radiusTop
      ]);
      bottomVertices.push([
        Math.cos(currentRadian) * radiusBottom + radiusBottom,
        Math.sin(currentRadian) * radiusBottom + radiusBottom
      ]);
    }

    let topClipStyle = topVertices.map(vertice => { return `${vertice[0]}px ${vertice[1]}px` }).join(',');
    let bottomClipStyle = bottomVertices.map(vertice => { return `${vertice[0]}px ${vertice[1]}px` }).join(',');
    Object.assign(topStyles, { '-webkit-clip-path': `polygon(${topClipStyle})`} );
    Object.assign(bottomStyles, { '-webkit-clip-path': `polygon(${bottomClipStyle})`} );

    let topFace = new Face();
    let bottomFace = new Face();

    topFace.setPosition(0, -height / 2, 0);
    topFace.setRotation(CONST.R90, 0, 0);

    bottomFace.setPosition(0, height / 2, 0);
    bottomFace.setRotation(-CONST.R90, 0, 0);


    util.setStyles(topFace.elem, topStyles);
    util.setStyles(bottomFace.elem, bottomStyles);

    this.add(topFace);
    this.add(bottomFace);

  }


  // setbackground(background) {
  //   if (!background) {
  //     return;
  //   }

  //   this.background = background;
  //   for (let key in this.faces) {
  //     this.faces[key].elem.style.background = background;
  //   }
  // }

}