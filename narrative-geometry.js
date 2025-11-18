// narrative-geometry.js
// Generate geometry layouts from narrative presets

function resolveHeroAndEnemy(scene, project) {
  const hero = project.characters.find(c => c.role === "protagonist");
  const enemy = project.characters.find(c => c.role === "antagonist");

  const heroObj = {
    id: "obj-hero",
    type: "character",
    refId: hero && hero.id,
    label: (hero && hero.name) || "Hero",
    position: { x: -1, y: 0, z: 0 },
    rotation: { x: 0, y: 30, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    layer: 1,
    poseHint: { facing: "camera", action: "draw_sword" }
  };

  const enemyObj = {
    id: "obj-enemy",
    type: "character",
    refId: enemy && enemy.id,
    label: (enemy && enemy.name) || "Enemy",
    position: { x: 1, y: 0, z: 0 },
    rotation: { x: 0, y: -30, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    layer: 2,
    poseHint: { facing: "camera", action: "ready_to_attack" }
  };

  return { heroObj: heroObj, enemyObj: enemyObj };
}

function makeFaceOffGeometry(scene, project) {
  const pair = resolveHeroAndEnemy(scene, project);
  const heroObj = pair.heroObj;
  const enemyObj = pair.enemyObj;

  const camera = {
    id: "cam-faceoff",
    projection: "perspective",
    eye: { x: 0, y: 3, z: 6 },
    target: { x: 0, y: 0, z: 0 },
    up: { x: 0, y: 1, z: 0 },
    fovDeg: 45
  };

  return {
    camera: camera,
    objects: [heroObj, enemyObj],
    guides: []
  };
}

function makeRushTowardsGeometry(scene, project) {
  const pair = resolveHeroAndEnemy(scene, project);
  const heroObj = pair.heroObj;

  const camera = {
    id: "cam-rush",
    projection: "perspective",
    eye: { x: 0, y: 1.5, z: 3 },
    target: { x: 0, y: 1.2, z: 0 },
    up: { x: 0, y: 1, z: 0 },
    fovDeg: 70
  };

  const heroForeground = Object.assign({}, heroObj, {
    position: { x: 0, y: 0, z: 0.5 },
    layer: 3,
    poseHint: { facing: "camera", action: "rush_forward" }
  });

  return {
    camera: camera,
    objects: [heroForeground],
    guides: []
  };
}

function makeOverheadCrowdGeometry(scene, project) {
  const camera = {
    id: "cam-overhead",
    projection: "perspective",
    eye: { x: 0, y: 15, z: 0.1 },
    target: { x: 0, y: 0, z: 0 },
    up: { x: 0, y: 0, z: 1 },
    fovDeg: 60
  };

  const objects = [];

  // Simple crowd simulation
  for (let i = 0; i < 10; i++) {
    objects.push({
      id: "crowd-" + i,
      type: "character",
      refId: null,
      label: "npc",
      position: {
        x: (Math.random() - 0.5) * 6,
        y: 0,
        z: (Math.random() - 0.5) * 6
      },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      layer: 0,
      poseHint: { facing: "down" }
    });
  }

  return {
    camera: camera,
    objects: objects,
    guides: []
  };
}

function makeHeroWalkawayGeometry(scene, project) {
  const pair = resolveHeroAndEnemy(scene, project);
  const heroObj = pair.heroObj;

  const camera = {
    id: "cam-walkaway",
    projection: "perspective",
    eye: { x: 0, y: 1.6, z: -4 },
    target: { x: 0, y: 1.4, z: 0 },
    up: { x: 0, y: 1, z: 0 },
    fovDeg: 50
  };

  const heroBack = Object.assign({}, heroObj, {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    poseHint: { facing: "back", action: "walk_away" }
  });

  return {
    camera: camera,
    objects: [heroBack],
    guides: []
  };
}

function updateGeometryFromNarrative(scene, project) {
  const node = scene.narrativeGraph.nodes.find(n => n.id === scene.focusNodeId);
  if (!node) return scene.geometry;

  const preset = node.compositionPreset || "none";

  if (preset === "face_off") {
    return makeFaceOffGeometry(scene, project);
  }
  if (preset === "rush_towards") {
    return makeRushTowardsGeometry(scene, project);
  }
  if (preset === "overhead_crowd") {
    return makeOverheadCrowdGeometry(scene, project);
  }
  if (preset === "hero_walkaway") {
    return makeHeroWalkawayGeometry(scene, project);
  }
  
  return scene.geometry;
}

// Export to window
window.updateGeometryFromNarrative = updateGeometryFromNarrative;
