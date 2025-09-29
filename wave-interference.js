const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  numSources: 4,
  amplitude: 80,
  frequency: 0.02,
  speed: 0.5,
  damping: 0.995,
  resolution: 2,
  colorMode: 'spectrum', // 'spectrum', 'monochrome', 'interference'
  showSources: true
};

let sources = [];

const sketch = ({ context, width, height }) => {
  // Initialize wave sources at random positions
  initializeSources(width, height);

  return ({ context, width, height, time }) => {
    context.fillStyle = '#000010';
    context.fillRect(0, 0, width, height);

    // Calculate and draw wave interference
    drawWaveField(context, width, height, time);

    // Draw source indicators
    if (params.showSources) {
      drawSources(context);
    }

    // Draw info
    drawInfo(context, time);
  };
};

function initializeSources(width, height) {
  sources = [];

  for (let i = 0; i < params.numSources; i++) {
    sources.push({
      x: Math.random() * width * 0.8 + width * 0.1,
      y: Math.random() * height * 0.8 + height * 0.1,
      phase: Math.random() * Math.PI * 2,
      amplitude: params.amplitude * (0.5 + Math.random() * 0.5),
      frequency: params.frequency * (0.8 + Math.random() * 0.4)
    });
  }
}

function drawWaveField(context, width, height, time) {
  const imageData = context.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x += params.resolution) {
    for (let y = 0; y < height; y += params.resolution) {
      let totalAmplitude = 0;
      let interference = 0;

      // Calculate wave contribution from each source
      for (let source of sources) {
        const distance = Math.sqrt(
          Math.pow(x - source.x, 2) +
          Math.pow(y - source.y, 2)
        );

        // Wave equation: A * sin(2π * f * (t - d/c) + φ)
        // Simplified: A * sin(ft - fd + φ) where c=1
        const wave = source.amplitude *
          Math.sin(
            source.frequency * time * params.speed -
            source.frequency * distance * 0.01 +
            source.phase
          );

        // Apply distance damping
        const damping = Math.pow(params.damping, distance * 0.1);
        totalAmplitude += wave * damping;
        interference += Math.abs(wave * damping);
      }

      // Normalize amplitude
      const normalizedAmp = math.clamp(totalAmplitude / params.amplitude, -1, 1);
      const intensity = Math.abs(normalizedAmp);

      // Calculate color based on mode
      let r, g, b;

      switch (params.colorMode) {
        case 'spectrum':
          // Rainbow spectrum based on phase
          const hue = (normalizedAmp + 1) * 180; // 0-360 degrees
          [r, g, b] = hslToRgb(hue, 80, intensity * 60 + 10);
          break;

        case 'interference':
          // Show constructive (warm) vs destructive (cool) interference
          if (normalizedAmp > 0) {
            r = Math.floor(intensity * 255);
            g = Math.floor(intensity * 100);
            b = 0;
          } else {
            r = 0;
            g = Math.floor(intensity * 100);
            b = Math.floor(intensity * 255);
          }
          break;

        case 'monochrome':
        default:
          const brightness = Math.floor(intensity * 255);
          r = g = b = brightness;
          break;
      }

      // Fill multiple pixels for resolution scaling
      for (let dx = 0; dx < params.resolution; dx++) {
        for (let dy = 0; dy < params.resolution; dy++) {
          const pixelX = x + dx;
          const pixelY = y + dy;

          if (pixelX < width && pixelY < height) {
            const index = (pixelY * width + pixelX) * 4;
            data[index] = r;     // Red
            data[index + 1] = g; // Green
            data[index + 2] = b; // Blue
            data[index + 3] = 255; // Alpha
          }
        }
      }
    }
  }

  context.putImageData(imageData, 0, 0);
}

