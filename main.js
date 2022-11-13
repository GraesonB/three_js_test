import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './style.css';

class ShaderPractice {
    constructor() {
    }
  
    async initialize() {
      this.threejs_ = new THREE.WebGLRenderer({antialias: true});
      document.body.appendChild(this.threejs_.domElement);
  
      window.addEventListener('resize', () => {
        this.onWindowResize_();
      }, false);
  
      this.scene_ = new THREE.Scene();
  
      this.camera_ = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera_.position.set(0, 0, 30);

      const controls = new OrbitControls(this.camera_, this.threejs_.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
  
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
            time: {vlaue: 0.0}
        },
        vertexShader: await vsh.text(),
        fragmentShader: await fsh.text()
      });
  
      const geometry = new THREE.IcosahedronGeometry(3, 50);
      this.sphere = new THREE.Mesh(geometry, material);
      this.sphere.position.set(0.0, 0.0, 0.0);
      this.scene_.add(this.sphere);
      this.totalTime_ = 0.0

    }
  
    onWindowResize_() {
      this.threejs_.setSize(window.innerWidth, window.innerHeight);
    }
  
    raf_() {
      requestAnimationFrame((t) => {
        if (this.previousRAF_ === null ) {
            this.previousRAF_ = t;
        }
        this.step_(t - this.previousRAF_);
        this.threejs_.render(this.scene_, this.camera_);
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
  
