/**
 * PitchVision - AI Football Match Analysis & Tactical Insights
 * Interactive Tactical Sandbox & Pipeline Simulator Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  initSandboxStudio();
  initPipelineStepper();
  initScrollSpy();
});

/* ==========================================================================
   Tactical Sandbox Simulation Data & Coordinates
   ========================================================================== */
const TACTICAL_SCENARIOS = {
  'high-press': {
    name: '4-3-3 High Press & Build-Up',
    description: 'Team A pressing high in attacking third (4-3-3), Team B building from back (4-4-2).',
    formationA: '4-3-3 (High Press)',
    formationB: '4-4-2 (Low Block)',
    metrics: {
      teamA: { width: 52.4, length: 38.6, compactness: 1240, defLine: 48.2 },
      teamB: { width: 38.5, length: 28.0, compactness: 760, defLine: 18.5 },
      midfieldDominance: 'Team A (+1 Overload)',
      ballPossession: 'Team A (In Possession)'
    },
    // Perspective Camera Bounding Boxes (normalized % 0..100)
    entities: [
      // Ball
      { id: 'BALL', type: 'ball', team: 'ball', label: 'Ball', conf: 0.96, cam: { x: 24.2, y: 76.5, w: 1.8, h: 2.4 }, pitch: { x: 38.5, y: 32.0 } },
      // Referee
      { id: 'REF-1', type: 'referee', team: 'referee', label: 'Referee', conf: 0.98, cam: { x: 58.2, y: 59.8, w: 2.2, h: 6.2 }, pitch: { x: 54.0, y: 36.5 } },
      // Team A (Blue) - 4-3-3
      { id: 'A-GK', type: 'player', team: 'teamA', label: 'A-GK #1', conf: 0.99, cam: { x: 12.0, y: 44.0, w: 1.8, h: 4.5 }, pitch: { x: 6.5, y: 34.0 } },
      { id: 'A-LB', type: 'player', team: 'teamA', label: 'A-LB #3', conf: 0.97, cam: { x: 22.0, y: 55.0, w: 2.4, h: 5.8 }, pitch: { x: 34.0, y: 58.0 } },
      { id: 'A-CB1', type: 'player', team: 'teamA', label: 'A-CB #4', conf: 0.98, cam: { x: 32.8, y: 58.2, w: 2.5, h: 6.2 }, pitch: { x: 42.0, y: 42.0 } },
      { id: 'A-CB2', type: 'player', team: 'teamA', label: 'A-CB #5', conf: 0.96, cam: { x: 36.5, y: 46.5, w: 2.1, h: 5.2 }, pitch: { x: 44.0, y: 26.0 } },
      { id: 'A-RB', type: 'player', team: 'teamA', label: 'A-RB #2', conf: 0.95, cam: { x: 45.0, y: 43.0, w: 1.9, h: 4.8 }, pitch: { x: 48.0, y: 10.0 } },
      { id: 'A-DM', type: 'player', team: 'teamA', label: 'A-DM #6', conf: 0.97, cam: { x: 52.4, y: 67.2, w: 2.6, h: 6.8 }, pitch: { x: 56.5, y: 38.0 } },
      { id: 'A-CM1', type: 'player', team: 'teamA', label: 'A-CM #8', conf: 0.99, cam: { x: 27.2, y: 73.5, w: 2.8, h: 7.2 }, pitch: { x: 62.0, y: 48.0 } },
      { id: 'A-CM2', type: 'player', team: 'teamA', label: 'A-CM #10', conf: 0.98, cam: { x: 64.8, y: 58.5, w: 2.3, h: 6.0 }, pitch: { x: 65.0, y: 24.0 } },
      { id: 'A-LW', type: 'player', team: 'teamA', label: 'A-LW #11', conf: 0.94, cam: { x: 74.5, y: 69.5, w: 2.7, h: 7.0 }, pitch: { x: 78.0, y: 60.0 } },
      { id: 'A-ST', type: 'player', team: 'teamA', label: 'A-ST #9', conf: 0.96, cam: { x: 81.8, y: 55.0, w: 2.4, h: 6.0 }, pitch: { x: 84.0, y: 34.0 } },
      { id: 'A-RW', type: 'player', team: 'teamA', label: 'A-RW #7', conf: 0.95, cam: { x: 73.0, y: 45.5, w: 2.0, h: 5.0 }, pitch: { x: 79.0, y: 12.0 } },
      // Team B (Red) - 4-4-2
      { id: 'B-GK', type: 'player', team: 'teamB', label: 'B-GK #1', conf: 0.99, cam: { x: 84.5, y: 84.0, w: 3.2, h: 8.5 }, pitch: { x: 98.0, y: 34.0 } },
      { id: 'B-RB', type: 'player', team: 'teamB', label: 'B-RB #2', conf: 0.96, cam: { x: 68.0, y: 64.5, w: 2.5, h: 6.5 }, pitch: { x: 82.0, y: 56.0 } },
      { id: 'B-CB1', type: 'player', team: 'teamB', label: 'B-CB #4', conf: 0.97, cam: { x: 55.8, y: 68.2, w: 2.7, h: 7.0 }, pitch: { x: 80.0, y: 40.0 } },
      { id: 'B-CB2', type: 'player', team: 'teamB', label: 'B-CB #5', conf: 0.98, cam: { x: 46.8, y: 57.5, w: 2.3, h: 6.0 }, pitch: { x: 81.0, y: 28.0 } },
      { id: 'B-LB', type: 'player', team: 'teamB', label: 'B-LB #3', conf: 0.95, cam: { x: 53.2, y: 49.5, w: 2.0, h: 5.2 }, pitch: { x: 83.0, y: 14.0 } },
      { id: 'B-RM', type: 'player', team: 'teamB', label: 'B-RM #7', conf: 0.94, cam: { x: 39.5, y: 50.0, w: 2.2, h: 5.4 }, pitch: { x: 66.0, y: 52.0 } },
      { id: 'B-CM1', type: 'player', team: 'teamB', label: 'B-CM #6', conf: 0.97, cam: { x: 21.8, y: 73.0, w: 2.7, h: 7.0 }, pitch: { x: 64.0, y: 38.0 } },
      { id: 'B-CM2', type: 'player', team: 'teamB', label: 'B-CM #8', conf: 0.96, cam: { x: 32.5, y: 55.0, w: 2.3, h: 5.8 }, pitch: { x: 67.0, y: 26.0 } },
      { id: 'B-LM', type: 'player', team: 'teamB', label: 'B-LM #11', conf: 0.95, cam: { x: 21.8, y: 58.5, w: 2.4, h: 6.0 }, pitch: { x: 65.0, y: 12.0 } },
      { id: 'B-CF1', type: 'player', team: 'teamB', label: 'B-ST #9', conf: 0.96, cam: { x: 83.5, y: 63.5, w: 2.6, h: 6.8 }, pitch: { x: 50.0, y: 42.0 } },
      { id: 'B-CF2', type: 'player', team: 'teamB', label: 'B-ST #10', conf: 0.95, cam: { x: 73.0, y: 46.0, w: 2.0, h: 5.0 }, pitch: { x: 49.0, y: 28.0 } }
    ],
    formationLinesA: [
      ['A-LB', 'A-CB1', 'A-CB2', 'A-RB'],
      ['A-CM1', 'A-DM', 'A-CM2'],
      ['A-LW', 'A-ST', 'A-RW']
    ],
    formationLinesB: [
      ['B-RB', 'B-CB1', 'B-CB2', 'B-LB'],
      ['B-RM', 'B-CM1', 'B-CM2', 'B-LM'],
      ['B-CF1', 'B-CF2']
    ]
  },
  'mid-block': {
    name: '4-2-3-1 Mid-Block Defensive Transition',
    description: 'Team A organized in compact 4-2-3-1 mid-block, Team B probing across wings.',
    formationA: '4-2-3-1 (Mid Block)',
    formationB: '3-4-3 (Wing Overload)',
    metrics: {
      teamA: { width: 44.0, length: 31.5, compactness: 910, defLine: 36.0 },
      teamB: { width: 56.2, length: 42.0, compactness: 1450, defLine: 54.0 },
      midfieldDominance: 'Equilibrium (3v3 in Zone 14)',
      ballPossession: 'Team B (In Possession)'
    },
    entities: [
      { id: 'BALL', type: 'ball', team: 'ball', label: 'Ball', conf: 0.98, cam: { x: 52.0, y: 67.0, w: 1.8, h: 2.4 }, pitch: { x: 52.5, y: 45.0 } },
      { id: 'REF-1', type: 'referee', team: 'referee', label: 'Referee', conf: 0.99, cam: { x: 38.0, y: 52.0, w: 2.2, h: 5.6 }, pitch: { x: 42.0, y: 22.0 } },
      // Team A
      { id: 'A-GK', type: 'player', team: 'teamA', label: 'A-GK #1', conf: 0.99, cam: { x: 12.0, y: 44.0, w: 1.8, h: 4.5 }, pitch: { x: 6.5, y: 34.0 } },
      { id: 'A-LB', type: 'player', team: 'teamA', label: 'A-LB #3', conf: 0.97, cam: { x: 25.0, y: 58.0, w: 2.4, h: 5.8 }, pitch: { x: 28.0, y: 54.0 } },
      { id: 'A-CB1', type: 'player', team: 'teamA', label: 'A-CB #4', conf: 0.98, cam: { x: 31.0, y: 54.0, w: 2.4, h: 5.8 }, pitch: { x: 30.0, y: 40.0 } },
      { id: 'A-CB2', type: 'player', team: 'teamA', label: 'A-CB #5', conf: 0.97, cam: { x: 36.0, y: 48.0, w: 2.2, h: 5.4 }, pitch: { x: 31.0, y: 28.0 } },
      { id: 'A-RB', type: 'player', team: 'teamA', label: 'A-RB #2', conf: 0.96, cam: { x: 42.0, y: 44.0, w: 2.0, h: 5.0 }, pitch: { x: 30.0, y: 14.0 } },
      { id: 'A-DM1', type: 'player', team: 'teamA', label: 'A-DM #6', conf: 0.98, cam: { x: 48.0, y: 64.0, w: 2.5, h: 6.5 }, pitch: { x: 44.0, y: 40.0 } },
      { id: 'A-DM2', type: 'player', team: 'teamA', label: 'A-DM #8', conf: 0.97, cam: { x: 50.0, y: 52.0, w: 2.3, h: 6.0 }, pitch: { x: 45.0, y: 26.0 } },
      { id: 'A-LAM', type: 'player', team: 'teamA', label: 'A-LM #11', conf: 0.95, cam: { x: 62.0, y: 66.0, w: 2.6, h: 6.8 }, pitch: { x: 58.0, y: 55.0 } },
      { id: 'A-CAM', type: 'player', team: 'teamA', label: 'A-AM #10', conf: 0.99, cam: { x: 56.0, y: 58.0, w: 2.4, h: 6.2 }, pitch: { x: 56.0, y: 34.0 } },
      { id: 'A-RAM', type: 'player', team: 'teamA', label: 'A-RM #7', conf: 0.94, cam: { x: 60.0, y: 46.0, w: 2.1, h: 5.2 }, pitch: { x: 57.0, y: 15.0 } },
      { id: 'A-ST', type: 'player', team: 'teamA', label: 'A-ST #9', conf: 0.96, cam: { x: 70.0, y: 54.0, w: 2.4, h: 6.0 }, pitch: { x: 68.0, y: 34.0 } },
      // Team B
      { id: 'B-GK', type: 'player', team: 'teamB', label: 'B-GK #1', conf: 0.99, cam: { x: 84.5, y: 84.0, w: 3.2, h: 8.5 }, pitch: { x: 98.0, y: 34.0 } },
      { id: 'B-CB1', type: 'player', team: 'teamB', label: 'B-CB #3', conf: 0.97, cam: { x: 74.0, y: 64.0, w: 2.6, h: 6.8 }, pitch: { x: 82.0, y: 52.0 } },
      { id: 'B-CB2', type: 'player', team: 'teamB', label: 'B-CB #4', conf: 0.98, cam: { x: 68.0, y: 55.0, w: 2.4, h: 6.2 }, pitch: { x: 83.0, y: 34.0 } },
      { id: 'B-CB3', type: 'player', team: 'teamB', label: 'B-CB #5', conf: 0.96, cam: { x: 62.0, y: 48.0, w: 2.1, h: 5.4 }, pitch: { x: 82.0, y: 16.0 } },
      { id: 'B-RWB', type: 'player', team: 'teamB', label: 'B-WB #2', conf: 0.95, cam: { x: 54.0, y: 70.0, w: 2.7, h: 7.0 }, pitch: { x: 62.0, y: 62.0 } },
      { id: 'B-CM1', type: 'player', team: 'teamB', label: 'B-CM #6', conf: 0.98, cam: { x: 44.0, y: 62.0, w: 2.5, h: 6.5 }, pitch: { x: 64.0, y: 42.0 } },
      { id: 'B-CM2', type: 'player', team: 'teamB', label: 'B-CM #8', conf: 0.97, cam: { x: 38.0, y: 52.0, w: 2.3, h: 6.0 }, pitch: { x: 63.0, y: 26.0 } },
      { id: 'B-LWB', type: 'player', team: 'teamB', label: 'B-WB #7', conf: 0.94, cam: { x: 42.0, y: 42.0, w: 2.0, h: 5.0 }, pitch: { x: 60.0, y: 8.0 } },
      { id: 'B-RW', type: 'player', team: 'teamB', label: 'B-RW #11', conf: 0.96, cam: { x: 26.0, y: 72.0, w: 2.8, h: 7.2 }, pitch: { x: 42.0, y: 56.0 } },
      { id: 'B-CF', type: 'player', team: 'teamB', label: 'B-ST #9', conf: 0.97, cam: { x: 22.0, y: 60.0, w: 2.5, h: 6.4 }, pitch: { x: 38.0, y: 34.0 } },
      { id: 'B-LW', type: 'player', team: 'teamB', label: 'B-LW #10', conf: 0.95, cam: { x: 28.0, y: 48.0, w: 2.2, h: 5.5 }, pitch: { x: 40.0, y: 12.0 } }
    ],
    formationLinesA: [
      ['A-LB', 'A-CB1', 'A-CB2', 'A-RB'],
      ['A-DM1', 'A-DM2'],
      ['A-LAM', 'A-CAM', 'A-RAM'],
      ['A-ST']
    ],
    formationLinesB: [
      ['B-CB1', 'B-CB2', 'B-CB3'],
      ['B-RWB', 'B-CM1', 'B-CM2', 'B-LWB'],
      ['B-RW', 'B-CF', 'B-LW']
    ]
  },
  'deep-block': {
    name: '5-3-2 Deep Counter & Compact Box',
    description: 'Team A in resilient 5-3-2 low block absorbing pressure, Team B attacking with 10 men in opposing half.',
    formationA: '5-3-2 (Ultra-Compact Low Block)',
    formationB: '2-3-5 (All-Out Attack Siege)',
    metrics: {
      teamA: { width: 34.2, length: 22.4, compactness: 580, defLine: 19.0 },
      teamB: { width: 62.0, length: 48.5, compactness: 1820, defLine: 68.4 },
      midfieldDominance: 'Team B (+2 Overload)',
      ballPossession: 'Team B (82% Territory)'
    },
    entities: [
      { id: 'BALL', type: 'ball', team: 'ball', label: 'Ball', conf: 0.99, cam: { x: 28.0, y: 65.0, w: 1.8, h: 2.4 }, pitch: { x: 32.0, y: 38.0 } },
      { id: 'REF-1', type: 'referee', team: 'referee', label: 'Referee', conf: 0.97, cam: { x: 45.0, y: 55.0, w: 2.2, h: 5.8 }, pitch: { x: 48.0, y: 20.0 } },
      // Team A - 5-3-2
      { id: 'A-GK', type: 'player', team: 'teamA', label: 'A-GK #1', conf: 0.99, cam: { x: 12.0, y: 44.0, w: 1.8, h: 4.5 }, pitch: { x: 5.5, y: 34.0 } },
      { id: 'A-LWB', type: 'player', team: 'teamA', label: 'A-WB #3', conf: 0.97, cam: { x: 18.0, y: 58.0, w: 2.4, h: 6.0 }, pitch: { x: 18.0, y: 54.0 } },
      { id: 'A-LCB', type: 'player', team: 'teamA', label: 'A-CB #4', conf: 0.98, cam: { x: 21.0, y: 53.0, w: 2.3, h: 5.8 }, pitch: { x: 17.0, y: 42.0 } },
      { id: 'A-CCB', type: 'player', team: 'teamA', label: 'A-CB #5', conf: 0.99, cam: { x: 24.0, y: 48.0, w: 2.2, h: 5.5 }, pitch: { x: 16.0, y: 34.0 } },
      { id: 'A-RCB', type: 'player', team: 'teamA', label: 'A-CB #6', conf: 0.96, cam: { x: 27.0, y: 44.0, w: 2.0, h: 5.0 }, pitch: { x: 17.0, y: 26.0 } },
      { id: 'A-RWB', type: 'player', team: 'teamA', label: 'A-WB #2', conf: 0.95, cam: { x: 30.0, y: 41.0, w: 1.9, h: 4.8 }, pitch: { x: 19.0, y: 15.0 } },
      { id: 'A-CM1', type: 'player', team: 'teamA', label: 'A-CM #8', conf: 0.98, cam: { x: 26.0, y: 64.0, w: 2.5, h: 6.4 }, pitch: { x: 28.0, y: 45.0 } },
      { id: 'A-DM', type: 'player', team: 'teamA', label: 'A-DM #14', conf: 0.97, cam: { x: 32.0, y: 55.0, w: 2.3, h: 5.9 }, pitch: { x: 27.0, y: 34.0 } },
      { id: 'A-CM2', type: 'player', team: 'teamA', label: 'A-CM #10', conf: 0.96, cam: { x: 36.0, y: 47.0, w: 2.1, h: 5.3 }, pitch: { x: 29.0, y: 22.0 } },
      { id: 'A-ST1', type: 'player', team: 'teamA', label: 'A-ST #9', conf: 0.98, cam: { x: 44.0, y: 62.0, w: 2.5, h: 6.5 }, pitch: { x: 45.0, y: 44.0 } },
      { id: 'A-ST2', type: 'player', team: 'teamA', label: 'A-ST #7', conf: 0.96, cam: { x: 48.0, y: 50.0, w: 2.2, h: 5.6 }, pitch: { x: 46.0, y: 24.0 } },
      // Team B - 2-3-5
      { id: 'B-GK', type: 'player', team: 'teamB', label: 'B-GK #1', conf: 0.99, cam: { x: 84.5, y: 84.0, w: 3.2, h: 8.5 }, pitch: { x: 92.0, y: 34.0 } },
      { id: 'B-CB1', type: 'player', team: 'teamB', label: 'B-CB #4', conf: 0.97, cam: { x: 62.0, y: 62.0, w: 2.5, h: 6.4 }, pitch: { x: 68.0, y: 44.0 } },
      { id: 'B-CB2', type: 'player', team: 'teamB', label: 'B-CB #5', conf: 0.96, cam: { x: 58.0, y: 48.0, w: 2.2, h: 5.5 }, pitch: { x: 69.0, y: 24.0 } },
      { id: 'B-DM1', type: 'player', team: 'teamB', label: 'B-DM #6', conf: 0.98, cam: { x: 46.0, y: 68.0, w: 2.7, h: 6.9 }, pitch: { x: 52.0, y: 56.0 } },
      { id: 'B-DM2', type: 'player', team: 'teamB', label: 'B-DM #8', conf: 0.97, cam: { x: 42.0, y: 56.0, w: 2.4, h: 6.2 }, pitch: { x: 50.0, y: 34.0 } },
      { id: 'B-DM3', type: 'player', team: 'teamB', label: 'B-DM #16', conf: 0.95, cam: { x: 48.0, y: 45.0, w: 2.1, h: 5.2 }, pitch: { x: 53.0, y: 12.0 } },
      { id: 'B-LW', type: 'player', team: 'teamB', label: 'B-LW #11', conf: 0.96, cam: { x: 22.0, y: 72.0, w: 2.8, h: 7.2 }, pitch: { x: 26.0, y: 62.0 } },
      { id: 'B-LF', type: 'player', team: 'teamB', label: 'B-IF #10', conf: 0.98, cam: { x: 26.0, y: 60.0, w: 2.5, h: 6.4 }, pitch: { x: 24.0, y: 44.0 } },
      { id: 'B-CF', type: 'player', team: 'teamB', label: 'B-ST #9', conf: 0.99, cam: { x: 23.0, y: 51.0, w: 2.3, h: 5.8 }, pitch: { x: 22.0, y: 34.0 } },
      { id: 'B-RF', type: 'player', team: 'teamB', label: 'B-IF #8', conf: 0.97, cam: { x: 29.0, y: 46.0, w: 2.1, h: 5.3 }, pitch: { x: 25.0, y: 24.0 } },
      { id: 'B-RW', type: 'player', team: 'teamB', label: 'B-RW #7', conf: 0.95, cam: { x: 33.0, y: 40.0, w: 1.9, h: 4.8 }, pitch: { x: 27.0, y: 6.0 } }
    ],
    formationLinesA: [
      ['A-LWB', 'A-LCB', 'A-CCB', 'A-RCB', 'A-RWB'],
      ['A-CM1', 'A-DM', 'A-CM2'],
      ['A-ST1', 'A-ST2']
    ],
    formationLinesB: [
      ['B-CB1', 'B-CB2'],
      ['B-DM1', 'B-DM2', 'B-DM3'],
      ['B-LW', 'B-LF', 'B-CF', 'B-RF', 'B-RW']
    ]
  }
};

