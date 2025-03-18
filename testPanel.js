let shapeSize = 50;
let shapeRotation = 0;
let shapeColor;
let scaleX = 1;
let scaleY = 1;
let hCopies = 1;
let vCopies = 1;
let spacing = 100;
let currentShape = 'star';

// 动画控制变量
let autoRotateSpeed = 0;
let moveSpeed = 0;
let moveRange = 100;
let positions = [];
let targetPositions = [];

function setup() {
    const canvasWidth = min(1200, window.innerWidth - 340);
    const canvasHeight = 600;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-wrapper');
    shapeColor = color(255, 255, 255);
    
    // 初始化位置数组
    updatePositions();
    
    // 设置形状选择按钮事件
    document.querySelectorAll('.shape-option').forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.shape-option').forEach(btn => {
                btn.classList.remove('active');
            });
            // 添加当前按钮的active类
            this.classList.add('active');
            // 更新当前形状
            currentShape = this.dataset.shape;
        });
    });
    
    // 设置滑块事件监听器
    document.getElementById('size-slider').addEventListener('input', function(e) {
        shapeSize = parseInt(e.target.value);
        document.getElementById('size-value').textContent = shapeSize;
    });
    
    document.getElementById('rotation-slider').addEventListener('input', function(e) {
        shapeRotation = parseInt(e.target.value);
        document.getElementById('rotation-value').textContent = shapeRotation;
    });

    document.getElementById('scaleX-slider').addEventListener('input', function(e) {
        scaleX = parseFloat(e.target.value);
        document.getElementById('scaleX-value').textContent = scaleX.toFixed(1);
    });

    document.getElementById('scaleY-slider').addEventListener('input', function(e) {
        scaleY = parseFloat(e.target.value);
        document.getElementById('scaleY-value').textContent = scaleY.toFixed(1);
    });
    
    document.getElementById('red-slider').addEventListener('input', function(e) {
        const r = parseInt(e.target.value);
        document.getElementById('red-value').textContent = r;
        shapeColor = color(r, green(shapeColor), blue(shapeColor));
    });
    
    document.getElementById('green-slider').addEventListener('input', function(e) {
        const g = parseInt(e.target.value);
        document.getElementById('green-value').textContent = g;
        shapeColor = color(red(shapeColor), g, blue(shapeColor));
    });
    
    document.getElementById('blue-slider').addEventListener('input', function(e) {
        const b = parseInt(e.target.value);
        document.getElementById('blue-value').textContent = b;
        shapeColor = color(red(shapeColor), green(shapeColor), b);
    });

    // 复制控制滑块
    document.getElementById('h-copies-slider').addEventListener('input', function(e) {
        hCopies = parseInt(e.target.value);
        document.getElementById('h-copies-value').textContent = hCopies;
        updatePositions();
    });

    document.getElementById('v-copies-slider').addEventListener('input', function(e) {
        vCopies = parseInt(e.target.value);
        document.getElementById('v-copies-value').textContent = vCopies;
        updatePositions();
    });

    document.getElementById('spacing-slider').addEventListener('input', function(e) {
        spacing = parseInt(e.target.value);
        document.getElementById('spacing-value').textContent = spacing;
        updatePositions();
    });

    // 动画控制滑块
    document.getElementById('rotate-speed-slider').addEventListener('input', function(e) {
        autoRotateSpeed = parseFloat(e.target.value);
        document.getElementById('rotate-speed-value').textContent = autoRotateSpeed.toFixed(1);
    });

    document.getElementById('move-speed-slider').addEventListener('input', function(e) {
        moveSpeed = parseFloat(e.target.value);
        document.getElementById('move-speed-value').textContent = moveSpeed.toFixed(1);
    });

    document.getElementById('move-range-slider').addEventListener('input', function(e) {
        moveRange = parseInt(e.target.value);
        document.getElementById('move-range-value').textContent = moveRange;
        updateTargetPositions();
    });
}

