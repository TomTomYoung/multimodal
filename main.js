// main.js
// Main application initialization and event wiring

let project = null;
let currentScene = null;
let board = null;

// Initialize application
function init() {
  // Load project data
  project = window.defaultProject;
  currentScene = project.scenes[0];

  // Initialize geometry board
  const canvas = document.getElementById('geomCanvas');
  board = new GeometryBoard(canvas);

  // Load initial scene geometry into canvas
  const initialState = geometryToCanvasState(currentScene.geometry, project);
  board.applyCanvasState(initialState);

  // Update UI
  updateSceneInfo();
  updateNarrativeInfo();
  updateCharacterList();

  // Initial prompt generation
  updatePrompt();

  // Setup event handlers
  document.getElementById('btnUpdatePrompt').addEventListener('click', updatePrompt);
  document.getElementById('btnUsePreset').addEventListener('click', applyNarrativePreset);
}

function updateSceneInfo() {
  document.getElementById('sceneName').textContent = currentScene.name;
}

function updateNarrativeInfo() {
  const narrativeInfoEl = document.getElementById('narrativeInfo');
  const focusNodeInfoEl = document.getElementById('focusNodeInfo');
  
  let html = '';
  
  currentScene.narrativeGraph.nodes.forEach(node => {
    const isFocused = node.id === currentScene.focusNodeId;
    const mark = isFocused ? '●' : '○';
    const className = isFocused ? 'node-item focused' : 'node-item';
    
    html += `<div class="${className}">`;
    html += `${mark} <strong>${node.label}</strong><br>`;
    html += `<span style="color: #888; font-size: 10px;">`;
    html += `Type: ${node.type}`;
    if (node.compositionPreset && node.compositionPreset !== 'none') {
      html += ` | Preset: ${node.compositionPreset}`;
    }
    html += `</span></div>`;
  });
  
  narrativeInfoEl.innerHTML = html;
  
  // Update focus node info
  const focusNode = currentScene.narrativeGraph.nodes.find(n => n.id === currentScene.focusNodeId);
  if (focusNode) {
    focusNodeInfoEl.textContent = `${focusNode.id}: ${focusNode.label}`;
    if (focusNode.compositionPreset && focusNode.compositionPreset !== 'none') {
      focusNodeInfoEl.textContent += ` [${focusNode.compositionPreset}]`;
    }
  } else {
    focusNodeInfoEl.textContent = '(none)';
  }
}

function updateCharacterList() {
  const list = document.getElementById('characterList');
  let html = '';
  
  project.characters.forEach(ch => {
    html += '<div style="margin-bottom: 8px; padding: 8px; background: #1e1e1e; border-radius: 4px;">';
    html += '<strong>' + ch.name + '</strong><br>';
    html += '<span style="color: #888;">Role: ' + ch.role + '</span><br>';
    if (ch.visual.hairColor) {
      html += '<span style="color: #888;">Hair: ' + ch.visual.hairColor + ' ' + (ch.visual.hairStyle || '') + '</span>';
    }
    html += '</div>';
  });
  
  list.innerHTML = html;
}

function syncGeometryFromCanvas() {
  const state = board.getCanvasState();
  currentScene.geometry = canvasStateToGeometry(state, project);
}

function updatePrompt() {
  // Sync current canvas state to geometry
  syncGeometryFromCanvas();
  
  // Generate new prompt
  const newPrompt = updatePromptFromScene(currentScene, project);
  currentScene.prompt = newPrompt;

  // Update UI
  document.getElementById('promptRaw').value = newPrompt.rawPrompt || '';
  
  const tagsDisplay = {
    mainSubject: newPrompt.mainSubject,
    compositionTags: newPrompt.compositionTags,
    actionTags: newPrompt.actionTags,
    cameraTags: newPrompt.cameraTags,
    environmentTags: newPrompt.environmentTags,
    styleTags: newPrompt.styleTags
  };
  
  document.getElementById('promptTags').textContent = JSON.stringify(tagsDisplay, null, 2);
  
  // Update debug geometry display
  document.getElementById('geomDebug').textContent = JSON.stringify(currentScene.geometry, null, 2);
}

function applyNarrativePreset() {
  // Apply narrative preset to generate geometry
  const updatedGeom = updateGeometryFromNarrative(currentScene, project);
  currentScene.geometry = updatedGeom;
  
  // Apply to canvas
  const state = geometryToCanvasState(currentScene.geometry, project);
  board.applyCanvasState(state);
  
  // Update prompt automatically
  updatePrompt();
}

function setCameraPreset(preset) {
  board.setCameraPreset(preset);
  
  // Auto-update prompt when camera changes
  setTimeout(() => {
    updatePrompt();
  }, 100);
}

// Make functions available globally for onclick handlers
window.setCameraPreset = setCameraPreset;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
