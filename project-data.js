// project-data.js
// Default project data

window.defaultProject = {
  "id": "proj-1",
  "name": "Rooftop Showdown Demo",
  "version": "0.1.0",
  "characters": [
    {
      "id": "ch-hero",
      "name": "Blue-haired girl",
      "role": "protagonist",
      "visual": {
        "gender": "female",
        "ageApprox": "late teens",
        "hairColor": "blue",
        "hairStyle": "short",
        "eyeColor": "blue",
        "clothingTags": ["school uniform"],
        "accessoryTags": ["katana"]
      }
    },
    {
      "id": "ch-enemy",
      "name": "Masked enemy",
      "role": "antagonist",
      "visual": {
        "gender": "unknown",
        "clothingTags": ["long coat", "mask"]
      }
    }
  ],
  "world": {
    "id": "world-1",
    "name": "Night City Rooftop",
    "genreTags": ["urban fantasy"],
    "visualAtmosphereTags": ["night city", "neon lights", "light rain"]
  },
  "scenes": [
    {
      "id": "scene-1",
      "name": "Rooftop showdown",
      "focusNodeId": "ev-2",
      "narrativeGraph": {
        "nodes": [
          { 
            "id": "ev-1", 
            "type": "Event", 
            "label": "Hero arrives on rooftop",
            "compositionPreset": "none"
          },
          { 
            "id": "ev-2", 
            "type": "Event", 
            "label": "Hero confronts enemy",
            "compositionPreset": "face_off"
          },
          { 
            "id": "ev-3", 
            "type": "Outcome", 
            "label": "First clash of blades",
            "compositionPreset": "rush_towards"
          }
        ],
        "edges": [
          { "id": "e1", "from": "ev-1", "to": "ev-2", "relation": "time" },
          { "id": "e2", "from": "ev-2", "to": "ev-3", "relation": "cause" }
        ]
      },
      "geometry": {
        "camera": {
          "id": "cam-1",
          "projection": "perspective",
          "eye": { "x": 0, "y": 5, "z": 10 },
          "target": { "x": 0, "y": 0, "z": 0 },
          "up": { "x": 0, "y": 1, "z": 0 },
          "fovDeg": 45
        },
        "objects": [
          {
            "id": "obj-hero",
            "type": "character",
            "refId": "ch-hero",
            "label": "Hero",
            "position": { "x": -2, "y": 0, "z": 0 },
            "rotation": { "x": 0, "y": 45, "z": 0 },
            "scale": { "x": 1, "y": 1, "z": 1 },
            "layer": 1,
            "poseHint": { "facing": "camera", "action": "draw_sword" }
          },
          {
            "id": "obj-enemy",
            "type": "character",
            "refId": "ch-enemy",
            "label": "Enemy",
            "position": { "x": 2, "y": 0, "z": 0 },
            "rotation": { "x": 0, "y": -45, "z": 0 },
            "scale": { "x": 1, "y": 1, "z": 1 },
            "layer": 2,
            "poseHint": { "facing": "camera", "action": "ready_to_attack" }
          }
        ],
        "guides": []
      },
      "prompt": {
        "id": "prompt-1",
        "language": "en",
        "mainSubject": "",
        "styleTags": [],
        "compositionTags": [],
        "environmentTags": [],
        "actionTags": [],
        "cameraTags": [],
        "extraNegativeTags": []
      }
    },
    {
      "id": "scene-2",
      "name": "Alley pursuit",
      "focusNodeId": "ev-5",
      "narrativeGraph": {
        "nodes": [
          {
            "id": "ev-4",
            "type": "Event",
            "label": "Hero spots the masked enemy escaping",
            "compositionPreset": "rush_towards"
          },
          {
            "id": "ev-5",
            "type": "Event",
            "label": "Dash through neon alleys",
            "compositionPreset": "hero_walkaway"
          },
          {
            "id": "ev-6",
            "type": "Outcome",
            "label": "Enemy cornered near fire escape",
            "compositionPreset": "face_off"
          }
        ],
        "edges": [
          { "id": "e3", "from": "ev-4", "to": "ev-5", "relation": "time" },
          { "id": "e4", "from": "ev-5", "to": "ev-6", "relation": "cause" }
        ]
      },
      "geometry": {
        "camera": {
          "id": "cam-alley",
          "projection": "perspective",
          "eye": { "x": -2, "y": 2, "z": 4 },
          "target": { "x": 1, "y": 1.2, "z": -1 },
          "up": { "x": 0, "y": 1, "z": 0 },
          "fovDeg": 60
        },
        "objects": [
          {
            "id": "obj-hero-run",
            "type": "character",
            "refId": "ch-hero",
            "label": "Hero sprinting",
            "position": { "x": -1.5, "y": 0, "z": 0.5 },
            "rotation": { "x": 0, "y": 20, "z": 0 },
            "scale": { "x": 1, "y": 1, "z": 1 },
            "layer": 2,
            "poseHint": { "facing": "camera", "action": "rush_forward" }
          },
          {
            "id": "obj-enemy-run",
            "type": "character",
            "refId": "ch-enemy",
            "label": "Enemy fleeing",
            "position": { "x": 1.5, "y": 0, "z": -1.2 },
            "rotation": { "x": 0, "y": -20, "z": 0 },
            "scale": { "x": 1, "y": 1, "z": 1 },
            "layer": 1,
            "poseHint": { "facing": "away", "action": "escape" }
          }
        ],
        "guides": [
          {
            "id": "guide-diagonal",
            "type": "diagonal",
            "p1": { "x": -3, "y": 0, "z": 2 },
            "p2": { "x": 3, "y": 0, "z": -2 },
            "meta": { "label": "alley perspective" }
          }
        ]
      },
      "prompt": {
        "id": "prompt-2",
        "language": "en",
        "mainSubject": "",
        "styleTags": [],
        "compositionTags": [],
        "environmentTags": [],
        "actionTags": [],
        "cameraTags": [],
        "extraNegativeTags": []
      }
    },
    {
      "id": "scene-3",
      "name": "Aftermath vigil",
      "focusNodeId": "ev-8",
      "narrativeGraph": {
        "nodes": [
          {
            "id": "ev-7",
            "type": "Event",
            "label": "Rain eases over the city",
            "compositionPreset": "overhead_crowd"
          },
          {
            "id": "ev-8",
            "type": "Event",
            "label": "Hero watches sunrise alone",
            "compositionPreset": "hero_walkaway"
          }
        ],
        "edges": [
          { "id": "e5", "from": "ev-7", "to": "ev-8", "relation": "time" }
        ]
      },
      "geometry": {
        "camera": {
          "id": "cam-aftermath",
          "projection": "perspective",
          "eye": { "x": 0, "y": 1.7, "z": -4 },
          "target": { "x": 0, "y": 1.4, "z": 0 },
          "up": { "x": 0, "y": 1, "z": 0 },
          "fovDeg": 40
        },
        "objects": [
          {
            "id": "obj-hero-alone",
            "type": "character",
            "refId": "ch-hero",
            "label": "Hero",
            "position": { "x": 0, "y": 0, "z": 0.3 },
            "rotation": { "x": 0, "y": 0, "z": 0 },
            "scale": { "x": 1, "y": 1, "z": 1 },
            "layer": 1,
            "poseHint": { "facing": "horizon", "action": "contemplate" }
          }
        ],
        "guides": [
          {
            "id": "guide-horizon",
            "type": "horizon",
            "p1": { "x": -3, "y": 0, "z": -2 },
            "p2": { "x": 3, "y": 0, "z": -2 },
            "meta": { "label": "distant skyline" }
          }
        ]
      },
      "prompt": {
        "id": "prompt-3",
        "language": "en",
        "mainSubject": "",
        "styleTags": [],
        "compositionTags": [],
        "environmentTags": [],
        "actionTags": [],
        "cameraTags": [],
        "extraNegativeTags": []
      }
    }
  ]
};