/* Layer Toggles State */
let activeLayers = {
  bboxes: true,
  jerseyColors: true,
  homography: true,
  convexHulls: true,
  formationLines: true,
  telemetry: true
};

let currentScenarioKey = 'high-press';
let hoveredEntityId = null;

/* ==========================================================================
   Tactical Sandbox Canvas Studio Engine
   ========================================================================== */
function initSandboxStudio() {
  const overlayCanvas = document.getElementById('cameraOverlayCanvas');
  const radarCanvas = document.getElementById('tacticalRadarCanvas');
  if (!overlayCanvas || !radarCanvas) return;

  const overlayCtx = overlayCanvas.getContext('2d');
  const radarCtx = radarCanvas.getContext('2d');

  function resizeCanvases() {
    const dpr = window.devicePixelRatio || 1;
    const overlayRect = overlayCanvas.parentElement.getBoundingClientRect();
    const radarRect = radarCanvas.parentElement.getBoundingClientRect();

    overlayCanvas.width = overlayRect.width * dpr;
    overlayCanvas.height = overlayRect.height * dpr;
    radarCanvas.width = radarRect.width * dpr;
    radarCanvas.height = radarRect.height * dpr;

    overlayCtx.scale(dpr, dpr);
    radarCtx.scale(dpr, dpr);

    renderStudio(overlayCtx, radarCtx, overlayRect.width, overlayRect.height, radarRect.width, radarRect.height);
  }

  window.addEventListener('resize', resizeCanvases);

  // Scenario Buttons
  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  scenarioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenarioKey = btn.dataset.scenario;
      updateTelemetryUI();
      renderStudio(overlayCtx, radarCtx, overlayCanvas.parentElement.clientWidth, overlayCanvas.parentElement.clientHeight, radarCanvas.parentElement.clientWidth, radarCanvas.parentElement.clientHeight);
    });
  });

  // Layer Toggles
  const toggleChips = document.querySelectorAll('.toggle-chip');
  toggleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const layer = chip.dataset.layer;
      activeLayers[layer] = !activeLayers[layer];
      chip.classList.toggle('active', activeLayers[layer]);
      renderStudio(overlayCtx, radarCtx, overlayCanvas.parentElement.clientWidth, overlayCanvas.parentElement.clientHeight, radarCanvas.parentElement.clientWidth, radarCanvas.parentElement.clientHeight);
    });
  });

  // Mouse Interactivity (Hover detection on both canvases)
  function handleMouseMove(e, isRadar = false) {
    const canvas = isRadar ? radarCanvas : overlayCanvas;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const scenario = TACTICAL_SCENARIOS[currentScenarioKey];

    let found = null;
    const width = rect.width;
    const height = rect.height;

    for (const ent of scenario.entities) {
      if (isRadar) {
        // Radar coordinate check
        const pitchPadding = 24;
        const pitchW = width - pitchPadding * 2;
        const pitchH = height - pitchPadding * 2;
        const rx = pitchPadding + (ent.pitch.x / 105) * pitchW;
        const ry = pitchPadding + (ent.pitch.y / 68) * pitchH;
        const dist = Math.hypot(mouseX - rx, mouseY - ry);
        if (dist < 14) {
          found = ent.id;
          break;
        }
      } else {
        // Camera BBox check
        const bx = (ent.cam.x / 100) * width;
        const by = (ent.cam.y / 100) * height;
        const bw = (ent.cam.w / 100) * width;
        const bh = (ent.cam.h / 100) * height;
        if (mouseX >= bx - 8 && mouseX <= bx + bw + 8 && mouseY >= by - 8 && mouseY <= by + bh + 8) {
          found = ent.id;
          break;
        }
      }
    }

    if (found !== hoveredEntityId) {
      hoveredEntityId = found;
      canvas.style.cursor = found ? 'pointer' : 'default';
      renderStudio(overlayCtx, radarCtx, overlayCanvas.parentElement.clientWidth, overlayCanvas.parentElement.clientHeight, radarCanvas.parentElement.clientWidth, radarCanvas.parentElement.clientHeight);
    }
  }

  overlayCanvas.addEventListener('mousemove', (e) => handleMouseMove(e, false));
  radarCanvas.addEventListener('mousemove', (e) => handleMouseMove(e, true));
  overlayCanvas.addEventListener('mouseleave', () => {
    if (hoveredEntityId) {
      hoveredEntityId = null;
      renderStudio(overlayCtx, radarCtx, overlayCanvas.parentElement.clientWidth, overlayCanvas.parentElement.clientHeight, radarCanvas.parentElement.clientWidth, radarCanvas.parentElement.clientHeight);
    }
  });
  radarCanvas.addEventListener('mouseleave', () => {
    if (hoveredEntityId) {
      hoveredEntityId = null;
      renderStudio(overlayCtx, radarCtx, overlayCanvas.parentElement.clientWidth, overlayCanvas.parentElement.clientHeight, radarCanvas.parentElement.clientWidth, radarCanvas.parentElement.clientHeight);
    }
  });

  // Initial sizing and render
  setTimeout(resizeCanvases, 100);
  updateTelemetryUI();
}

