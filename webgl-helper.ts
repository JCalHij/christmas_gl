"use strict";


export function create_shader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        alert(`Error compiling shader of type ${type}:\n${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


export function create_program(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw new Error(`Error linking program:\n${gl.getProgramInfoLog(program)}`);
    }

    return program;
}


export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier: number): boolean {
    multiplier = multiplier || 1;
    const width = canvas.clientWidth * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}


export class Matrix4x4 {
    buffer: number[]

    constructor(b: number[]) {
        this.buffer = b;
    }

    translate(dx: number, dy: number, dz: number) {
        this.buffer = Matrix4x4.multiplication(this, Matrix4x4.translation(dx, dy, dz)).buffer;
    }

    rotate_x(radians: number) {
        this.buffer = Matrix4x4.multiplication(this, Matrix4x4.rotation_x(radians)).buffer;
    }

    rotate_y(radians: number) {
        this.buffer = Matrix4x4.multiplication(this, Matrix4x4.rotation_y(radians)).buffer;
    }

    rotate_z(radians: number) {
        this.buffer = Matrix4x4.multiplication(this, Matrix4x4.rotation_z(radians)).buffer;
    }

    scale(sx: number, sy: number, sz: number) {
        this.buffer = Matrix4x4.multiplication(this, Matrix4x4.scalation(sx, sy, sz)).buffer;
    }

    static identity(): Matrix4x4 {
        return new Matrix4x4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static translation(dx: number, dy: number, dz: number): Matrix4x4 {
        return new Matrix4x4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            dx, dy, dz, 1
        ]);
    }

    static rotation_x(radians: number): Matrix4x4 {
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix4x4([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
    }

    static rotation_y(radians: number): Matrix4x4 {
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix4x4([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }

    static rotation_z(radians: number): Matrix4x4 {
        const c = Math.cos(radians);
        const s = Math.sin(radians);

        return new Matrix4x4([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    static scalation(sx: number, sy: number, sz: number): Matrix4x4 {
        return new Matrix4x4([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ]);
    }

    static projection(width: number, height: number, depth: number): Matrix4x4 {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return new Matrix4x4([
           2 / width, 0, 0, 0,
           0, -2 / height, 0, 0,
           0, 0, 2 / depth, 0,
          -1, 1, 0, 1,
        ]);
      }

    static multiplication(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
        const a00 = a.buffer[0 * 4 + 0];
        const a01 = a.buffer[0 * 4 + 1];
        const a02 = a.buffer[0 * 4 + 2];
        const a03 = a.buffer[0 * 4 + 3];
        const a10 = a.buffer[1 * 4 + 0];
        const a11 = a.buffer[1 * 4 + 1];
        const a12 = a.buffer[1 * 4 + 2];
        const a13 = a.buffer[1 * 4 + 3];
        const a20 = a.buffer[2 * 4 + 0];
        const a21 = a.buffer[2 * 4 + 1];
        const a22 = a.buffer[2 * 4 + 2];
        const a23 = a.buffer[2 * 4 + 3];
        const a30 = a.buffer[3 * 4 + 0];
        const a31 = a.buffer[3 * 4 + 1];
        const a32 = a.buffer[3 * 4 + 2];
        const a33 = a.buffer[3 * 4 + 3];

        const b00 = b.buffer[0 * 4 + 0];
        const b01 = b.buffer[0 * 4 + 1];
        const b02 = b.buffer[0 * 4 + 2];
        const b03 = b.buffer[0 * 4 + 3];
        const b10 = b.buffer[1 * 4 + 0];
        const b11 = b.buffer[1 * 4 + 1];
        const b12 = b.buffer[1 * 4 + 2];
        const b13 = b.buffer[1 * 4 + 3];
        const b20 = b.buffer[2 * 4 + 0];
        const b21 = b.buffer[2 * 4 + 1];
        const b22 = b.buffer[2 * 4 + 2];
        const b23 = b.buffer[2 * 4 + 3];
        const b30 = b.buffer[3 * 4 + 0];
        const b31 = b.buffer[3 * 4 + 1];
        const b32 = b.buffer[3 * 4 + 2];
        const b33 = b.buffer[3 * 4 + 3];

        return new Matrix4x4([
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
          ]);
    }
}