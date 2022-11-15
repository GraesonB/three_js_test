varying vec2 vUvs; 
varying vec3 vNormal;
varying vec3 vPosition;
uniform float time;
uniform vec2 mouseCoords;

vec3 hash(vec3 vector) {
    vector = vec3(
        dot(vector, vec3(134.1, 300.7, 81.6)),
        dot(vector, vec3(234.1, 80.7, 281.6)),
        dot(vector, vec3(114.1, 270.7, 131.6))

    );
    return -1.0 + 2.0 * fract(sin(vector)*43003.7564);
}

float noise( in vec3 vector) {
    vec3 floored = floor(vector);
    vec3 fracted = fract(vector);

    vec3 u = fracted * fracted * (3.0 - 2.0 * fracted);

    return mix( mix( mix( dot( hash( floored + vec3(0.0,0.0,0.0) ), fracted - vec3(0.0,0.0,0.0) ), 
                          dot( hash( floored + vec3(1.0,0.0,0.0) ), fracted - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( floored + vec3(0.0,1.0,0.0) ), fracted - vec3(0.0,1.0,0.0) ), 
                          dot( hash( floored + vec3(1.0,1.0,0.0) ), fracted - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( floored + vec3(0.0,0.0,1.0) ), fracted - vec3(0.0,0.0,1.0) ), 
                          dot( hash( floored + vec3(1.0,0.0,1.0) ), fracted - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( floored + vec3(0.0,1.0,1.0) ), fracted - vec3(0.0,1.0,1.0) ), 
                          dot( hash( floored + vec3(1.0,1.0,1.0) ), fracted - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z);
}

float inverseLerp(float v, float min, float max) {
    return (v - min) / (max - min);
}

float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
}


void main() {	
    vec3 localPosition = vec3(position);
    float t = sin(localPosition.y * 5.0 + time * 3.0);
    t = remap(t, -1.0, 1.0, 0.0, 0.5);
    vec3 coords = vec3(uv, time);
    float noiseSample = remap(noise(coords), -1.0, 1.0, 0.0, 1.0);
    float addNoise = noiseSample * t;

    localPosition += normal * t;
    localPosition += normal * pow(max(0.0, dot(normal, vec3(normalize(mouseCoords), 0.0))), 8.0);
    vUvs = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localPosition, 1.0);

    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz; // normals in world space
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    }