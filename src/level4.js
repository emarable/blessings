levels[3] = new Level({
  width: 1200,
  height: 3000,
  background: 'bgLevel4',
  foreground: 'fgLevel4',
  lighting: 'ltLevel4',
  music: 'level4',
  assets: function () {
    return [];
  },
  nextState: function () { return Ending.init(); },
  walls: [
    [900,2880,400,200],
    [0,2800,100,200],
    [100,2895,390,200],
    [490,2930,150,200],
    [0,2990,1200,10],
  ],
  platforms: [
    [1060,2700,200,10],
    [0,2600,460,10],
    [680,2420,360,10],
    [180,2400,160,10],
    [900,2260,180,10],
    [960,2180,80,10],
    [580,2020,120,10],
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
  //protagonist: [800,2900],
  protagonist: [840,2300],
});