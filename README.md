# Multimodal Scene Designer - PoC

A web-based toolkit that connects **narrative structure**, **scene geometry**, and **image generation prompts** via a shared JSON/AST representation.

## Features

- 📖 **Narrative → Geometry**: Define story events and derive scene compositions automatically
- 🎨 **Geometry Canvas**: Visually arrange characters and camera positions
- 🤖 **Auto Prompt Generation**: Generate detailed image prompts from scene geometry
- 💾 **Single JSON Format**: Store everything (characters, world, scenes, geometry, prompts) in one file

## Quick Start

1. **Open the application**
   ```
   Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge)
   No build process required!
   ```

2. **Explore the interface**
   - **Left Panel**: Scene information and camera presets
   - **Center Canvas**: Interactive geometry editor (drag characters to move them)
   - **Right Panel**: Generated prompt and tags

3. **Try it out**
   - Click on characters in the canvas to drag them around
   - Use the camera preset buttons (Overhead/Eye Level) to change perspective
   - Click "Update Prompt" to regenerate the image prompt based on current layout

## How It Works

### Data Flow

```
Narrative Graph → Geometry Composition → Image Prompt
     ↓                    ↓                    ↓
  Events             Camera + Objects      Text Prompt
                          ↕
                    Canvas Editor
```

### Core Components

1. **IR (Intermediate Representation)**
   - `Project` → contains characters, world, scenes
   - `Scene` → contains narrative, geometry, prompt
   - `GeometryComposition` → camera + objects + guides

2. **Logic Modules**
   - `prompt-core.js` → derives tags from geometry/characters/world
   - `narrative-geometry.js` → generates geometry from narrative presets
   - `geometry-adapter.js` → converts between canvas state and IR

3. **UI**
   - `geometry-board.js` → canvas management and visualization
   - `main.js` → application integration

## File Structure

```
multimodal-designer/
├── index.html              # Main HTML with UI layout
├── project-data.js         # Sample project JSON
├── geometry-adapter.js     # Canvas ↔ Geometry conversion
├── prompt-core.js          # Prompt generation logic
├── narrative-geometry.js   # Composition presets
├── geometry-board.js       # Canvas management
└── main.js                 # Application initialization
```

## Example Output

With the default scene (rooftop confrontation), the system generates prompts like:

```
a late teens female, with blue short hair, wearing school uniform, 
holding a katana, drawing a sword, hero on the left, enemy on the right, 
face-to-face confrontation, eye-level shot, medium shot, standard lens, 
night city, neon lights, light rain, urban fantasy atmosphere
```

## Customization

### Modifying Project Data

Edit `project-data.js` to change:
- Characters (appearance, role, abilities)
- World setting (atmosphere, genre)
- Scene geometry (positions, camera angles)

### Adding Composition Presets

Add new presets in `narrative-geometry.js`:
```javascript
function makeCustomGeometry(scene, project) {
  return {
    camera: { ... },
    objects: [ ... ],
    guides: []
  };
}
```

## Future Enhancements

- [ ] Multiple scene support
- [ ] Narrative graph visual editor
- [ ] More sophisticated camera projection
- [ ] Export/import project files
- [ ] 3D preview with Three.js
- [ ] Composition guide overlays (rule of thirds, golden ratio)

## Technical Details

- **No dependencies**: Pure HTML5 Canvas + Vanilla JavaScript
- **Browser compatibility**: Modern browsers with Canvas API support
- **Data format**: JSON-based intermediate representation
- **Architecture**: Layered (IR → Logic → UI)

## License

MIT

## Credits

Based on the multimodal design methodology combining narrative structure, geometric composition, and generative AI prompting.
