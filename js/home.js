// Description: A WebGL-based ripple effect header for a webpage.


(function(gl, w, h) {
    const c = gl.canvas;
    const mouse = { x: 0, y: 0, down: 0 };

    const container = document.getElementById('rippleHeader');
    container.appendChild(c);

    function updateMousePosition(x, y) {
        const rect = c.getBoundingClientRect();
        mouse.x = x - rect.left;
        mouse.y = y - rect.top;
    }
    
    c.addEventListener('mousedown', () => { mouse.down = 1; }, false);
    c.addEventListener('mouseup', () => { mouse.down = 0; }, false);
    c.addEventListener('mousemove', e => {
        updateMousePosition(e.clientX, e.clientY);
    }, false);
    c.addEventListener('mouseout', () => { mouse.down = 0; }, false);
    
    // ✅ Touch support for mobile
    c.addEventListener('touchstart', e => {
        mouse.down = 1;
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
    }, false);
    
    c.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        updateMousePosition(touch.clientX, touch.clientY);
    }, false);
    
    c.addEventListener('touchend', () => {
        mouse.down = 0;
    }, false);
    
    c.addEventListener('mouseout', () => mouse.down = 0);

    function resizeCanvas() {
        c.width = container.offsetWidth;
        c.height = container.offsetHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    c.style = "width:100%; height:100%; display:block;";

    let t = 0;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const program = gl.createProgram();
    const vshader = gl.createShader(gl.VERTEX_SHADER);
    const fshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vshader, `
        precision lowp float;
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `);
    gl.compileShader(vshader);
    gl.shaderSource(fshader, `
        precision mediump float;
        uniform float time;
        uniform vec4 mouse;
        uniform vec2 resolution;
        #define TAU 6.28318530718
        #define MAX_ITER 5

        void main( void ) {
            float t = time * .5+23.0;
            vec2 uv = gl_FragCoord.xy / resolution;
            vec2 p = mod(uv*TAU, TAU)-250.0;
            vec2 i = vec2(p);
            float c = 1.0;
            float inten = .005;

            for (int n = 0; n < MAX_ITER; n++) {
                float t = t * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten), p.y / (cos(i.y+t)/inten)));
            }

            c /= float(MAX_ITER);
            c = 1.17 - pow(c, 1.4);
            vec3 color = vec3(pow(abs(c), 8.0));
            color = clamp(color + vec3(0.0, 0.0, 0.06), 0.1, 1.0);
            float f = (mouse.z > 0.5 ? 0.2 : 0.01) / length(uv - (vec2(mouse.x, mouse.y)));
            gl_FragColor = vec4(color + f, 1.0);
        }
    `);
    gl.compileShader(fshader);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    (function renderLoop(){
        gl.uniform1f(gl.getUniformLocation(program,"time"), t);
        gl.uniform2f(gl.getUniformLocation(program,"resolution"), c.width, c.height);
        gl.uniform4f(gl.getUniformLocation(program,"mouse"), mouse.x / c.width, 1 - mouse.y / c.height, mouse.down, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        t += 0.016;
        requestAnimationFrame(renderLoop);
    })();

})(document.createElement("canvas").getContext("webgl", { preserveDrawingBuffer: true }), 0, 0);

