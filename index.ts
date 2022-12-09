"use strict";

import * as wglh from "./webgl-helper.js";
import {Matrix4x4} from "./webgl-helper.js"

const vertexShaderSource = `#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
//in vec4 a_color;

//out vec4 v_color;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// all shaders have a main function
void main() {
  //v_color = a_color;
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
}
`;

const fragmentShaderSource = `#version 300 es

precision highp float;

//in vec4 v_color;

// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0, 1);
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

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const position_attr = gl.getAttribLocation(program, "a_position");
    const position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    set_cube_geometry(gl);
    gl.enableVertexAttribArray(position_attr);
    gl.vertexAttribPointer(position_attr, 3, gl.FLOAT, false, 0, 0);

    /*const color_attr = gl.getAttribLocation(program, "a_color");
    const color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    set_cube_colors(gl);
    gl.enableVertexAttribArray(color_attr);
    gl.vertexAttribPointer(color_attr, 4, gl.UNSIGNED_BYTE, true, 0, 0);*/

    gl.bindVertexArray(null);

    // Uniforms
    const matrix_uniform = gl.getUniformLocation(program, "u_matrix");

    function render(time: number) {
        const t_seconds = time * 0.001;
        requestAnimationFrame(render);

        const c = gl.canvas as HTMLCanvasElement;

        wglh.resizeCanvasToDisplaySize(c as HTMLCanvasElement, 1);
        gl.viewport(0, 0, c.width, c.height);

        gl.clearColor(0, 0, 0, 255);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);

        gl.bindVertexArray(vao);

        const matrix = Matrix4x4.projection(c.clientWidth, c.clientHeight, 400);
        matrix.translate(100, 100, 0);
        const x_angle = t_seconds * 45;
        const y_angle = t_seconds * 45;
        const z_angle = t_seconds * 45;
        matrix.rotate_x(x_angle*Math.PI/180);
        matrix.rotate_y(y_angle*Math.PI/180);
        matrix.rotate_z(z_angle*Math.PI/180);
        matrix.scale(100, 100, 100);
        gl.uniformMatrix4fv(matrix_uniform, false, matrix.buffer);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

    requestAnimationFrame(render);
})();


function create_letter_f(gl: WebGL2RenderingContext) {
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
}


function set_cube_geometry(gl: WebGL2RenderingContext) {
    const A = [+0.5, -0.5, +0.5];
    const B = [-0.5, -0.5, +0.5];
    const C = [-0.5, +0.5, +0.5];
    const D = [+0.5, +0.5, +0.5];
    const E = [+0.5, -0.5, -0.5];
    const F = [-0.5, -0.5, -0.5];
    const G = [-0.5, +0.5, -0.5];
    const H = [+0.5, +0.5, -0.5];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        // Top
        ...A, ...C, ...B,
        ...A, ...D, ...C,
        // Front
        ...A, ...F, ...D,
        ...D, ...F, ...H,
        // Back
        ...B, ...C, ...F,
        ...F, ...C, ...G,
        // Left side
        ...C, ...D, ...G,
        ...D, ...H, ...G,
        // Right side
        ...A, ...F, ...B,
        ...A, ...E, ...F,
        // Bottom
        ...E, ...G, ...F,
        ...E, ...H, ...G,
    ]), gl.STATIC_DRAW);
}


function set_cube_colors(gl: WebGL2RenderingContext) {
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
        // Top
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
        255, 0, 0, 255,
        // Front
        0, 0, 0, 255,
        0, 0, 0, 255,
        0, 0, 0, 255,
        0, 0, 0, 255,
        0, 0, 0, 255,
        0, 0, 0, 255,
        // Back
        0, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
        0, 255, 0, 255,
        // Left side
        0, 0, 255, 255,
        0, 0, 255, 255,
        0, 0, 255, 255,
        0, 0, 255, 255,
        0, 0, 255, 255,
        0, 0, 255, 255,
        // Right side
        255, 255, 0, 255,
        255, 255, 0, 255,
        255, 255, 0, 255,
        255, 255, 0, 255,
        255, 255, 0, 255,
        255, 255, 0, 255,
        // Bottom
        255, 0, 255, 255,
        255, 0, 255, 255,
        255, 0, 255, 255,
        255, 0, 255, 255,
        255, 0, 255, 255,
        255, 0, 255, 255,
    ]), gl.STATIC_DRAW);
}