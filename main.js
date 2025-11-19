// main.js
// Main application initialization and event wiring

let project = null;
let currentScene = null;
let board = null;
let sceneSelectEl = null;

// Initialize application
function init() {
  // Load project data
  project = window.defaultProject;

  // Initialize geometry board
  const canvas = document.getElementById('geomCanvas');
  board = new GeometryBoard(canvas);

  // Setup scene selector
  sceneSelectEl = document.getElementById('sceneSelect');
  setupSceneSelector();

  // Load initial scene geometry and prompt
  const initialScene = project.scenes[0];
  if (initialScene) {
    loadScene(initialScene.id);
  }

  // Setup event handlers
  document.getElementById('btnUpdatePrompt').addEventListener('click', updatePrompt);
  document.getElementById('btnUsePreset').addEventListener('click', applyNarrativePreset);
}

function setupSceneSelector() {
  if (!sceneSelectEl || !project.scenes) return;

  sceneSelectEl.innerHTML = project.scenes
    .map(scene => `<option value="${scene.id}">${scene.name}</option>`)
    .join('');

  sceneSelectEl.addEventListener('change', (event) => {
    loadScene(event.target.value);
  });
}

function loadScene(sceneId) {
  const nextScene = project.scenes.find(scene => scene.id === sceneId);
  if (!nextScene) return;

  currentScene = nextScene;
  if (sceneSelectEl && sceneSelectEl.value !== sceneId) {
    sceneSelectEl.value = sceneId;
  }

  applySceneGeometryToCanvas(currentScene);
  updateSceneInfo();
  updateNarrativeInfo();
  updateCharacterList();
  refreshPromptFromScene(currentScene);
}

function applySceneGeometryToCanvas(scene) {
  if (!scene || !scene.geometry) return;
  const state = geometryToCanvasState(scene.geometry, project);
  board.applyCanvasState(state);
  document.getElementById('geomDebug').textContent = JSON.stringify(scene.geometry, null, 2);
}

function refreshPromptFromScene(scene) {
  if (!scene) return;
  const newPrompt = updatePromptFromScene(scene, project);
  scene.prompt = newPrompt;
  updatePromptUI(newPrompt);
}

function updatePromptUI(prompt) {
  if (!prompt) {
    document.getElementById('promptRaw').value = '';
    document.getElementById('promptTags').textContent = '';
    return;
  }
  document.getElementById('promptRaw').value = prompt.rawPrompt || '';

  const tagsDisplay = {
    mainSubject: prompt.mainSubject,
    compositionTags: prompt.compositionTags,
    actionTags: prompt.actionTags,
    cameraTags: prompt.cameraTags,
    environmentTags: prompt.environmentTags,
    styleTags: prompt.styleTags
  };

  document.getElementById('promptTags').textContent = JSON.stringify(tagsDisplay, null, 2);
}

function updateSceneInfo() {
  const sceneNameEl = document.getElementById('sceneName');
  sceneNameEl.textContent = currentScene ? currentScene.name : '(no scene)';
}

function updateNarrativeInfo() {
  if (!currentScene) return;
  const narrativeInfoEl = document.getElementById('narrativeInfo');
  const focusNodeInfoEl = document.getElementById('focusNodeInfo');
  
  let html = '';
  
  const nodes = (currentScene.narrativeGraph && currentScene.narrativeGraph.nodes) || [];
  nodes.forEach(node => {
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
  const focusNode = nodes.find(n => n.id === currentScene.focusNodeId);
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

  (project.characters || []).forEach(ch => {
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
  if (!board || !currentScene) return;
  const state = board.getCanvasState();
  currentScene.geometry = canvasStateToGeometry(state, project);
}

function updatePrompt() {
  if (!currentScene) return;
  // Sync current canvas state to geometry
  syncGeometryFromCanvas();

  // Generate new prompt and update UI
  refreshPromptFromScene(currentScene);

  // Update debug geometry display
  document.getElementById('geomDebug').textContent = JSON.stringify(currentScene.geometry, null, 2);
}

function applyNarrativePreset() {
  if (!currentScene) return;
  // Apply narrative preset to generate geometry
  const updatedGeom = updateGeometryFromNarrative(currentScene, project);
  currentScene.geometry = updatedGeom;

  // Apply to canvas and refresh prompt automatically
  applySceneGeometryToCanvas(currentScene);
  refreshPromptFromScene(currentScene);
}

function setCameraPreset(preset) {
  if (!board) return;
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
