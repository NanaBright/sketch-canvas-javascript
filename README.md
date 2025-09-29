# 🎨 Creative Coding Museum

A curated collection of generative art and creative coding experiments built with JavaScript and Canvas-Sketch. Experience algorithmic creativity through an elegant, museum-style interface.

![Creative Coding Museum](https://img.shields.io/badge/Creative%20Coding-Museum-8338ec?style=for-the-badge&logo=javascript)

## ✨ Features

- **Museum Gallery Interface**: Browse artworks in a sleek, masonry-style layout
- **Interactive Sketch Viewer**: Detailed view with controls and source code preview
- **Live Sketches**: Real-time generative art with animation and interactivity
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Educational Content**: Learn about techniques and algorithms behind each piece

## 🎭 Gallery Highlights

### Current Collection

1. **Geometric Grid System** - Minimalist grid-based compositions
2. **Radial Particle System** - Circular arrangements with dynamic scaling
3. **Agent-Based Network** - Autonomous agents creating dynamic connections
4. **Interactive Noise Field** - Real-time Perlin noise manipulation
5. **Generative Typography** - ASCII art through pixel sampling
6. **Recursive Fractal Tree** - Self-similar branching structures
7. **Cellular Automata** - Conway's Game of Life simulation
8. **Wave Interference** - Physics-based wave pattern visualization

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 7+
- Modern web browser with canvas support

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd sketch-canvas-javascript
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Canvas-Sketch CLI globally**:
   ```bash
   npm install -g canvas-sketch-cli
   ```

### Running the Museum

#### Option 1: Local Web Server (Recommended)
```bash
npm start
# or
npm run serve
```
Then visit `http://localhost:3000` in your browser.

#### Option 2: Direct File Access
Simply open `index.html` in your web browser.

### Running Individual Sketches

#### Using NPM Scripts
```bash
npm run sketch:01    # Geometric Grid
npm run sketch:02    # Radial Particles
npm run sketch:03    # Agent Network
npm run sketch:04    # Noise Field
npm run sketch:05    # Typography
npm run sketch:fractal    # Fractal Tree
npm run sketch:cellular   # Cellular Automata
npm run sketch:waves      # Wave Interference
```

#### Using Canvas-Sketch CLI Directly
```bash
canvas-sketch sketch-02.js --open
canvas-sketch fractal-tree.js --open
canvas-sketch wave-interference.js --open
```

## 🎮 Controls & Interactions

### Universal Controls
- **Cmd/Ctrl + S**: Export current sketch as PNG
- **Spacebar**: Pause/Resume animation (where applicable)
- **F**: Toggle fullscreen mode

### Sketch-Specific Controls

#### Interactive Noise Field (`sketch-04.js`)
- Uses Tweakpane for real-time parameter adjustment
- Modify grid size, noise frequency, animation speed

#### Typography Art (`sketch-05.js`)
- **Any Key**: Change the displayed letter
- Real-time ASCII conversion

#### Cellular Automata (`cellular-automata.js`)
- **R**: Reset with random population
- **C**: Clear grid
- **G**: Add glider patterns
- **O**: Add oscillators
- **Space**: Pause/Resume

#### Wave Interference (`wave-interference.js`)
- **R**: Randomize wave sources
- **C**: Cycle color modes
- **↑/↓**: Adjust frequency
- **←/→**: Adjust speed
- **+/-**: Add/remove sources
- **Mouse**: Drag sources to move them

## 🛠 Technical Details

### Built With
- **Canvas-Sketch**: Framework for generative artwork
- **Canvas-Sketch-Util**: Utility functions for math and randomization
- **Tweakpane**: Real-time parameter control
- **Vanilla JavaScript**: No heavy frameworks, pure performance
- **HTML5 Canvas**: Hardware-accelerated 2D graphics

### Project Structure
```
sketch-canvas-javascript/
├── index.html              # Museum gallery page
├── sketch-viewer.html      # Individual sketch viewer
├── serve.js               # Local development server
├── package.json           # Project configuration
├── sketch-0..js          # Grid system sketch
├── sketch-02.js          # Radial particles
├── sketch-03.js          # Agent network
├── sketch-04.js          # Interactive noise field
├── sketch-05.js          # Typography art
├── sketch-06.js          # Animated typography
├── fractal-tree.js       # Recursive fractal tree
├── cellular-automata.js  # Game of Life
├── wave-interference.js  # Wave physics
└── output/               # Exported images
```

## 🎨 Creating New Sketches

### Basic Template
```javascript
const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
  animate: true // Set to false for static sketches
};

const sketch = () => {
  return ({ context, width, height, time }) => {
    // Clear canvas
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    
    // Your creative code here
    
  };
};

canvasSketch(sketch, settings);
```

### Adding to the Museum

1. Create your sketch file in the root directory
2. Add metadata to `sketch-viewer.html` in the `sketchData` object
3. Create a preview function in the viewer
4. Add a card to `index.html` gallery section

## 📸 Exporting Artwork

### High-Quality Exports
Press `Cmd+S` (Mac) or `Ctrl+S` (Windows) while viewing any sketch to export a high-resolution PNG to your Downloads folder.

### Print-Ready Formats
Modify sketch settings for print:
```javascript
const settings = {
  dimensions: 'a4',        // Standard paper size
  pixelsPerInch: 300,      // Print resolution
  units: 'in'              // Inch measurements
};
```

## 🎯 Learning Objectives

Each sketch demonstrates specific creative coding concepts:

- **Mathematical Visualization**: Transform equations into visual art
- **Algorithmic Composition**: Use rules to create complex patterns
- **Emergent Behavior**: Simple rules creating complex systems
- **Interactive Design**: User input driving visual output
- **Procedural Generation**: Creating infinite variations
- **Physics Simulation**: Real-world phenomena in digital form

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-sketch`)
3. Add your sketch and update the gallery
4. Test locally using `npm start`
5. Commit your changes (`git commit -am 'Add amazing sketch'`)
6. Push to the branch (`git push origin feature/amazing-sketch`)
7. Open a Pull Request

## 🐛 Troubleshooting

### Canvas-Sketch CLI Not Found
```bash
npm install -g canvas-sketch-cli
```

### Module Not Found Errors
```bash
npm install
```

### Sketches Not Loading
- Ensure you're running from the project directory
- Check that all dependencies are installed
- Try refreshing the browser cache

### Performance Issues
- Lower the resolution in sketch settings
- Reduce particle counts or grid sizes
- Close other resource-intensive applications

## 📚 Resources

- [Canvas-Sketch Documentation](https://github.com/mattdesl/canvas-sketch)
- [Creative Coding Resources](https://github.com/terkelg/awesome-creative-coding)
- [Math for Programmers](https://p5js.org/learn/)
- [Generative Art Theory](https://www.artnome.com/news/2018/8/8/why-love-generative-art)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- [Matt DesLauriers](https://github.com/mattdesl) for Canvas-Sketch
- The creative coding community for inspiration
- All the mathematicians and artists who paved the way

---

**Happy Creative Coding!** 🎨✨

*Explore, experiment, and create algorithmic art that bridges the gap between mathematics and beauty.*