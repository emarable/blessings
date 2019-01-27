levels[2] = new Level({
  width: 1200,
  height: 3000,
  background: 'bgLevel3',
  foreground: 'fgLevel3',
  lighting: 'ltLevel3',
  music: 'level3',
  nextState: function () { return showcases[0].init(); },
  walls: [
  ],
  platforms: [
  ],
  waters: [
  ],
  climbs: [
  ],
  dynamic: [
  ],
  doodads: [
  ],
  cutscenes: [
  ],
  protagonist: [100,1800],
});