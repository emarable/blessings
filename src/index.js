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
function AudioChannel (context) {
  this.audioContext = context;
  this.defaultLoop = false;
  
  this.gainNode = this.audioContext.createGain();
  this.gainNode.connect(this.audioContext.destination);
  this.gainNode.gain.value = 0;
  
  this.__buffers = [];
}
AudioChannel.prototype.play = function (audioObject) {
  if (!audioObject.source) {
    var source = this.audioContext.createBufferSource();
    source.buffer = audioObject.buffer;
    source.connect(this.gainNode);
    source.connect(this.audioContext.destination);
    source.loop = this.defaultLoop;
    source.start();
    source.onended = function () {
      delete audioObject.source;
      audioObject.isPlaying = false;
    };
    
    audioObject.source = source;
    audioObject.isPlaying = true;
  }
};
AudioChannel.prototype.stop = function (audioObject) {
  if (audioObject.source) {
    audioObject.isPlaying = false;
    audioObject.source.stop();
    delete audioObject.source;
  }
};
AudioChannel.prototype.stopAll = function () {
  this.__buffers.forEach(this.stop);
};
AudioChannel.prototype.mute = function () {
    this.gainNode.gain.value = -1;
    this.isMuted = true;
};
AudioChannel.prototype.unMute = function () {
    this.gainNode.gain.value = 0;
    this.isMuted = false;
};

var MUSIC;
var SOUND;

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
    
    IMAGE.protagonistIdle1Left = loadSprite('assets/Still1.png');
    IMAGE.protagonistIdle2Left = loadSprite('assets/Still2.png');
    IMAGE.protagonistIdle3Left = loadSprite('assets/Still3.png');
    IMAGE.protagonistIdle1Right = loadSprite('assets/Still1R.png');
    IMAGE.protagonistIdle2Right = loadSprite('assets/Still2R.png');
    IMAGE.protagonistIdle3Right = loadSprite('assets/Still3R.png');
		
    function loadAudio (channel, path) {
      return Game.loader.register(path, "arraybuffer", function (data, callback) {
        audioContext.decodeAudioData(data).then(function (audioBuffer) {          
          var audioObject = {buffer: audioBuffer};          
          channel.__buffers.push(audioObject);
          callback(audioObject);
        });
      });
    }
    
    MUSIC = new AudioChannel(audioContext);
    MUSIC.defaultLoop = true;
    MUSIC.title = loadAudio(MUSIC,'assets/Decline (Title).mp3');
    MUSIC.level1 = loadAudio(MUSIC,'assets/Clear Air (Forests).mp3');
    
    SOUND = new AudioChannel(audioContext);
    SOUND.start = loadAudio(SOUND,'assets/start button.wav');
    
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
	
    var init = that.loader.require([
      IMAGE.bgTitle,
      MUSIC.title,
      SOUND.start,
    ]);
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
    if(this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(function() {
        console.log('audio on');
      });  
    }
	},
	keydown: function (ev) {
		if (this.ui.keydown) { this.ui.keydown(ev); }
	},
	keyup: function (ev) {
		if (this.ui.keyup) { this.ui.keyup(ev); }
	}
};