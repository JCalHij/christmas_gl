"use strict";

//import wglh = require("./webgl-helper");
import * as wglh from "./webgl-helper.js";


/**
 * Main function.
 */
(() => {
    const vertexShaderSource = document.getElementById("vertex-shader")?.innerText;
    const fragmentShaderSource = document.getElementById("fragment-shader")?.innerText;
    if (!vertexShaderSource || !fragmentShaderSource) {
        return;
    }
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
        0, 0,
        0, 0.5,
        0.7, 0,
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
    gl.vertexAttribPointer(position_attr, 2, gl.FLOAT, false, 0, 0);
    // Uniforms
    const time_uniform = gl.getUniformLocation(program, "u_time");


    function render(time: number) {
        const t_seconds = time * 0.001;
        requestAnimationFrame(render);
        wglh.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement, 1);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        
        gl.clearColor(0, 0, 0, 255);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.uniform1f(time_uniform, t_seconds);
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    requestAnimationFrame(render);
})();
