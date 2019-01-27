var mainCanvas = null;
var mainContext = null;

var ASPECT_RATIO = 1.676;

window.onload = function () {
	Game.load();
	Game.start();
};

var canvasX = 0;
var canvasY = 0;

var IMAGE = {};
var MUSIC = {
  play: function (context, audioObject) {
    if (!audioObject.source) {
    var source = context.createBufferSource();
    source.buffer = audioObject.buffer;
    source.connect(this.gainNode);
    source.connect(context.destination);
    source.loop = true;
    source.start();
    
    audioObject.source = source;
    audioObject.isPlaying = true;
    }
  },
  stop: function (audioObject) {
    if (audioObject.source) {
      audioObject.isPlaying = false;
      audioObject.source.stop();
      delete audioObject.source;
    }
  },
  stopAll: function () {
    this.__buffers.forEach(this.stop);
  },
  mute: function () {
    this.gainNode.gain.value = -1;
    this.isMuted = true;
  },
  unMute: function () {
    this.gainNode.gain.value = 0;
    this.isMuted = false;
  }
};

function updateViewport() {
	canvasX = mainCanvas.offsetLeft;
	canvasY = mainCanvas.offsetTop;
  
  var w = window.innerWidth;
  var h = window.innerHeight;
  if (w <= h * ASPECT_RATIO) {
    mainCanvas.width = w;
    mainCanvas.height = w / ASPECT_RATIO;
  } else {
    mainCanvas.width = h * ASPECT_RATIO;
    mainCanvas.height = h;
  }
  
  Game.WIDTH = mainCanvas.width;
  Game.HEIGHT = mainCanvas.height;
};
window.onresize = updateViewport;

var Game = {
	WIDTH: 640,
	HEIGHT: 480,
	
	difficulty: 0,
	currentMission: 0,
  
  loader: new Loader(),
  audioContext: new AudioContext(),

	load: function () {
    var audioContext = this.audioContext;
		mainCanvas = document.getElementById('main_canvas');
		mainContext = mainCanvas.getContext('2d');
		
		function loadSprite (path) {
      return Game.loader.register(path, "blob", function (data, callback) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
          var img = new Image();
          img.src = reader.result;
          callback(img);
        });
        reader.readAsDataURL(data);
      });
		}
		
		IMAGE.bgTitle = loadSprite('assets/Menu.jpg');
		IMAGE.bgLevel1 = loadSprite('assets/Level_1_MAIN.jpg');
		IMAGE.fgLevel1 = loadSprite('assets/Level_1_FORE.png');
		IMAGE.ltLevel1 = loadSprite('assets/Level_1_LIGHTING.png');
    IMAGE.leaf1Level1 = loadSprite('assets/Level_1_BIG_LEAF_1.png');
    IMAGE.leaf2Level1 = loadSprite('assets/Level_1_BIG_LEAF_2.png');
    
    IMAGE.protagonistIdle1 = loadSprite('assets/Still1.png');
    IMAGE.protagonistIdle2 = loadSprite('assets/Still2.png');
    IMAGE.protagonistIdle3 = loadSprite('assets/Still3.png');
		
    MUSIC.gainNode = audioContext.createGain();
    MUSIC.gainNode.connect(audioContext.destination);
    MUSIC.gainNode.gain.value = 0;
    
    MUSIC.__buffers = [];
    
    function loadMusic (path) {
      return Game.loader.register(path, "arraybuffer", function (data, callback) {
        audioContext.decodeAudioData(data).then(function (audioBuffer) {          
          var audioObject = {buffer: audioBuffer};          
          MUSIC.__buffers.push(audioObject);
          callback(audioObject);
        });
      });
    }
        
    try {
      if (localStorage.getItem('gad.monday.mute') === 'false') {
        MUSIC.unMute();
      } else {
        MUSIC.mute();
      }
    } catch (ex) {
      MUSIC.mute();
    }
		
		window.onresize();
	},
	start: function () {
		var that = this;
		mainCanvas.addEventListener('mousemove',function (ev) { that.mousemove(ev); });
		mainCanvas.addEventListener('mousedown',function (ev) { that.mousedown(ev); });
		mainCanvas.addEventListener('mouseup',function (ev) { that.mouseup(ev); });
		document.addEventListener('keydown',function (ev) { that.keydown(ev); });
		document.addEventListener('keyup',function (ev) { that.keyup(ev); });
    
    updateViewport();
	
    var init = that.loader.require(IMAGE.bgTitle);
    init.onComplete = function () { that.setState(MainMenu); };
		this.setState(init);
	
		this.loop();
	},
	loop: function (timeStamp) {
		if (this.lastTime) {
			this.elapsed = timeStamp - this.lastTime;
			this.lastTime = timeStamp;
		} else {
			this.elapsed = 100;
			this.lastTime = timeStamp;
		}		
		
		this.ui.step(this.elapsed);
		this.ui.draw(mainContext);
		
		var that = this;
		window.requestAnimationFrame(function (t) {
			that.loop(t);
		});
	},
	
	difficultyMod: function (value) {
		return value * (this.difficulty+1)/2;
	},
	
	setState: function (state) {
		this.ui = state;
		if (state.onEnter) { state.onEnter(); }
	},
		
	mousemove: function (ev) {
		if (this.ui.mousemove) { this.ui.mousemove(ev); }
	},
	mousedown: function (ev) {
		if (this.ui.mousedown) { this.ui.mousedown(ev); }
	},
	mouseup: function (ev) {
		if (this.ui.mouseup) { this.ui.mouseup(ev); }
	},
	keydown: function (ev) {
		if (this.ui.keydown) { this.ui.keydown(ev); }
	},
	keyup: function (ev) {
		if (this.ui.keyup) { this.ui.keyup(ev); }
	}
};