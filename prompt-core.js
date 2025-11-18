// prompt-core.js
// Core logic for generating image prompts from geometry, characters, and world

function classifyAngle(camera) {
  const dx = camera.target.x - camera.eye.x;
  const dy = camera.target.y - camera.eye.y;
  const dz = camera.target.z - camera.eye.z;
  
  const verticalAngle = Math.atan2(dy, Math.sqrt(dx*dx + dz*dz)) * 180 / Math.PI;

  const composition = [];
  const cameraTags = [];

  if (verticalAngle > 35) {
    composition.push("high-angle shot");
  } else if (verticalAngle < -35) {
    composition.push("low-angle shot");
  } else {
    composition.push("eye-level shot");
  }

  const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
  if (dist < 5) {
    cameraTags.push("close-up");
  } else if (dist < 15) {
    cameraTags.push("medium shot");
  } else {
    cameraTags.push("wide shot");
  }

  if (camera.projection === "perspective") {
    if ((camera.fovDeg || 45) >= 60) {
      cameraTags.push("wide angle lens");
    } else {
      cameraTags.push("standard lens");
    }
  } else {
    cameraTags.push("orthographic view");
  }

  return { composition: composition, camera: cameraTags };
}

function projectToScreen(pos, cam) {
  const sx = 0.5 + pos.x * 0.1;
  const sy = 0.5 - pos.z * 0.1;
  return { x: sx, y: sy };
}

function deriveCompositionTagsFromGeometry(geom, project) {
  const tags = [];

  const characters = geom.objects.filter(o => o.type === "character");
  const heroObj = characters.find(o => {
    const ch = project.characters.find(c => c.id === o.refId);
    return ch && ch.role === "protagonist";
  });

  if (heroObj) {
    const sp = projectToScreen(heroObj.position, geom.camera);
    if (sp.x < 1/3) {
      tags.push("rule of thirds, hero on left");
    } else if (sp.x > 2/3) {
      tags.push("rule of thirds, hero on right");
    } else {
      tags.push("centered composition");
    }
  }

  const enemyObj = characters.find(o => {
    const ch = project.characters.find(c => c.id === o.refId);
    return ch && ch.role === "antagonist";
  });

  if (heroObj && enemyObj) {
    const h = projectToScreen(heroObj.position, geom.camera);
    const e = projectToScreen(enemyObj.position, geom.camera);
    const dx = e.x - h.x;
    const dy = e.y - h.y;
    const slope = Math.abs(dy / (dx || 1e-6));
    if (slope > 0.5 && slope < 2) {
      tags.push("diagonal composition");
    } else {
      tags.push("balanced two-subject composition");
    }
  }

  geom.guides.forEach(g => {
    if (g.type === "diagonal") {
      tags.push("strong diagonal guide lines");
    }
    if (g.type === "horizon") {
      tags.push("clear horizon line");
    }
  });

  return tags;
}

function buildMainSubjectFromCharacter(ch) {
  const v = ch.visual || {};
  const pieces = [];

  if (v.ageApprox || v.gender) {
    if (v.ageApprox && v.gender) {
      pieces.push("a " + v.ageApprox + " " + v.gender);
    } else if (v.gender) {
      pieces.push("a " + v.gender);
    }
  } else {
    pieces.push("a character");
  }

  if (v.hairColor && v.hairStyle) {
    pieces.push("with " + v.hairColor + " " + v.hairStyle + " hair");
  } else if (v.hairColor) {
    pieces.push("with " + v.hairColor + " hair");
  }

  if (v.clothingTags && v.clothingTags.length) {
    pieces.push("wearing " + v.clothingTags.join(", "));
  }

  if (v.accessoryTags && v.accessoryTags.includes("katana")) {
    pieces.push("holding a katana");
  }

  return pieces.join(", ");
}

function deriveFromObjects(objects, characters) {
  const composition = [];
  const actionTags = [];
  let mainSubject = "";

  const heroObj = objects.find(o => {
    const ch = characters.find(c => c.id === o.refId);
    return ch && ch.role === "protagonist";
  });

  const enemyObj = objects.find(o => {
    const ch = characters.find(c => c.id === o.refId);
    return ch && ch.role === "antagonist";
  });

  if (heroObj && enemyObj) {
    if (heroObj.position.x < enemyObj.position.x) {
      composition.push("hero on the left, enemy on the right");
    } else {
      composition.push("hero on the right, enemy on the left");
    }
    composition.push("face-to-face confrontation");
  }

  objects.forEach(obj => {
    if (obj.poseHint && obj.poseHint.action === "draw_sword") {
      actionTags.push("drawing a sword");
    }
    if (obj.poseHint && obj.poseHint.action === "ready_to_attack") {
      actionTags.push("ready to attack");
    }
    if (obj.poseHint && obj.poseHint.action === "rush_forward") {
      actionTags.push("rushing forward");
    }
  });

  if (heroObj) {
    const ch = characters.find(c => c.id === heroObj.refId);
    if (ch) {
      mainSubject = buildMainSubjectFromCharacter(ch);
    }
  }

  return { composition: composition, actionTags: actionTags, mainSubject: mainSubject };
}

function deriveWorldTags(world) {
  if (!world) return { env: [], style: [] };
  
  const env = [];
  const style = [];

  if (world.visualAtmosphereTags && world.visualAtmosphereTags.length) {
    env.push(...world.visualAtmosphereTags);
  }
  
  if (world.genreTags && world.genreTags.includes("urban fantasy")) {
    style.push("urban fantasy atmosphere");
  }
  
  return { env: env, style: style };
}

function buildRawPrompt(spec) {
  const parts = [];
  
  if (spec.mainSubject) parts.push(spec.mainSubject);
  if (spec.actionTags.length) parts.push(spec.actionTags.join(", "));
  if (spec.compositionTags.length) parts.push(spec.compositionTags.join(", "));
  if (spec.cameraTags.length) parts.push(spec.cameraTags.join(", "));
  if (spec.environmentTags.length) parts.push(spec.environmentTags.join(", "));
  if (spec.styleTags.length) parts.push(spec.styleTags.join(", "));
  
  return parts.join(", ");
}

function updatePromptFromScene(scene, project) {
  const geom = scene.geometry;
  const angle = classifyAngle(geom.camera);
  const compTags = deriveCompositionTagsFromGeometry(geom, project);
  const objInfo = deriveFromObjects(geom.objects, project.characters);
  const worldInfo = deriveWorldTags(project.world);

  const spec = Object.assign({}, scene.prompt, {
    mainSubject: objInfo.mainSubject,
    compositionTags: angle.composition.concat(compTags),
    cameraTags: angle.camera,
    actionTags: objInfo.actionTags,
    environmentTags: worldInfo.env,
    styleTags: worldInfo.style,
    extraNegativeTags: scene.prompt.extraNegativeTags || []
  });

  spec.rawPrompt = buildRawPrompt(spec);
  return spec;
}

// Export to window
window.updatePromptFromScene = updatePromptFromScene;
