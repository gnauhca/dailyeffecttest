!function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(n,s,function(e){return t[e]}.bind(null,s));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e){const i=["一块捐 一起爱","一起种希望","一起关注公益","一起节约用水","一起捐微笑","一起做好事"],n=["Give together Love together","Planting hope together","Do good things","Focus on public welfare together","Conserve water together","Give a smile together","Do good things together"],s=["#ffc648","#f9b8e0","#5277ef","#51e5e5","#afd16d","#ffb176"],o=["","","","","",""],r="\n\n  varying vec2 vUv;\n  void main() { \n    vUv = uv;\n    vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n    float scale = abs(worldPosition.x / 2000.0);\n    worldPosition = vec4(vec3(worldPosition) * scale, 1.0);\n\n    gl_Position = projectionMatrix * viewMatrix * worldPosition; \n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n  }\n\n",a="\n  uniform sampler2D texture1;\n  //纹理坐标\n  varying vec2 vUv;\n\n  void main(void){\n  //texture2D()获取纹素\n      gl_FragColor = texture2D(texture1, vUv);\n      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n  }\n";class h{constructor(t,e){this.scene=e,this.options=Object.assign({},{tagType:0,angle:0,v:1},t),this.width=20,this.endX=-1*this.width,this.tags=[],this.createTags(),this.tagType=t.tagType,this.tagTypeIndex=0}createTags(){for(;this.endX<this.width;)console.log(this.endX),this.endX=this.addTypeTags(parseInt(6*Math.random()),this.endX)}addTypeTags(t,e){let r=e;const a=new c({x:r,y:this.options.y,type:"icon",text:o[t],height:this.options.height,color:s[t]},this,this.scene);r+=a.width+2,this.tags.push(a);const h=new c({x:r,y:this.options.y,type:"text",text:i[t],height:this.options.height,color:s[t]},this,this.scene);r+=h.width+2,this.tags.push(h);const l=new c({x:r,y:this.options.y,type:"text",text:n[t],height:this.options.height,color:s[t]},this,this.scene);return this.tags.push(l),r+=l.width+2}getPos(t,e){return function(t,e,i){const n=e*e/1e6+(t+i/5);return console.log(e,n/Math.PI*180),{x:e*Math.cos(n),y:e*Math.sin(n)}}(this.options.angle,t,e)}update(){for(let t=this.tags.length-1;t>0;t--){const e=this.tags[t];e.updatePos(e.x-this.options.v)}}}class c{constructor(t,e,i){const{x:n}=t;this.scene=i,this.x=n,this.options=t,this.path=e,this.img=this.createImg(t),this.width=this.img.realWidth/10,this.height=this.img.realHeight/10,this.plane=this.createPlane(),this.gemo=this.plane.geometry,this.initGemo=this.plane.geometry.clone()}createImg(t){const{type:e,text:i,height:n,color:s}=t,o=3*n,r=document.createElement("canvas"),a=r.getContext("2d"),h="text"===e?[o/2,o/2]:[o/4,0],c=Math.abs(o-h[1]),l="text"===e?"source-atop":"destination-in";let d=parseInt(o/2);r.width=1e3,r.height=100,a.font=c+"px PingFang SC";let p=a.measureText(i).width;p+=2*h[0];let g=parseInt(p/2);r.realWidth=p,r.realHeight=o,a.fillStyle=s,a.fillRect(d,0,p-o,o),a.arc(d,d,d,0,2*Math.PI),a.arc(p-d,d,d,0,2*Math.PI),a.fill(),a.globalCompositeOperation=l,a.fillStyle="#fff",a.textAlign="center",a.textBaseline="middle",a.fillText(i,g,d);const u=document.createElement("canvas"),f=u.getContext("2d");return u.width=1024,u.height=1024,u.realWidth=p/3,u.realHeight=o/3,f.drawImage(r,0,0,p,o,0,0,1024,1024),document.body.appendChild(u),u}createPlane(){const t=new THREE.PlaneGeometry(this.width,this.height,5,5),e=(new THREE.MeshBasicMaterial({color:this.options.color,side:THREE.DoubleSide,wireframe:!0}),new THREE.ShaderMaterial({vertexShader:r,fragmentShader:a,uniforms:{texture1:{value:new THREE.CanvasTexture(this.img)}},transparent:!1,side:THREE.DoubleSide})),i=new THREE.Mesh(t,e);return i.position.y=this.options.y,this.scene.add(i),i}updatePos(t){this.x=t,this.plane.position.x=t+this.width/2}destroy(){this.scene.remove(this.plane),this.gemo=null,this.initGemo=null}}class l{constructor(){this.scene=new THREE.Scene,this.camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.set(0,6,200),this.scene.add(this.camera),this.renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,9*window.innerWidth/16),document.querySelector("body").appendChild(this.renderer.domElement);const t=new THREE.GridHelper(500,10,908765,15658734);t.rotation.x=Math.PI/2,this.scene.add(t),this.paths=this.createPaths()}createPaths(){const t=[],e=Math.PI/2;Math.PI;for(let i=-5;i<10;i++){const n=new h({angle:e+15*i,y:15*i,height:10},this.scene);t.push(n)}return t}update(){this.paths.forEach(t=>{t.update()}),this.render()}render(){this.renderer.render(this.scene,this.camera)}}(new class{constructor(){this.renderer=new l}start(){this.tick=window.requestAnimationFrame(()=>this.update())}stop(){window.cancelAnimationFrame(this.tick)}update(){this.renderer.update()}}).start()}]);
//# sourceMappingURL=index.js.map