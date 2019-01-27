levels[1] = new Level({
  width: 1200,
  height: 3000,
  background: 'bgLevel2',
  foreground: 'fgLevel2',
  lighting: 'ltLevel2',
  music: 'level2',
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