/* ==========================================================================
   Main Render Loop for Dual Views
   ========================================================================== */
function renderStudio(camCtx, radarCtx, camW, camH, radarW, radarH) {
  const scenario = TACTICAL_SCENARIOS[currentScenarioKey];

  // 1. Render Left Camera View Overlay
  camCtx.clearRect(0, 0, camW, camH);
  if (activeLayers.homography) {
    drawHomographyGrid(camCtx, camW, camH);
  }
  if (activeLayers.bboxes) {
    drawCameraBBoxes(camCtx, scenario.entities, camW, camH);
  }

  // 2. Render Right Tactical Pitch 2D Radar
  radarCtx.clearRect(0, 0, radarW, radarH);
  drawTacticalPitchLayout(radarCtx, radarW, radarH);

  if (activeLayers.convexHulls) {
    drawTeamConvexHulls(radarCtx, scenario.entities, radarW, radarH);
  }
  if (activeLayers.formationLines) {
    drawFormationConnections(radarCtx, scenario, radarW, radarH);
  }
  drawTacticalRadarPlayers(radarCtx, scenario.entities, radarW, radarH);
}

/* Draw Perspective Homography Mesh on Camera View */
function drawHomographyGrid(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.22)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  // Projected field corner points
  const p1 = { x: w * 0.05, y: h * 0.40 };
  const p2 = { x: w * 0.95, y: h * 0.42 };
  const p3 = { x: w * 0.98, y: h * 0.96 };
  const p4 = { x: w * 0.02, y: h * 0.88 };

  // Outer boundary polygon
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.closePath();
  ctx.stroke();

  // Perspective longitudinal lines
  for (let i = 1; i <= 5; i++) {
    const t = i / 6;
    const topX = p1.x + (p2.x - p1.x) * t;
    const topY = p1.y + (p2.y - p1.y) * t;
    const botX = p4.x + (p3.x - p4.x) * t;
    const botY = p4.y + (p3.y - p4.y) * t;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(botX, botY);
    ctx.stroke();
  }

  // Perspective lateral lines
  for (let j = 1; j <= 4; j++) {
    const t = j / 5;
    const leftX = p1.x + (p4.x - p1.x) * t;
    const leftY = p1.y + (p4.y - p1.y) * t;
    const rightX = p2.x + (p3.x - p2.x) * t;
    const rightY = p2.y + (p3.y - p2.y) * t;

    ctx.beginPath();
    ctx.moveTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.stroke();
  }

  // Draw keypoint anchors
  const keypoints = [p1, p2, p3, p4, { x: w * 0.5, y: h * 0.41 }, { x: w * 0.5, y: h * 0.92 }];
  keypoints.forEach((kp, idx) => {
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#070b12';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  ctx.restore();
}

/* Draw YOLO Bounding Boxes and Classification tags on Camera View */
function drawCameraBBoxes(ctx, entities, w, h) {
  entities.forEach(ent => {
    const bx = (ent.cam.x / 100) * w;
    const by = (ent.cam.y / 100) * h;
    const bw = (ent.cam.w / 100) * w;
    const bh = (ent.cam.h / 100) * h;
    const isHovered = (ent.id === hoveredEntityId);

    let color = '#38bdf8'; // Team A
    if (ent.team === 'teamB') color = '#f87171';
    if (ent.team === 'referee') color = '#fbbf24';
    if (ent.team === 'ball') color = '#ffffff';

    ctx.save();

    // Box Shadow / Glow
    if (isHovered) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    // BBox rectangle
    ctx.strokeStyle = color;
    ctx.lineWidth = isHovered ? 2.5 : 1.5;
    ctx.strokeRect(bx, by, bw, bh);

    // Corner brackets for high-tech HUD look
    const cornerSize = Math.min(bw, bh) * 0.35;
    ctx.lineWidth = isHovered ? 3.5 : 2.5;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(bx, by + cornerSize); ctx.lineTo(bx, by); ctx.lineTo(bx + cornerSize, by);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerSize, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + cornerSize);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - cornerSize); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + cornerSize, by + bh);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerSize, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by + bh - cornerSize);
    ctx.stroke();

    // Foot Location Pin & Projection Vector
    const footX = bx + bw / 2;
    const footY = by + bh;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(footX, footY, isHovered ? 4.5 : 3, 0, Math.PI * 2);
    ctx.fill();

    // Classification & Confidence Tag
    if (activeLayers.jerseyColors || isHovered) {
      const tagText = `${ent.label} ${(ent.conf * 100).toFixed(0)}%`;
      ctx.font = '600 10px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(tagText).width;
      const tagH = 16;
      const tagW = textWidth + 10;
      const tagY = by - tagH - 3 < 0 ? by + bh + 3 : by - tagH - 3;

      ctx.fillStyle = 'rgba(7, 11, 18, 0.85)';
      ctx.fillRect(bx, tagY, tagW, tagH);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, tagY, tagW, tagH);

      ctx.fillStyle = color;
      ctx.fillText(tagText, bx + 5, tagY + 11);
    }

    ctx.restore();
  });
}

