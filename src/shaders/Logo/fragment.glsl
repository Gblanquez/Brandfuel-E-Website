 varying vec2 vUv;
 uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uStrength;

void main() {

    vec3 color = mix(uColor1, uColor2, 0.5 + 0.5 * sin(uTime)); // Use sine function to blend colors
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}