
varying vec2 vUvs;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D noise;
vec3 sphereColour = vec3(0.4, 0.8, 1.0);
vec3 ambient = vec3(0.4, 0.4, 0.45);
vec3 hemi = vec3(0.01, 0.01, 0.02);
vec3 up = vec3(0.0, 1.0, 0.0);
vec3 diffuseDir = normalize(vec3(-0.5, -1.0, -1.0));
vec3 diffuse = vec3(0.3, 0.3, 0.3);


void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    // vec3 normal = normalize(vNormal);
    vec3 normal = normalize(
        cross(
            dFdx(vPosition.xyz),
            dFdy(vPosition.xyz)
        )
    );

    // lighting
    float hemiDot = dot(up, normal);
    hemi = hemiDot * hemi;
    float diffuseDot = max(0.0, dot(normal, -diffuseDir));
    diffuseDot *= smoothstep(0.1, 0.105, diffuseDot);
    float threeShades = mix(0.7, 1.0, step(0.4, diffuseDot)) * step(0.105, diffuseDot);
    diffuse = diffuseDot * diffuse * threeShades;

    vec3 reflection = normalize(reflect(-diffuseDir, normal));
    float specDot = max(0.0, dot(reflection, -viewDir));
    vec3 specular = vec3(pow(specDot, 64.0));
    //specular *= vec3(step(0.5, specular.x));

    float fresnelDot = 1.0 - max(0.0, dot(viewDir, normal));
    
    vec3 fresnel = vec3(pow(fresnelDot, 3.0));
    //fresnel *= vec3(step(0.5, fresnel.x));

    vec3 lighting = ambient + hemi + diffuse;

    vec3 colour = sphereColour * lighting;

    colour = pow(colour, vec3(1.0 / 2.2));

    gl_FragColor = vec4(colour, 1.0);
}