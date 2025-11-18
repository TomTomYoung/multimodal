// geometry-adapter.js
// Converts between CanvasState and GeometryComposition

function canvasStateToGeometry(state, project) {
  // CameraSpec conversion
  const camera = {
    id: "cam-1",
    projection: state.camera.projection,
    eye: { ...state.camera.eye },
    target: { ...state.camera.target },
    up: { ...state.camera.up },
    fovDeg: state.camera.fovDeg
  };

  const objects = [];
  const guides = [];

  state.entities.forEach(ent => {
    if (ent.kind === "character") {
      const refId = ent.meta.characterId;
      objects.push({
        id: ent.id,
        type: "character",
        refId: refId,
        label: ent.meta.label || "character",
        position: ent.meta.position,
        rotation: ent.meta.rotation || { x: 0, y: 0, z: 0 },
        scale: ent.meta.scale || { x: 1, y: 1, z: 1 },
        layer: ent.meta.layer || 0,
        poseHint: ent.meta.poseHint
      });
    } else if (ent.kind === "guide") {
      guides.push({
        id: ent.id,
        type: ent.meta.guideType || "custom",
        p1: ent.meta.p1,
        p2: ent.meta.p2,
        meta: { ...ent.meta }
      });
    }
  });

  return {
    camera: camera,
    objects: objects,
    guides: guides
  };
}

function geometryToCanvasState(geom, project) {
  const camera = {
    eye: { ...geom.camera.eye },
    target: { ...geom.camera.target },
    up: { ...geom.camera.up },
    fovDeg: geom.camera.fovDeg,
    projection: geom.camera.projection
  };

  const entities = [];

  geom.objects.forEach(obj => {
    if (obj.type === "character") {
      entities.push({
        id: obj.id,
        kind: "character",
        meta: {
          characterId: obj.refId,
          label: obj.label,
          position: obj.position,
          rotation: obj.rotation,
          scale: obj.scale,
          layer: obj.layer,
          poseHint: obj.poseHint
        }
      });
    }
  });

  geom.guides.forEach(g => {
    entities.push({
      id: g.id,
      kind: "guide",
      meta: {
        guideType: g.type,
        p1: g.p1,
        p2: g.p2
      }
    });
  });

  return { camera: camera, entities: entities };
}

// Export to window
window.canvasStateToGeometry = canvasStateToGeometry;
window.geometryToCanvasState = geometryToCanvasState;
