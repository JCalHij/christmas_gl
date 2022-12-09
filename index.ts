"use strict";

//import wglh = require("./webgl-helper");
import * as wglh from "./webgl-helper.js";
import {Matrix4x4} from "./webgl-helper.js"

const vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

uniform vec4 u_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

/**
 * Main function.
 */
(() => {
    const canvas = document.getElementById("my-canvas") as HTMLCanvasElement;
    if (!canvas) {
        return;
    }
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("Your platform does not support 'WebGL 2' :(");
        return;
    }

    const vs = wglh.create_shader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = wglh.create_shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) {
        return;
    }
    const program = wglh.create_program(gl, vs, fs);
    if (!program) {
        return;
    }

    const position_buffer = gl.createBuffer();
    if (!position_buffer) {
        alert("Could not generate a buffer for `position` attribute.");
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    const positions = [
        // left column
          0,   0,  0,
         30,   0,  0,
          0, 150,  0,
          0, 150,  0,
         30,   0,  0,
         30, 150,  0,

        // top rung
         30,   0,  0,
        100,   0,  0,
         30,  30,  0,
         30,  30,  0,
        100,   0,  0,
        100,  30,  0,

        // middle rung
         30,  60,  0,
         67,  60,  0,
         30,  90,  0,
         30,  90,  0,
         67,  60,  0,
         67,  90,  0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    if (!vao) {
        alert("Could not generate a VAO.");
        return;
    }
    gl.bindVertexArray(vao);
    // Position attributes
    const position_attr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position_attr);
    gl.vertexAttribPointer(position_attr, 3, gl.FLOAT, false, 0, 0);
    // Uniforms
    const color_uniform = gl.getUniformLocation(program, "u_color");
    const matrix_uniform = gl.getUniformLocation(program, "u_matrix");

    function render(time: number) {
        const t_seconds = time * 0.001;
        requestAnimationFrame(render);

        const c = gl.canvas as HTMLCanvasElement;

        wglh.resizeCanvasToDisplaySize(c as HTMLCanvasElement, 1);
        gl.viewport(0, 0, c.width, c.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.bindVertexArray(vao);

        const matrix = Matrix4x4.projection(c.clientWidth, c.clientHeight, 400);
        matrix.translate(100, 100, 0);
        const x_angle = t_seconds * 0;
        const y_angle = t_seconds * 0;
        const z_angle = t_seconds * 90;
        matrix.rotate_x(x_angle*Math.PI/180);
        matrix.rotate_y(y_angle*Math.PI/180);
        matrix.rotate_z(z_angle*Math.PI/180);
        matrix.scale(1, 1, 1);
        gl.uniformMatrix4fv(matrix_uniform, false, matrix.buffer);

        gl.uniform4fv(color_uniform, [0, 255, 255, 255]);

        gl.drawArrays(gl.TRIANGLES, 0, 18);
    }

    requestAnimationFrame(render);
})();