function drawSources(context) {
  sources.forEach((source, index) => {
    // Draw source as pulsing circle
    context.save();

    const pulseSize = 8 + Math.sin(Date.now() * 0.003 + index) * 4;

    // Outer glow
    const gradient = context.createRadialGradient(
      source.x, source.y, 0,
      source.x, source.y, pulseSize * 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 245, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(source.x, source.y, pulseSize * 2, 0, Math.PI * 2);
    context.fill();

    // Inner core
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(source.x, source.y, pulseSize * 0.3, 0, Math.PI * 2);
    context.fill();

    // Source label
    context.fillStyle = '#ffffff';
    context.font = '12px monospace';
    context.textAlign = 'center';
    context.fillText(`S${index + 1}`, source.x, source.y - pulseSize * 2.5);

    context.restore();
  });
}

function drawInfo(context, time) {
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
  context.font = '14px monospace';
  context.textAlign = 'left';

  const info = [
    `Sources: ${params.numSources}`,
    `Frequency: ${params.frequency.toFixed(3)}`,
    `Speed: ${params.speed.toFixed(1)}`,
    `Mode: ${params.colorMode}`,
    '',
    'Controls:',
    'R - Randomize sources',
    'C - Change color mode',
    '↑/↓ - Adjust frequency',
    '←/→ - Adjust speed',
    '+/- - Add/remove sources'
  ];

  info.forEach((line, index) => {
    context.fillText(line, 20, 30 + index * 16);
  });
}

function hslToRgb(h, s, l) {
  h = h % 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  const canvas = document.querySelector('canvas');
  const rect = canvas.getBoundingClientRect();

  switch(e.key.toLowerCase()) {
    case 'r':
      initializeSources(canvas.width, canvas.height);
      break;
    case 'c':
      const modes = ['spectrum', 'monochrome', 'interference'];
      const currentIndex = modes.indexOf(params.colorMode);
      params.colorMode = modes[(currentIndex + 1) % modes.length];
      break;
    case 'arrowup':
      params.frequency = Math.min(params.frequency + 0.005, 0.1);
      break;
    case 'arrowdown':
      params.frequency = Math.max(params.frequency - 0.005, 0.001);
      break;
    case 'arrowright':
      params.speed = Math.min(params.speed + 0.1, 2.0);
      break;
    case 'arrowleft':
      params.speed = Math.max(params.speed - 0.1, 0.1);
      break;
    case '=':
    case '+':
      if (params.numSources < 8) {
        params.numSources++;
        sources.push({
          x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
          y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
          phase: Math.random() * Math.PI * 2,
          amplitude: params.amplitude * (0.5 + Math.random() * 0.5),
          frequency: params.frequency * (0.8 + Math.random() * 0.4)
        });
      }
      break;
    case '-':
    case '_':
      if (params.numSources > 1) {
        params.numSources--;
        sources.pop();
      }
      break;
    case 's':
      params.showSources = !params.showSources;
      break;
  }
});

// Mouse interaction to move sources
let dragIndex = -1;

document.addEventListener('mousedown', (e) => {
  const canvas = document.querySelector('canvas');
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // Check if mouse is over any source
  sources.forEach((source, index) => {
    const distance = Math.sqrt(
      Math.pow(mouseX - source.x, 2) +
      Math.pow(mouseY - source.y, 2)
    );

    if (distance < 20) {
      dragIndex = index;
    }
  });
});

document.addEventListener('mousemove', (e) => {
  if (dragIndex >= 0) {
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();
    sources[dragIndex].x = e.clientX - rect.left;
    sources[dragIndex].y = e.clientY - rect.top;
  }
});

document.addEventListener('mouseup', () => {
  dragIndex = -1;
});

console.log('Wave Interference Controls:');
console.log('R - Randomize source positions');
console.log('C - Cycle color modes');
console.log('↑/↓ - Adjust wave frequency');
console.log('←/→ - Adjust wave speed');
console.log('+/- - Add/remove wave sources');
console.log('S - Toggle source visibility');
console.log('Mouse - Drag sources to move them');

canvasSketch(sketch, settings);