/* Draw 2D Football Pitch Layout (Standard 105m x 68m scaled) */
function drawTacticalPitchLayout(ctx, w, h) {
  const pad = 24;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  ctx.save();

  // Pitch Grass / Field Background
  ctx.fillStyle = '#0a1622';
  ctx.fillRect(pad, pad, pw, ph);

  // Field Grass alternating mowing stripes
  const stripes = 10;
  const stripeW = pw / stripes;
  for (let s = 0; s < stripes; s++) {
    if (s % 2 === 0) {
      ctx.fillStyle = 'rgba(0, 255, 135, 0.025)';
      ctx.fillRect(pad + s * stripeW, pad, stripeW, ph);
    }
  }

  // Pitch Boundary Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad, pad, pw, ph);

  // Half-way Line
  const midX = pad + pw / 2;
  ctx.beginPath();
  ctx.moveTo(midX, pad);
  ctx.lineTo(midX, pad + ph);
  ctx.stroke();

  // Center Circle (Radius 9.15m -> ~13.4% of pitch width)
  const centerRadius = (9.15 / 68) * ph;
  ctx.beginPath();
  ctx.arc(midX, pad + ph / 2, centerRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Center Spot
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(midX, pad + ph / 2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Penalty Boxes (16.5m depth, 40.3m height)
  const penDepth = (16.5 / 105) * pw;
  const penHeight = (40.32 / 68) * ph;
  const penY = pad + (ph - penHeight) / 2;

  // Left Penalty Box
  ctx.strokeRect(pad, penY, penDepth, penHeight);
  // Right Penalty Box
  ctx.strokeRect(pad + pw - penDepth, penY, penDepth, penHeight);

  // 6-Yard Goal Areas (5.5m depth, 18.32m height)
  const sixDepth = (5.5 / 105) * pw;
  const sixHeight = (18.32 / 68) * ph;
  const sixY = pad + (ph - sixHeight) / 2;

  ctx.strokeRect(pad, sixY, sixDepth, sixHeight);
  ctx.strokeRect(pad + pw - sixDepth, sixY, sixDepth, sixHeight);

  // Penalty Spots (11m from goal line)
  const penSpotDist = (11.0 / 105) * pw;
  ctx.beginPath();
  ctx.arc(pad + penSpotDist, pad + ph / 2, 2.5, 0, Math.PI * 2);
  ctx.arc(pad + pw - penSpotDist, pad + ph / 2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Corner Arcs (1m radius)
  const cornerRad = (2.0 / 68) * ph;
  // Top-Left
  ctx.beginPath(); ctx.arc(pad, pad, cornerRad, 0, Math.PI / 2); ctx.stroke();
  // Bottom-Left
  ctx.beginPath(); ctx.arc(pad, pad + ph, cornerRad, -Math.PI / 2, 0); ctx.stroke();
  // Top-Right
  ctx.beginPath(); ctx.arc(pad + pw, pad, cornerRad, Math.PI / 2, Math.PI); ctx.stroke();
  // Bottom-Right
  ctx.beginPath(); ctx.arc(pad + pw, pad + ph, cornerRad, Math.PI, -Math.PI / 2); ctx.stroke();

  // Pitch Axis Coordinates Badge
  ctx.font = '600 9px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
  ctx.fillText('0,0 (m)', pad - 2, pad - 8);
  ctx.fillText('105m x 68m STANDARD FIFA DIMENSIONS', midX - 95, pad - 8);
  ctx.fillText('105,68', pad + pw - 28, pad + ph + 16);

  ctx.restore();
}

/* Calculate 2D Convex Hull Polygon for Team Compactness */
function calculateConvexHull(points) {
  if (points.length <= 2) return points;

  // Find lowest point (or leftmost if tie)
  let lowest = points[0];
  for (let i = 1; i < points.length; i++) {
    if (points[i].y > lowest.y || (points[i].y === lowest.y && points[i].x < lowest.x)) {
      lowest = points[i];
    }
  }

  // Sort by polar angle
  const sorted = points.filter(p => p !== lowest).sort((a, b) => {
    const angleA = Math.atan2(a.y - lowest.y, a.x - lowest.x);
    const angleB = Math.atan2(b.y - lowest.y, b.x - lowest.x);
    return angleA - angleB;
  });

  const stack = [lowest, sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    while (stack.length >= 2) {
      const p1 = stack[stack.length - 2];
      const p2 = stack[stack.length - 1];
      const p3 = sorted[i];
      // Cross product
      const cross = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
      if (cross > 0) break;
      stack.pop();
    }
    stack.push(sorted[i]);
  }
  return stack;
}

/* Draw Team Convex Hulls showing Tactical Compactness */
function drawTeamConvexHulls(ctx, entities, w, h) {
  const pad = 24;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  const teamAPoints = entities
    .filter(e => e.team === 'teamA' && e.id !== 'A-GK')
    .map(e => ({ x: pad + (e.pitch.x / 105) * pw, y: pad + (e.pitch.y / 68) * ph }));

  const teamBPoints = entities
    .filter(e => e.team === 'teamB' && e.id !== 'B-GK')
    .map(e => ({ x: pad + (e.pitch.x / 105) * pw, y: pad + (e.pitch.y / 68) * ph }));

  ctx.save();

  // Draw Team A Hull
  if (teamAPoints.length >= 3) {
    const hullA = calculateConvexHull(teamAPoints);
    ctx.beginPath();
    ctx.moveTo(hullA[0].x, hullA[0].y);
    for (let i = 1; i < hullA.length; i++) ctx.lineTo(hullA[i].x, hullA[i].y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
  }

  // Draw Team B Hull
  if (teamBPoints.length >= 3) {
    const hullB = calculateConvexHull(teamBPoints);
    ctx.beginPath();
    ctx.moveTo(hullB[0].x, hullB[0].y);
    for (let i = 1; i < hullB.length; i++) ctx.lineTo(hullB[i].x, hullB[i].y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(248, 113, 113, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
  }

  ctx.restore();
}

/* Draw Formation Unit Connection Lines */
function drawFormationConnections(ctx, scenario, w, h) {
  const pad = 24;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  const entMap = {};
  scenario.entities.forEach(e => { entMap[e.id] = e; });

  ctx.save();
  ctx.lineWidth = 1.5;

  // Draw Team A lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  scenario.formationLinesA.forEach(line => {
    ctx.beginPath();
    let first = true;
    line.forEach(id => {
      const p = entMap[id];
      if (p) {
        const rx = pad + (p.pitch.x / 105) * pw;
        const ry = pad + (p.pitch.y / 68) * ph;
        if (first) { ctx.moveTo(rx, ry); first = false; }
        else { ctx.lineTo(rx, ry); }
      }
    });
    ctx.stroke();
  });

  // Draw Team B lines
  ctx.strokeStyle = 'rgba(248, 113, 113, 0.4)';
  scenario.formationLinesB.forEach(line => {
    ctx.beginPath();
    let first = true;
    line.forEach(id => {
      const p = entMap[id];
      if (p) {
        const rx = pad + (p.pitch.x / 105) * pw;
        const ry = pad + (p.pitch.y / 68) * ph;
        if (first) { ctx.moveTo(rx, ry); first = false; }
        else { ctx.lineTo(rx, ry); }
      }
    });
    ctx.stroke();
  });

  ctx.restore();
}

/* Draw Player Nodes on 2D Radar */
function drawTacticalRadarPlayers(ctx, entities, w, h) {
  const pad = 24;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  entities.forEach(ent => {
    const rx = pad + (ent.pitch.x / 105) * pw;
    const ry = pad + (ent.pitch.y / 68) * ph;
    const isHovered = (ent.id === hoveredEntityId);

    let color = '#38bdf8';
    let labelColor = '#070b12';
    if (ent.team === 'teamB') color = '#f87171';
    if (ent.team === 'referee') { color = '#fbbf24'; labelColor = '#070b12'; }
    if (ent.team === 'ball') { color = '#ffffff'; labelColor = '#070b12'; }

    ctx.save();

    // Pulse Ring on hover
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(rx, ry, 16, 0, Math.PI * 2);
      ctx.fillStyle = color === '#ffffff' ? 'rgba(255,255,255,0.2)' : `${color}33`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Player node circle
    const nodeRadius = ent.type === 'ball' ? 5 : isHovered ? 10 : 8;
    ctx.beginPath();
    ctx.arc(rx, ry, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = isHovered ? 14 : 6;
    ctx.fill();

    ctx.strokeStyle = '#070b12';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Node Text / ID label
    if (ent.type !== 'ball') {
      ctx.font = '700 8px "Outfit", sans-serif';
      ctx.fillStyle = labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const shortId = ent.id.split('-')[1] || ent.id;
      ctx.fillText(shortId, rx, ry);
    }

    // Hover Details Tooltip
    if (isHovered) {
      const tooltip = `${ent.label} | Pos: (${ent.pitch.x.toFixed(1)}m, ${ent.pitch.y.toFixed(1)}m)`;
      ctx.font = '600 10px "JetBrains Mono", monospace';
      const tw = ctx.measureText(tooltip).width;
      const tX = Math.min(Math.max(rx - tw / 2 - 8, pad), w - pad - tw - 16);
      const tY = ry - 24 < pad ? ry + 24 : ry - 24;

      ctx.fillStyle = 'rgba(7, 11, 18, 0.92)';
      ctx.fillRect(tX, tY, tw + 16, 20);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(tX, tY, tw + 16, 20);

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(tooltip, tX + 8, tY + 10);
    }

    ctx.restore();
  });
}

/* Update Telemetry UI metrics counters */
function updateTelemetryUI() {
  const scenario = TACTICAL_SCENARIOS[currentScenarioKey];
  if (!scenario) return;

  const widthEl = document.getElementById('telemetryWidth');
  const compactEl = document.getElementById('telemetryCompact');
  const defLineEl = document.getElementById('telemetryDefLine');
  const formationEl = document.getElementById('telemetryFormation');

  const widthBarA = document.getElementById('widthBarA');
  const widthBarB = document.getElementById('widthBarB');
  const compactBarA = document.getElementById('compactBarA');
  const compactBarB = document.getElementById('compactBarB');

  if (widthEl) widthEl.innerText = `${scenario.metrics.teamA.width.toFixed(1)}m / ${scenario.metrics.teamB.width.toFixed(1)}m`;
  if (compactEl) compactEl.innerText = `${scenario.metrics.teamA.compactness} m²`;
  if (defLineEl) defLineEl.innerText = `${scenario.metrics.teamA.defLine.toFixed(1)}m`;
  if (formationEl) formationEl.innerText = scenario.formationA.split(' ')[0];

  if (widthBarA) widthBarA.style.width = `${(scenario.metrics.teamA.width / 68) * 100}%`;
  if (widthBarB) widthBarB.style.width = `${(scenario.metrics.teamB.width / 68) * 100}%`;
  if (compactBarA) compactBarA.style.width = `${(scenario.metrics.teamA.compactness / 2000) * 100}%`;
  if (compactBarB) compactBarB.style.width = `${(scenario.metrics.teamB.compactness / 2000) * 100}%`;
}

/* ==========================================================================
   Interactive 5-Stage Pipeline Stepper & Code Switcher
   ========================================================================== */
const PIPELINE_STAGES = [
  {
    step: 1,
    title: 'Stage 1: YOLO Object Detection',
    tags: ['Ultralytics YOLOv8', 'PyTorch', 'Transfer Learning', 'Bounding Boxes'],
    explanation: 'PitchVision deploys a customized YOLO deep neural network fine-tuned on professional football datasets to detect and segment players, referees, goalkeepers, and the football in sub-50ms latency.',
    box1Title: 'Detection Targets',
    box1Desc: 'Localized entities include outfield players, goalkeepers (special kit), referees (fluorescent yellow/black), and the match ball with sub-pixel precision.',
    box2Title: 'Output Features',
    box2Desc: 'Produces bounding coordinates [x_min, y_min, x_max, y_max], class logits, object confidence scores, and player foot-contact ground points.',
    code: `# Stage 1: Fine-tuned YOLO Detection Pipeline
import torch
from ultralytics import YOLO

# Load PitchVision fine-tuned weights
model = YOLO('models/pitchvision_yolov8x_football.pt')

def detect_entities(frame):
    # Inference with test-time augmentation & NMS
    results = model(frame, conf=0.35, iou=0.45)[0]
    
    detections = {
        'players': [], 'referees': [], 'goalkeepers': [], 'ball': None
    }
    for box in results.boxes:
        cls_id = int(box.cls[0])
        cls_name = model.names[cls_id]
        bbox = box.xyxy[0].cpu().numpy() # [x1, y1, x2, y2]
        confidence = float(box.conf[0])
        
        detections[cls_name].append({
            'bbox': bbox,
            'conf': confidence,
            'ground_point': [(bbox[0]+bbox[2])/2, bbox[3]] # player foot contact
        })
    return detections`
  },
  {
    step: 2,
    title: 'Stage 2: Unsupervised Jersey & Team Classification',
    tags: ['K-Means Clustering', 'HSV Color Space', 'Scikit-Learn', 'Referee Separation'],
    explanation: 'Separating detected players into opposing teams without manual labeling. PitchVision extracts dominant jersey color histograms in HSV space, filters out green pitch background noise, and clusters players into Team A or Team B using unsupervised K-Means.',
    box1Title: 'Color Extraction & Pitch Masking',
    box1Desc: 'Crops player torso regions, converts RGB to HSV, and removes green turf hue bands (35-85°) to isolate primary kit pigmentation.',
    box2Title: 'Unsupervised Grouping',
    box2Desc: '2-cluster K-Means separates field players into Home and Away kits. Referees are identified via outlier color distances or dedicated detector heads.',
    code: `# Stage 2: Jersey Color Histogram & K-Means Clustering
import cv2
import numpy as np
from sklearn.cluster import KMeans

def classify_teams(player_crops):
    jersey_features = []
    for crop in player_crops:
        # Focus on upper torso (30% to 65% height of bounding box)
        h, w, _ = crop.shape
        torso = crop[int(h*0.3):int(h*0.65), int(w*0.2):int(w*0.8)]
        hsv = cv2.cvtColor(torso, cv2.COLOR_BGR2HSV)
        
        # Mask out grass green hue (35-85)
        mask = cv2.inRange(hsv, np.array([35, 40, 40]), np.array([85, 255, 255]))
        jersey_pixels = hsv[mask == 0]
        
        # Dominant color extraction via 1-cluster K-Means
        kmeans_torso = KMeans(n_clusters=1, n_init=5).fit(jersey_pixels)
        jersey_features.append(kmeans_torso.cluster_centers_[0])

    # Unsupervised 2-team separation
    kmeans_teams = KMeans(n_clusters=2, random_state=42).fit(jersey_features)
    team_assignments = kmeans_teams.labels_ # 0 = Team A, 1 = Team B
    return team_assignments`
  },
  {
    step: 3,
    title: 'Stage 3: Spatial Pitch Understanding & Homography',
    tags: ['OpenCV', 'Perspective Transformation', 'Planar Homography', 'Geometric CV'],
    explanation: 'To measure real tactical metrics (meters), PitchVision detects key pitch landmarks (touchlines, 18-yard lines, penalty arc, center circle) and computes a 3x3 Homography Matrix H that projects camera pixels onto a calibrated top-down 105m x 68m coordinate frame.',
    box1Title: 'Keypoint Detection & Line Intersections',
    box1Desc: 'OpenCV Hough Line Transform and deep keypoint regressors identify canonical pitch intersection points.',
    box2Title: 'Planar Perspective Warping',
    box2Desc: 'Mathematical projective transformation x_pitch = H * x_cam converts 2D skewed camera coordinates into metric pitch positions.',
    code: `# Stage 3: Pitch Homography & Coordinate Normalization
import cv2
import numpy as np

# Canonical FIFA Pitch Dimensions (105m x 68m)
CANONICAL_POINTS = np.array([
    [0.0, 0.0],       # Top-Left Corner
    [105.0, 0.0],     # Top-Right Corner
    [105.0, 68.0],    # Bottom-Right Corner
    [0.0, 68.0],      # Bottom-Left Corner
    [52.5, 0.0],      # Half-way top
    [52.5, 68.0]      # Half-way bottom
], dtype=np.float32)

def compute_homography(detected_keypoints):
    # Calculate 3x3 Projective Matrix H
    H, status = cv2.findHomography(detected_keypoints, CANONICAL_POINTS, cv2.RANSAC, 5.0)
    return H

def project_player_to_pitch(ground_point, H):
    # ground_point: [u, v] in camera pixel space
    p = np.array([ground_point[0], ground_point[1], 1.0], dtype=np.float32)
    p_pitch = np.dot(H, p)
    p_pitch /= p_pitch[2] # Normalize homogeneous coordinates
    return (p_pitch[0], p_pitch[1]) # Real-world (X, Y) in meters`
  },
  {
    step: 4,
    title: 'Stage 4: Automated Formation Detection & Positional Clustering',
    tags: ['Positional Clustering', 'Line Regression', 'Tactical Heuristics', 'Formation Matching'],
    explanation: 'From metric player coordinates (X, Y), the system groups players into positional lines along the pitch longitudinal axis (Defenders, Midfielders, Forwards) to automatically detect active structures (4-3-3, 4-2-3-1, 3-5-2, 5-3-2).',
    box1Title: 'Spatial Line Detection',
    box1Desc: '1D / 2D clustering along team orientation axis groups players into tactical tiers based on mean pitch depth.',
    box2Title: 'Formation Matching Algorithm',
    box2Desc: 'Counts players per tier and compares against tactical topology dictionaries, accounting for dynamic shifts and asymmetric fullbacks.',
    code: `# Stage 4: Formation Detection & Spatial Line Grouping
import numpy as np
from sklearn.cluster import AgglomerativeClustering

def infer_team_formation(players_pitch_coords, attacking_direction=1):
    # Sort outfield players by pitch X depth (relative to own goal)
    outfield = sorted(players_pitch_coords, key=lambda p: p[0] * attacking_direction)
    depths = np.array([[p[0]] for p in outfield])
    
    # Hierarchical clustering into 3 or 4 tactical lines
    clustering = AgglomerativeClustering(n_clusters=None, distance_threshold=8.5)
    line_labels = clustering.fit_predict(depths)
    
    # Count players per tactical line (Defenders -> Midfielders -> Forwards)
    unique_lines, counts = np.unique(line_labels, return_counts=True)
    formation_pattern = '-'.join(map(str, counts))
    
    # Formation matching dictionary
    TACTICAL_LOOKUP = {
        '4-3-3': '4-3-3 (High Press / Width Heavy)',
        '4-2-3-1': '4-2-3-1 (Mid Block Double Pivot)',
        '3-5-2': '3-5-2 (Wing-Back Overload)',
        '5-3-2': '5-3-2 (Compact Low Block)'
    }
    return TACTICAL_LOOKUP.get(formation_pattern, f'{formation_pattern} (Custom Shape)')`
  },
  {
    step: 5,
    title: 'Stage 5: Insight Generation & Actionable Analytics Dashboard',
    tags: ['Team Compactness', 'Defensive Line Height', 'Midfield Density', 'Spatial Hull'],
    explanation: 'The culminating intelligence layer converts raw coordinates into elite tactical key performance indicators (KPIs) — measuring team compactness surface area (m²), defensive line depth, tactical width, and midfield territorial dominance.',
    box1Title: 'Spatial Geometric Metrics',
    box1Desc: 'Computes convex hull area (m²), inter-line distances, lateral team stretch (m), and defensive offside line coordinates.',
    box2Title: 'Tactical Reporting',
    box2Desc: 'Feeds live interactive dashboards, visual radars, passing network graphs, and automated scouting report generators.',
    code: `# Stage 5: Spatial Metrics & Tactical Insight Calculation
from scipy.spatial import ConvexHull
import numpy as np

def compute_tactical_insights(team_players_pitch):
    coords = np.array(team_players_pitch)
    
    # 1. Team Convex Hull Area (Tactical Compactness in m²)
    hull = ConvexHull(coords)
    compactness_m2 = round(hull.volume, 1)
    
    # 2. Team Width & Length
    team_width = round(np.max(coords[:, 1]) - np.min(coords[:, 1]), 1)
    team_length = round(np.max(coords[:, 0]) - np.min(coords[:, 0]), 1)
    
    # 3. Defensive Line Height (Average Y depth of deepest 3 defenders)
    defensive_line_x = round(np.mean(sorted(coords[:, 0])[:3]), 1)
    
    # 4. Midfield Density (Players in Zone 14: X between 35m-70m)
    midfield_players = [p for p in coords if 35.0 <= p[0] <= 70.0]
    
    return {
        'compactness_sq_m': compactness_m2,
        'team_width_m': team_width,
        'team_length_m': team_length,
        'defensive_line_depth_m': defensive_line_x,
        'midfield_density_count': len(midfield_players)
    }`
  }
];

function initPipelineStepper() {
  const stepCards = document.querySelectorAll('.step-card');
  const stageTitle = document.getElementById('stageTitle');
  const stageTechTags = document.getElementById('stageTechTags');
  const stageExplanation = document.getElementById('stageExplanation');
  const stageBox1Title = document.getElementById('stageBox1Title');
  const stageBox1Desc = document.getElementById('stageBox1Desc');
  const stageBox2Title = document.getElementById('stageBox2Title');
  const stageBox2Desc = document.getElementById('stageBox2Desc');
  const stageCode = document.getElementById('stageCode');

  if (!stepCards.length || !stageTitle) return;

  function updateStageUI(index) {
    const stage = PIPELINE_STAGES[index];
    if (!stage) return;

    stepCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });

    stageTitle.innerText = stage.title;
    stageExplanation.innerText = stage.explanation;
    stageBox1Title.innerText = stage.box1Title;
    stageBox1Desc.innerText = stage.box1Desc;
    stageBox2Title.innerText = stage.box2Title;
    stageBox2Desc.innerText = stage.box2Desc;

    // Tech tags
    stageTechTags.innerHTML = stage.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

    // Code snippet
    stageCode.innerHTML = highlightCode(stage.code);
  }

  stepCards.forEach((card, idx) => {
    card.addEventListener('click', () => updateStageUI(idx));
  });

  // Initial stage render
  updateStageUI(0);
}

/* Lightweight Syntax Highlighter for Python Code */
function highlightCode(code) {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#.*$)/gm, '<span class="code-comment">$1</span>')
    .replace(/\b(import|from|def|return|for|in|if|else|elif|class|as|and|or|not|None|True|False)\b/g, '<span class="code-keyword">$1</span>')
    .replace(/\b(YOLO|KMeans|ConvexHull|AgglomerativeClustering|findHomography|cvtColor|inRange|dot)\b/g, '<span class="code-fn">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span class="code-str">$1</span>')
    .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="code-num">$1</span>');
}

/* ==========================================================================
   Active Scroll-Spy & Smooth Navigation Engine
   ========================================================================== */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = [];

  navLinks.forEach(link => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      const section = document.querySelector(hash);
      if (section) {
        sections.push({ id: hash, element: section, link: link });
      }
    }
  });

  function updateActiveNav() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const navOffset = 110; // Fixed navbar height + buffer
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Bottom of page check -> highlight last section
    if (scrollY + windowHeight >= documentHeight - 40) {
      if (sections.length > 0) {
        navLinks.forEach(l => l.classList.remove('active'));
        sections[sections.length - 1].link.classList.add('active');
        return;
      }
    }

    let activeSec = null;
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      const top = sec.element.offsetTop - navOffset;
      const height = sec.element.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        activeSec = sec;
        break;
      }
    }

    // Default to first section when near top
    if (!activeSec && scrollY < 250 && sections.length > 0) {
      activeSec = sections[0];
    }

    if (activeSec) {
      navLinks.forEach(l => l.classList.remove('active'));
      activeSec.link.classList.add('active');
    }
  }

  // Smooth click scroll with header offset
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const targetPos = targetEl.offsetTop - headerOffset;
        window.scrollTo({
          top: targetPos > 0 ? targetPos : 0,
          behavior: 'smooth'
        });

        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // RAF throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateActiveNav();
}
