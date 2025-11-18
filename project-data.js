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
    }
  ]
};
