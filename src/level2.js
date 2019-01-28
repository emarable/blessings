levels[1] = new Level({
  width: 1200,
  height: 3000,
  background: 'bgLevel2',
  foreground: 'fgLevel2',
  lighting: 'ltLevel2',
  music: 'level2',
  nextState: function () { return levels[2]; },
  walls: [
  ],
  platforms: [
      //Long platforms
      [0, 2830, 790, 10],
      [1080, 2830, 100, 10],
      //main road for windy tree
      [170, 2750, 50, 10],
      [160, 2660, 50, 10],
      [250, 2630, 60, 10],
      [350, 2620, 70, 10],
      [490, 2550, 70, 10],
      [270, 2420, 190, 10],
      [160, 2390, 70, 10],
      [0, 2340, 80, 10],
      [10, 2160, 80, 10],
      [60, 2100, 50, 10],
      [90, 2070, 40, 10],
      [150, 2000, 40, 10],
      [200, 1930, 40, 10],
      [260, 1840, 40, 10],
      [280, 1800, 40, 10],
      //bottom leaf
      [580, 1700, 50, 10],
      [610, 1650, 50, 10],
      [700, 1600, 100, 10],
      [820, 1500, 270, 10],
      [690, 1300, 400, 10],
      [380, 1240, 50, 100],
      //4th from top leaf
      [300, 1200, 100, 10],
      [180, 1100, 220, 10],
      [40, 980, 230, 10],
      [575, 950, 5, 10],
      //3rd from top leaf
      [585, 940, 5, 10],
      [612, 900, 3, 10],
      [650, 860, 10, 10],
      [700, 810, 100, 10],
      [760, 760, 200, 10],
      [880, 670, 290, 10],
      //2nd from top leaf
      [445, 667, 10, 10],
      [437, 660, 5, 10],
      [390, 620, 30, 10],
      [310, 580, 100, 10],
      [200, 530, 160, 10],
      [60, 480, 240, 10],
      [0, 400, 240, 10],
      //top leaf
      [655, 500, 10, 10],
      [655, 470, 10, 10],
      [660, 440, 10, 10],
      [680, 410, 20, 10],
      [690, 360, 40, 10],
      [735, 300, 70, 10],
      [820, 230, 120, 10],
      [860, 200, 220, 10],
      [920, 150, 300, 10]
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
    //665, 2730
  protagonist: [120,300],
});