uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform float uTime;
uniform vec2 u_mouse;

varying vec2 vUv;

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//


vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

varying float vElevation;

void main()
{

    vec3 color1 = uColor1;
    vec3 color2 = uColor2;
    vec3 color3 = uColor3;
    vec3 color4 = uColor4;
    vec3 color5 = uColor5;

float noise = cnoise(vUv * 5.0 + u_mouse + vec2(uTime) * 0.02);
noise = (noise + 1.0) / 2.0; // normalize noise to 0.0 - 1.0

vec3 color;
if (noise < 0.25) {
    color = mix(uColor1, uColor2, noise * 4.0); // noise from 0.0 - 0.25
} else if (noise < 0.5) {
    color = mix(uColor2, uColor3, (noise - 0.25) * 4.0); // noise from 0.25 - 0.5
} else if (noise < 0.75) {
    color = mix(uColor3, uColor4, (noise - 0.5) * 4.0); // noise from 0.5 - 0.75
} else {
    color = mix(uColor4, uColor5, (noise - 0.75) * 4.0); // noise from 0.75 - 1.0
}

gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}