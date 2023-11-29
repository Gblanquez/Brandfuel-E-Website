import './styles/style.css';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/background/vertex.glsl'
import waterFragmentShader from './shaders/background/fragment.glsl'
import logoVertexShader from './shaders/Logo/vertex.glsl'
import logoFragmentShader from './shaders/Logo/fragment.glsl'
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';



gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.case_study_animation',
    start: 'top top',
    end: 'bottom bottom',
    pin: '.case_info_test',
    scrub: 1,
  }
})



/**
 * Base
 */
// Debug
const gui = new GUI({ width: 0})
const debugObject = {}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry( sizes.width, sizes.height, 100, 100 );

// Colors
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })


const bgGroup = new THREE.Group();


// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },

        uMouse: { value: new THREE.Vector2() }, // Add this line for u_mouse uniform
        uColor1: { value: new THREE.Color('red') }, // Add this line for uColor1 uniform
        uColor2: { value: new THREE.Color('green') }, // Add this line for uColor2 uniform
        uColor3: { value: new THREE.Color('blue') }, // Add this line for uColor3 uniform
        uColor4: { value: new THREE.Color('yellow') }, // Add this line for uColor4 uniform
        uColor5: { value: new THREE.Color('purple') }, // Add this line for uColor5 uniform
        
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 }
    }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')


gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier')
// Mesh
const bg = new THREE.Mesh(waterGeometry, waterMaterial)
// bg.rotation.z =  - Math.PI * 0.5 

bgGroup.add(bg);
bgGroup.position.z = -4

// bg.scale.set(sizes.width, sizes.height, 1);
scene.add(bgGroup)




// Create a circle shape
const circleRadius = 2;
const numCubes = 80; // Assuming 12 cubes for a clock
const clockRadius = 0.7; // Radius of the clock
const circleCenter = new THREE.Vector3(0, 0, 0);

// Create a group to contain the cubes
const cubeGroup1 = new THREE.Group();
const cubeGroup2 = new THREE.Group(); // New group for the second circle

const testMaterial = new THREE.MeshNormalMaterial();

const cMaterial = new THREE.ShaderMaterial({
    vertexShader: logoVertexShader,
    fragmentShader: logoFragmentShader,
    uniforms: {
        uTime: { value: 0.0 },
        uColor1: { value: new THREE.Color('red') },
        uColor2: { value: new THREE.Color('yellow') },
        uStrength: { value: 1.0 },
        uElevation: { value: 0.0},
    }
})

for (let i = 0; i < numCubes; i++) {
    const angle = (i / numCubes) * Math.PI * 2 + Math.PI / 2; // Start from the top of the circle
    const cubeSize = i % 2 === 0 ? 0.5 : 0.9; // Alternating cube sizes
    const x = circleCenter.x + Math.cos(angle) * circleRadius;
    const z = circleCenter.z + Math.sin(angle) * circleRadius;
    const y = 0; // You can adjust the height as needed

    const cube1 = new THREE.Mesh(new THREE.BoxGeometry(cubeSize, 0.1, 0.1), testMaterial);
    cube1.position.set(x, 0, z);
    cube1.rotateY(-angle); // Rotate the cube to align with the clock's position
    cubeGroup1.add(cube1); // Add the cube to the first group

    const cube2 = cube1.clone(); // Clone the cube for the second circle
    cubeGroup2.add(cube2); // Add the cloned cube to the second group
}

cubeGroup1.rotation.x = Math.PI / 2;
cubeGroup1.position.z = 1;
scene.add(cubeGroup1);

cubeGroup2.rotation.x = Math.PI / 2;
cubeGroup2.position.z = 2; // Change the position for the second circle
// scene.add(cubeGroup2);

const baseScale = 1; // Base scale value for the cubes
const amplitude = 0.5; // Amplitude of the heartbeat effect

function updateCubesScale() {
    const time = performance.now() * 0.001; // Get the current time

    // Update scale of cubes in cubeGroup1
    cubeGroup1.children.forEach((cube, index) => {
        const scale = baseScale + Math.sin(time + index) * amplitude; // Use a sine function to create the heartbeat effect
        cube.scale.x = scale; // Adjust the X scale of each cube based on the sine function
    });

    // Update scale of cubes in cubeGroup2
    cubeGroup2.children.forEach((cube, index) => {
        const scale = baseScale + Math.sin(time + index) * amplitude; // Use a sine function to create the heartbeat effect
        cube.scale.x = scale; // Adjust the X scale of each cube based on the sine function
    });
}

    // Initialize u_mouse as a THREE.Vector2
let u_mouse = new THREE.Vector2(0, 0);

    // Update u_mouse on mouse move
window.addEventListener('mousemove', (event) => {
    u_mouse.x = event.clientX / window.innerWidth;
    u_mouse.y = event.clientY / window.innerHeight;
});

// cubeGroup2.scale.set(1.2, 1.2, 1.2)
// cubeGroup2.position.z = -2



//Particles

const particlesCount = 1500
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5 ) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('white'),
    sizeAttenuation: true,
    size: 0.005
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
/**
 * Sizes
 * 
 * 


/**
 * Camera
 */


//Group

const cameraGroup = new THREE.Group()


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 8)
cameraGroup.add(camera)
scene.add(cameraGroup)
// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//cursor

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    waterMaterial.uniforms.uTime.value = elapsedTime;
    cMaterial.uniforms.uTime.value = elapsedTime;

    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;
    updateCubesScale()

    cubeGroup1.rotation.y += 0.001;
    // cubeGroup2.rotation.y += 0.001;

    const pX = cursor.x
    const pY = - cursor.y 

    cameraGroup.position.x += (pX  - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (pY - cameraGroup.position.y) * 2 * deltaTime



    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