function updatePositions() {
    const startX = width/2 - (hCopies - 1) * spacing/2;
    const startY = height/2 - (vCopies - 1) * spacing/2;
    
    positions = [];
    for (let i = 0; i < hCopies; i++) {
        for (let j = 0; j < vCopies; j++) {
            positions.push({
                x: startX + i * spacing,
                y: startY + j * spacing
            });
        }
    }
    updateTargetPositions();
}

function updateTargetPositions() {
    targetPositions = positions.map(pos => ({
        x: pos.x + random(-moveRange, moveRange),
        y: pos.y + random(-moveRange, moveRange)
    }));
}

function draw() {
    background(30);
    
    // 绘制网格
    stroke(50);
    strokeWeight(1);
    for (let i = 0; i < width; i += 20) {
        line(i, 0, i, height);
    }
    for (let i = 0; i < height; i += 20) {
        line(0, i, width, i);
    }
    
    // 更新自动旋转
    if (autoRotateSpeed > 0) {
        shapeRotation += autoRotateSpeed;
        if (shapeRotation >= 360) shapeRotation -= 360;
        document.getElementById('rotation-value').textContent = Math.round(shapeRotation);
    }
    
    // 更新随机移动
    if (moveSpeed > 0) {
        for (let i = 0; i < positions.length; i++) {
            // 向目标位置移动
            positions[i].x += (targetPositions[i].x - positions[i].x) * moveSpeed * 0.01;
            positions[i].y += (targetPositions[i].y - positions[i].y) * moveSpeed * 0.01;
            
            // 如果接近目标位置，设置新的目标位置
            if (abs(positions[i].x - targetPositions[i].x) < 1 && 
                abs(positions[i].y - targetPositions[i].y) < 1) {
                targetPositions[i] = {
                    x: positions[i].x + random(-moveRange, moveRange),
                    y: positions[i].y + random(-moveRange, moveRange)
                };
            }
        }
    }
    
    // 绘制所有图形
    for (let i = 0; i < positions.length; i++) {
        drawShape({
            size: shapeSize,
            rotation: shapeRotation,
            color: shapeColor,
            scaleX: scaleX,
            scaleY: scaleY,
            x: positions[i].x,
            y: positions[i].y
        });
    }
}

function drawShape(shape) {
    push();
    translate(shape.x, shape.y);
    rotate(radians(shape.rotation));
    scale(shape.scaleX, shape.scaleY);
    
    fill(shape.color);
    stroke(255);
    strokeWeight(2);
    
    switch(currentShape) {
        case 'star':
            drawStar(shape.size);
            break;
        case 'circle':
            circle(0, 0, shape.size);
            break;
        case 'square':
            rect(-shape.size/2, -shape.size/2, shape.size, shape.size);
            break;
        case 'triangle':
            drawTriangle(shape.size);
            break;
        case 'diamond':
            drawDiamond(shape.size);
            break;
    }
    
    pop();
}

function drawStar(size) {
    beginShape();
    for (let i = 0; i < 5; i++) {
        const angle = (i * TWO_PI) / 5;
        const x = cos(angle) * size;
        const y = sin(angle) * size;
        vertex(x, y);
    }
    endShape(CLOSE);
    
    beginShape();
    for (let i = 0; i < 5; i++) {
        const angle = (i * TWO_PI) / 5 + PI / 5;
        const x = cos(angle) * (size * 0.4);
        const y = sin(angle) * (size * 0.4);
        vertex(x, y);
    }
    endShape(CLOSE);
}

function drawTriangle(size) {
    beginShape();
    for (let i = 0; i < 3; i++) {
        const angle = (i * TWO_PI) / 3 - PI/6;
        const x = cos(angle) * size;
        const y = sin(angle) * size;
        vertex(x, y);
    }
    endShape(CLOSE);
}

function drawDiamond(size) {
    beginShape();
    vertex(0, -size/2);
    vertex(size/2, 0);
    vertex(0, size/2);
    vertex(-size/2, 0);
    endShape(CLOSE);
} 