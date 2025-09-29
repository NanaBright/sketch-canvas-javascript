const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  depth: 8,
  branchAngle: 25,
  branchLength: 0.7,
  initialLength: 200,
  windStrength: 0.02,
  leafColor: '#4ade80',
  branchColor: '#8b4513',
  animate: true
};

const sketch = () => {
  return ({ context, width, height, time }) => {
    context.fillStyle = '#0f0f23';
    context.fillRect(0, 0, width, height);

    // Start drawing from bottom center
    const startX = width * 0.5;
    const startY = height * 0.9;
    const startAngle = -Math.PI / 2; // Point upward

    context.save();
    drawBranch(
      context,
      startX,
      startY,
      params.initialLength,
      startAngle,
      params.depth,
      time
    );
    context.restore();
  };
};

function drawBranch(ctx, x, y, length, angle, depth, time) {
  if (depth === 0) return;

  // Add subtle wind animation
  const windOffset = params.animate ?
    Math.sin(time * 2 + angle * 3) * params.windStrength * depth : 0;
  const animatedAngle = angle + windOffset;

  // Calculate end point of current branch
  const endX = x + Math.cos(animatedAngle) * length;
  const endY = y + Math.sin(animatedAngle) * length;

  // Draw the branch
  ctx.strokeStyle = params.branchColor;
  ctx.lineWidth = depth * 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // If this is a leaf (end branch), draw a small circle
  if (depth === 1) {
    ctx.fillStyle = params.leafColor;
    ctx.beginPath();
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Recursively draw child branches
  if (depth > 1) {
    const newLength = length * params.branchLength;
    const angleVariation = math.degToRad(params.branchAngle);

    // Add some randomness to make it more organic
    const randomFactor = random.range(0.8, 1.2);
    const leftAngle = animatedAngle - angleVariation * randomFactor;
    const rightAngle = animatedAngle + angleVariation * randomFactor;

    // Draw left branch
    drawBranch(
      ctx,
      endX,
      endY,
      newLength * random.range(0.8, 1.0),
      leftAngle,
      depth - 1,
      time
    );

    // Draw right branch
    drawBranch(
      ctx,
      endX,
      endY,
      newLength * random.range(0.8, 1.0),
      rightAngle,
      depth - 1,
      time
    );

    // Occasionally add a third branch for more complexity
    if (depth > 3 && Math.random() > 0.7) {
      const middleAngle = animatedAngle + random.range(-0.3, 0.3);
      drawBranch(
        ctx,
        endX,
        endY,
        newLength * 0.6,
        middleAngle,
        depth - 2,
        time
      );
    }
  }
}

canvasSketch(sketch, settings);
