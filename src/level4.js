levels[3] = new Level({
  width: 1200,
  height: 3000,
  background: 'bgLevel4',
  foreground: 'fgLevel4',
  lighting: 'ltLevel4',
  music: 'level4',
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