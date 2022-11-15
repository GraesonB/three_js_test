import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './style.css';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function nameFadeIn(name) {
    const letters = name.getElementsByClassName('letter');
    for (const letter of letters) {
        letter.style.visibility = 'visible';
        letter.classList.add('fade-in');
        await wait(50);
    }
    const subheader = document.querySelector('.subheader');
    subheader.style.visibility = 'visible';
    subheader.classList.add('fade-in');
  }

class ShaderPractice {
    constructor() {
    }
    async initialize() {
      this.threejs_ = new THREE.WebGLRenderer(
        {
            antialias: true,
            canvas: document.querySelector('#sphere'),
            alpha: true
        });
      this.threejs_.setClearColor( 0x141E28 );
      //document.body.appendChild(this.threejs_.domElement);
        
      window.addEventListener('resize', () => {
        this.onWindowResize_();
      }, false);
  
      this.scene_ = new THREE.Scene();
  
      this.camera_ = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera_.position.set(0, 0, 15);
  
      await this.setupProject_();
      
      this.onWindowResize_();
      this.previousRAF_ = null;
      this.raf_();
    }
  
    async setupProject_() {
      const vsh = await fetch('./shaders/vertex.glsl');
      const fsh = await fetch('./shaders/fragment.glsl');


      const material = new THREE.ShaderMaterial({
        uniforms: {
            time: {value: 0.0},
            fresnelMod: {value: 60.0},
            mouseCoords: {value: new THREE.Vector2(0.0, 0.0)}
        },
        vertexShader: await vsh.text(),
        fragmentShader: await fsh.text()
      });
  
      const geometry = new THREE.IcosahedronGeometry(6, 75);
      this.sphere = new THREE.Mesh(geometry, material);
      this.sphere.position.set(0.0, 0.0, -12.0);
      this.sphere.rotation.x = 1.6; // 1.6 for loading

      const boxGeo = new THREE.BoxGeometry(6, 4);
      this.box = new THREE.Mesh(boxGeo, material);
      this.box.position.set(0.0,-12.0, -12);
      this.scene_.add(this.boxm);
      this.scene_.add(this.sphere);
      this.totalTime_ = 0.0;
      this.mouse = new THREE.Vector2(0.0, 0.0);

      document.addEventListener('mousemove', this.onMouseMove);

    }

    onMouseMove = (e) => {
        if (this.totalTime_ > 3.4) {
          this.mouse.setX((e.clientX - window.innerWidth / 2));
          this.mouse.setY(-(e.clientY - window.innerHeight / 2));
  
          this.sphere.material.uniforms.mouseCoords.value = this.mouse;
        }
    }
  
    onWindowResize_() {
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }
  
    raf_() {
      requestAnimationFrame((t) => {
        if (this.previousRAF_ === null ) {
            this.previousRAF_ = t;
        }
        this.onWindowResize_();
        this.step_(t - this.previousRAF_);
        this.threejs_.render(this.scene_, this.camera_);
        if (this.totalTime_ > 3.0 && this.sphere.rotation.x > 1.0) {
            this.sphere.rotation.x -= 0.01;
        }
        if (this.totalTime_ > 3.75) {
            nameFadeIn(document.querySelector('#name'));
        }
        if (this.totalTime_ > 2.0 && this.sphere.material.uniforms.fresnelMod.value > 6.5) {
            this.sphere.material.uniforms.fresnelMod.value -= 0.5;
        }
        this.raf_();
        this.previousRAF_ = t;
      });
    }

    step_(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        this.totalTime_ += timeElapsedS;
        this.sphere.material.uniforms.time.value = this.totalTime_;
    }

  }

  let APP_ = null;
  
  window.addEventListener('DOMContentLoaded', async () => {
    APP_ = new ShaderPractice();
    await APP_.initialize();
  });
  
