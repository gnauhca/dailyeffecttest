const vertexShader = `
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
  }

  float cn(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  uniform vec3 objPos;
  uniform float opacity;

  uniform float tagRowCount;
  uniform float tagHeight;
  uniform float tagRowGap;
  uniform float tagRowHeight;
  uniform float tagsTotalRowHeight;
  uniform float tagsHalfRowHeight;
  uniform float tagsHalfRowWidth;
  uniform float tagsTotalRowWidth;
  uniform float cameraFov;
  uniform float cameraZ;

  uniform float objPosNoiseWide;
  uniform float objPosNoiseOffset;
  uniform float objPosNoiseUnit;
  uniform float noiseWide;
  uniform float noiseOffset;
  uniform float noiseUnit;
  uniform float spinAngle;
  uniform float spinOffset;



  varying vec2 vUv;
  varying float opacity2;

  float PI = 3.14159;
  float PI2 = 3.14159 * 2.0;
  float PIM2 = 3.14159 / 2.0;

  float cubicOut(float t) {
    float f = t - 1.0;
    return f * f * f + 1.0;
  }

  float quarticOut(float t) {
    return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
  }

  float qinticIn(float t) {
    return pow(t, 5.0);
  }

  float qinticOut(float t) {
    return 1.0 - (pow(t - 1.0, 5.0));
  }

  void main() { 
    vUv = uv;

    vec3 objWorldPos = vec3(modelMatrix * vec4(objPos, 1.0));
    float dir = sign(objWorldPos.x);

    // opacity2
    float objWorldPosXPer = abs(objWorldPos.x / tagsHalfRowWidth);
    if (objWorldPosXPer < 0.1) {
      opacity2 = 0.0;
    } else if (objWorldPosXPer < 0.6) {
      opacity2 = cubicOut((objWorldPosXPer - 0.1) / 0.5);
    } else {
      opacity2 = 1.0;
    }

    float objWorldNoise = cn(objWorldPos / tagsHalfRowWidth / objPosNoiseWide + objPosNoiseOffset) - 0.5;
    float objWorldPosAddX = cos(objWorldNoise * PI2) * tagRowHeight * objPosNoiseUnit / 3.0;
    float objWorldPosAddY = sin(objWorldNoise * PI2) * tagRowHeight * objPosNoiseUnit;

    vec3 newPosition = vec3(position);
    newPosition.x = newPosition.x + objWorldPosAddX;
    newPosition.y = newPosition.y + objWorldPosAddY;
    // newPosition.z = objWorldPosAddX;

    // vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 worldPosition = modelMatrix * vec4(position + objWorldPos, 1.0);
    vec3 initWorldPos = vec3(worldPosition);
    float absWorldX = abs(initWorldPos.x);
    float absWorldXPer = absWorldX / tagsHalfRowWidth;

    // 螺旋
    float spinPerX = absWorldX / tagsHalfRowWidth;
    float spinPerY = initWorldPos.y / tagsTotalRowHeight;

    float anglePer = quarticOut(spinPerX) + spinPerY / 2.0;
    float angle = anglePer * PI * spinAngle;
    angle -= PI * spinAngle;

    // float lenPer = qinticOut(spinPer);
    // float angleX = initWorldPos.x + lenPer * tagsHalfRowWidth;
    float angleX = initWorldPos.x;
    
    worldPosition.x = angleX * cos(angle) - dir * spinOffset;
    worldPosition.y = angleX * sin(angle) - dir * spinOffset * 0.3;

    // noise
    float noise = cn(vec3(initWorldPos / tagsTotalRowHeight / noiseWide) + noiseOffset) - 0.5;
    float xadd = cos(noise * PI) * tagRowHeight * noiseUnit;
    float yadd = sin(noise * PI) * tagRowHeight * noiseUnit;

    worldPosition.x = worldPosition.x + xadd;
    worldPosition.y = worldPosition.y + yadd;

    worldPosition.x *= 1.1;

    gl_Position = projectionMatrix * viewMatrix * worldPosition; 
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }

`;

const fragmentShader = `
  uniform sampler2D texture1;
  //纹理坐标
  varying vec2 vUv;
  varying float opacity2;
  uniform float opacity;

  void main(void){
      vec4 color = texture2D(texture1, vUv);
      
      color.a = color.a * opacity2;
      gl_FragColor = color;
      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;
