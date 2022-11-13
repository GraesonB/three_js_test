varying vec2 vUvs; 
varying vec3 vNormal;
varying vec3 vPosition;
uniform float time;

float inverseLerp(float v, float min, float max) {
    return (v - min) / (max - min);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}


void main() {	
    vec3 localPosition = vec3(position);
    float t = sin(localPosition.y * 7.0 + time * 7.0);
    t = remap(t, -1.0, 1.0, 0.0, 0.5);
    localPosition += normal * t;
    vUvs = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localPosition, 1.0);

    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz; // normals in world space
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    }