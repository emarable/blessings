levels[2] = new Level({
  width: 1200,
  height: 3000,
  background: 'bgLevel3',
  foreground: 'fgLevel3',
  lighting: 'ltLevel3',
  music: 'level3',
  assets: function () {
    return [];
  },
  nextState: function () { return showcases[0].init(); },
  walls: [
    [0,2895,1200,200],
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