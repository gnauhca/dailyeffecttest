import { Vector3 } from 'three/src/math/Vector3';

class Obj {
    constructor() {
        this.parent = null;
        this.zScale = 1;
        this.children = [];
        this.worldPos = new Vector3();
        this.position = new Vector3();
        this.rotation = new Euler;

        this.vertices = [];
        this.willUpdate = false;
    }

    set position(position) {
        this.position = position;
        this.onChange();
    }
    set rotation(rotation) {
        this.rotation = rotation;
        this.onChange();
    }

    setWorldPos(v3) {
        this.zScale =  1 + (v3.z / P);
        this.worldPos.set(v3.x * this.zScale , v3.y * this.zScale, v3.z);
    }

    setObjWorldPos(child) {
        child.setWorldPos(child.position.clone().applyEuler(this.rotation));
        child.worldPos.add(this.worldPos);
    }

    add(child) {
        child.parent = this;
        if (this.children.indexOf(child) === -1)
        this.children.push(child);
        this.setObjWorldPos(child);
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

            if (this.parent) {
                this.parent.setObjWorldPos(this);
            } else {
                this.setWorldPos(this.position);
            }
            this.children.forEach((o)=>{this.setObjWorldPos(o);});
        }, 0);
    }
    _render(ctx, cvs) {
        ctx.save();
        this.render(ctx, cvs);
        this.children.forEach((o)=>{o._render(ctx, cvs)});
        ctx.restore();
    }
    render(ctx, cvs) { }
}

export default Obj;