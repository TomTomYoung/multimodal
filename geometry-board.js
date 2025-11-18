// geometry-board.js
// Manages canvas drawing and entity state

class GeometryBoard {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Camera state
    this.camera = {
      eye: { x: 0, y: 5, z: 10 },
      target: { x: 0, y: 0, z: 0 },
      up: { x: 0, y: 1, z: 0 },
      fovDeg: 45,
      projection: "perspective"
    };

    // Entities on canvas
    this.entities = [];
    
    // Interaction state
    this.selectedEntity = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };

    // Setup event handlers
    this.setupEvents();
    
    // Initial draw
    this.redraw();
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  getMousePosition(evt) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // Convert 3D world position to 2D canvas position
  worldToCanvas(pos) {
    // Simple orthographic-like projection
    // Scale factor for visualization
    const scale = 40;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    return {
      x: centerX + pos.x * scale,
      y: centerY - pos.z * scale
    };
  }

  // Convert canvas position to 3D world position
  canvasToWorld(canvasPos) {
    const scale = 40;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    return {
      x: (canvasPos.x - centerX) / scale,
      y: 0,
      z: -(canvasPos.y - centerY) / scale
    };
  }

  onMouseDown(evt) {
    const mousePos = this.getMousePosition(evt);
    
    // Check if clicking on an existing entity
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      if (ent.kind === "character") {
        const canvasPos = this.worldToCanvas(ent.meta.position);
        const dx = mousePos.x - canvasPos.x;
        const dy = mousePos.y - canvasPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 30) {
          this.selectedEntity = ent;
          this.isDragging = true;
          this.dragOffset = {
            x: mousePos.x - canvasPos.x,
            y: mousePos.y - canvasPos.y
          };
          this.redraw();
          return;
        }
      }
    }
  }

  onMouseMove(evt) {
    if (this.isDragging && this.selectedEntity) {
      const mousePos = this.getMousePosition(evt);
      const worldPos = this.canvasToWorld({
        x: mousePos.x - this.dragOffset.x,
        y: mousePos.y - this.dragOffset.y
      });
      
      this.selectedEntity.meta.position = worldPos;
      this.redraw();
    }
  }

  onMouseUp(evt) {
    this.isDragging = false;
  }

  redraw() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    this.drawGrid();

    // Draw entities
    this.entities.forEach(ent => {
      if (ent.kind === "character") {
        this.drawCharacter(ent);
      } else if (ent.kind === "guide") {
        this.drawGuide(ent);
      }
    });

    // Draw origin
    ctx.fillStyle = '#ff5555';
    const origin = this.worldToCanvas({ x: 0, y: 0, z: 0 });
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGrid() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const gridSize = 40;

    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = centerX % gridSize; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = centerY % gridSize; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Z axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
  }

  drawCharacter(ent) {
    const ctx = this.ctx;
    const canvasPos = this.worldToCanvas(ent.meta.position);
    const isSelected = this.selectedEntity === ent;

    // Draw character as a circle with label
    ctx.strokeStyle = isSelected ? '#ffaa00' : '#4fc3f7';
    ctx.fillStyle = isSelected ? 'rgba(255,170,0,0.2)' : 'rgba(79,195,247,0.2)';
    ctx.lineWidth = isSelected ? 3 : 2;

    ctx.beginPath();
    ctx.arc(canvasPos.x, canvasPos.y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw direction indicator
    const angle = ent.meta.rotation.y * Math.PI / 180;
    const dirX = Math.sin(angle) * 20;
    const dirY = -Math.cos(angle) * 20;
    
    ctx.beginPath();
    ctx.moveTo(canvasPos.x, canvasPos.y);
    ctx.lineTo(canvasPos.x + dirX, canvasPos.y + dirY);
    ctx.stroke();

    // Draw label
    ctx.fillStyle = isSelected ? '#ffaa00' : '#4fc3f7';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ent.meta.label, canvasPos.x, canvasPos.y - 35);
    
    // Draw position info
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    const posText = `(${ent.meta.position.x.toFixed(1)}, ${ent.meta.position.z.toFixed(1)})`;
    ctx.fillText(posText, canvasPos.x, canvasPos.y + 45);
  }

  drawGuide(ent) {
    const ctx = this.ctx;
    const p1 = this.worldToCanvas(ent.meta.p1);
    const p2 = this.worldToCanvas(ent.meta.p2);

    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }

  getCanvasState() {
    return {
      camera: {
        eye: { ...this.camera.eye },
        target: { ...this.camera.target },
        up: { ...this.camera.up },
        fovDeg: this.camera.fovDeg,
        projection: this.camera.projection
      },
      entities: this.entities.map(ent => ({
        id: ent.id,
        kind: ent.kind,
        meta: JSON.parse(JSON.stringify(ent.meta))
      }))
    };
  }

  applyCanvasState(state) {
    this.camera.eye = { ...state.camera.eye };
    this.camera.target = { ...state.camera.target };
    this.camera.up = { ...state.camera.up };
    this.camera.fovDeg = state.camera.fovDeg;
    this.camera.projection = state.camera.projection;

    this.entities = state.entities.map(e => ({
      id: e.id,
      kind: e.kind,
      meta: JSON.parse(JSON.stringify(e.meta))
    }));

    this.redraw();
  }

  setCameraPreset(preset) {
    if (preset === 'overhead') {
      this.camera.eye = { x: 0, y: 15, z: 0.1 };
      this.camera.target = { x: 0, y: 0, z: 0 };
      this.camera.fovDeg = 60;
    } else if (preset === 'eyelevel') {
      this.camera.eye = { x: 0, y: 1.6, z: 8 };
      this.camera.target = { x: 0, y: 0, z: 0 };
      this.camera.fovDeg = 45;
    }
    
    this.redraw();
  }
}

// Export to window
window.GeometryBoard = GeometryBoard;
