class Renderer {
    constructor(ctx, cvs) {
        this.ctx = ctx;
        this.cvs = cvs;
    }

    render(scene) {
        this.ctx.save();
        this.beforeRender();
        this.ctx.restore();
        scene.objs.forEach((o)=>{
            o._render(this.ctx, this.cvs);
        });
        this.ctx.save();
        this.afterRender();
        this.ctx.restore();
    }

    beforeRender() {
        // this.ctx.globalCompositeOperation = 'destination-out';
        // this.ctx.globalAlpha = 0.1;
        // this.ctx.fillStyle = "#ffffff";
        // this.ctx.fillRect(0,0,this.cvs.width,this.cvs.height);
        this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
    }
    afterRender() {}
}

export { Renderer };