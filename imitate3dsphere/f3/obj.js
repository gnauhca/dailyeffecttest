import { Vector3 } from 'three/src/math/Vector3';
import { Euler } from 'three/src/math/Euler';
import { perspective } from './perspective.js';

export class Obj {
    constructor() {
        this.parent = null;
        this.children = [];
        this.worldPosition = new Vector3;
        this.position = new Vector3;
        this.scale = new Vector3(1,1,1);
        this.rotation = new Euler;

        this.vertices = [];
        this.worldVertices = [];
        this.willUpdate = false;

        this.croods2D = {
            scale: 1,
            position: new Vector3,
            vertices: []
        };
    }


    set position(position) {
        this._position = position;
        this._watchXYZ(this._position, this.onChange.bind(this));
        this.onChange();
    }
    get position() {
        return this._position;
    }

    set rotation(rotation) {
        this._rotation = rotation;
        this.onChange();
    }
    get rotation() {
        return this._rotation;
    }

    set scale(scale) {
        this._scale = scale;
        this.onChange();
    }
    get scale() {
        return this._scale;
    }

    _watchXYZ(val, callback) {
        let keys = typeof val._x === 'undefined'? ['x','y','z']:['_x','_y','_z'];
        keys.forEach((key)=>{
            val['_' + key] = val[key];

            Object.defineProperty(val, key, {
                configurable : true,
                enumerable : true,
                get : function() {
                    return val['_' + key];
                },
                set : function(newVal) {
                    val['_' + key] = newVal;
                    callback();
                }
            });
        });
    }


    setWorldPosition() {

        if (this.parent) {
            this.worldPosition
                .copy(this.position)
                .multiply(this.parent.scale)
                .applyEuler(this.parent.rotation);
            
            this.worldPosition.add(this.parent.worldPosition);
        } else {
            this.worldPosition.copy(this.position);
        }

        this.updateVertice();

        // child world position update
        this.children.forEach((child)=>{
            child.setWorldPosition();
        });
    }


    updateVertice() {
        this.vertices.forEach((v, i)=>{
            if (!this.worldVertices[i]) {
                this.worldVertices[i] = this.worldPosition.clone();
            }
            this.worldVertices[i]
                .copy(this.worldPosition)
                .add(v)
                .multiply(this.scale)
                .applyEuler(this.rotation);
        });
    }


    calc2DCrood() {
        this.croods2D.scale = perspective.getScaleByZ(this.worldPosition.z);
        
        this.croods2D.position = perspective.get2DCrood(this.worldPosition);
        this.croods2D.vertices = this.croods2D.vertices.map((v)=>{
            return perspective.get2DCrood(v);
        });
    }

    add(child) {
        child.parent = this;
        if (this.children.indexOf(child) === -1) {
            this.children.push(child);
            child.setWorldPosition();
        }
    }

    remove(child) {
        delete child.parent;
        this.children = this.children.filter((o)=>{return o !== obj});
    }
    onChange() {
        if (this.willUpdate) return;
        this.willUpdate = true;
        setTimeout(()=>{
            this.willUpdate = false;
            this.setWorldPosition();
        }, 0);
    }
    _render(ctx, cvs) {
        ctx.save();
        this.calc2DCrood();
        this.render(ctx, cvs);
        this.children.forEach((o)=>{o._render(ctx, cvs)});
        ctx.restore();
    }
    render(ctx, cvs) { }
}

// export default Obj;