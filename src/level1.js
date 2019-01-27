levels[0] = new Level({
  width: 1200,
  height: 2000,
  background: 'bgLevel1',
  foreground: 'fgLevel1',
  lighting: 'ltLevel1',
  music: 'level1',
  nextState: function () { return levels[1]; },
  walls: [
    [880,1800,100,100],
    [860,1820,400,100],
    [0,1880,520,100],
  ],
  platforms: [
    [940,1600,100,10],
    [590,1640,60,10],
    [550,1600,60,10],
    [480,1570,100,10],
    [470,1460,80,10],
    // L2
    [0,1300,500,10],
    [800,1340,500,10],
    // Rock
    [140,1160,140,10],
    [80,1080,80,10],
    [30,990,60,10],
    // Big leaf 1
    [350,730,220,10],
    // Leaves
    [280,520,130,10],
    [380,290,150,10],
    [140,120,150,10],
    // Big leaf 2
    [640,560,160,10],
    [790,400,160,10],
  ],
  waters: [
    [0,1910,1200,90],
  ],
  climbs: [
    [750,1480,20,300],
    [110,800,50,50],
  ],
  dynamic: [
    [BigLeaf,'leaf1Level1',250,700,100,10,220,40],
    [BigLeaf,'leaf2Level1',578,305,62,235,160,40],
  ],
  doodads: [
    ['squirrel',240,1600,0.3],
  ],
  cutscenes: [
    [200,1600,10, 300, {cutscene: 0}],
  ],
  protagonist: [100,1800],
  //protagonist: [440,200],
});