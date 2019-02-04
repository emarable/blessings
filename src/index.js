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
  this.gainNode.gain.value = 1;
  
  this.globalVolume = 0;
  
  this.__buffers = [];
}
AudioChannel.prototype.play = function (audioObject) {
  if (!audioObject.source) {
    var source = this.audioContext.createBufferSource();
    source.buffer = audioObject.buffer;
    source.connect(this.gainNode);
    //source.connect(this.audioContext.destination);
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
AudioChannel.prototype.fade = function (volume) {
    this.gainNode.gain.value = this.globalVolume + volume;
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
  
  DEBUG: true,
	
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
		IMAGE.bgLevel1 = loadSprite('assets/level1/MAIN.jpg');
		IMAGE.fgLevel1 = loadSprite('assets/level1/FORE.png');
		IMAGE.ltLevel1 = loadSprite('assets/level1/LIGHTING.png');
    IMAGE.leaf1Level1 = loadSprite('assets/level1/BIG_LEAF_1.png');
    IMAGE.leaf2Level1 = loadSprite('assets/level1/BIG_LEAF_2.png');
    IMAGE.squirrel = loadSprite('assets/Squirrel.png');
    IMAGE.ocelot = loadSprite('assets/ocelot.png');
    IMAGE.speech = loadSprite('assets/Speech.png');

    IMAGE.bgLevel2 = loadSprite('assets/level2/MAIN.jpg');
    IMAGE.fgLevel2 = loadSprite('assets/level2/FORE.png');
    IMAGE.ltLevel2 = loadSprite('assets/level2/LIGHTING.png');
      

    IMAGE.bgLevel3 = loadSprite('assets/level3/MAIN.jpg');
    IMAGE.fgLevel3 = loadSprite('assets/level3/FORE.png');
    IMAGE.ltLevel3 = loadSprite('assets/level3/LIGHTING.png');

    IMAGE.bgLevel4 = loadSprite('assets/level4/MAIN.jpg');
    IMAGE.fgLevel4 = loadSprite('assets/level4/FORE.png');
    IMAGE.ltLevel4 = loadSprite('assets/level4/LIGHTING.png');
    IMAGE.bgEnding = loadSprite('assets/FIN.jpg');
    IMAGE.bgCredits = loadSprite('assets/Credits2.jpg');
    
    IMAGE.protagonistIdle1Left = loadSprite('assets/character/Still1.png');
    IMAGE.protagonistIdle2Left = loadSprite('assets/character/Still2.png');
    IMAGE.protagonistIdle3Left = loadSprite('assets/character/Still3.png');
    IMAGE.protagonistIdle1Right = loadSprite('assets/character/Still1R.png');
    IMAGE.protagonistIdle2Right = loadSprite('assets/character/Still2R.png');
    IMAGE.protagonistIdle3Right = loadSprite('assets/character/Still3R.png');
        
    IMAGE.protagonistMove1Left = loadSprite('assets/character/Move1.png');
    IMAGE.protagonistMove2Left = loadSprite('assets/character/Move2.png');
    IMAGE.protagonistMove3Left = loadSprite('assets/character/Move3.png');
    IMAGE.protagonistMove4Left = loadSprite('assets/character/Move4.png');
    IMAGE.protagonistMove1Right = loadSprite('assets/character/Move1R.png');
    IMAGE.protagonistMove2Right = loadSprite('assets/character/Move2R.png');
    IMAGE.protagonistMove3Right = loadSprite('assets/character/Move3R.png');
    IMAGE.protagonistMove4Right = loadSprite('assets/character/Move4R.png');
        
    IMAGE.protagonistRise1Left = loadSprite('assets/character/Rise1.png');
    IMAGE.protagonistRise2Left = loadSprite('assets/character/Rise2.png');
    IMAGE.protagonistRise1Right = loadSprite('assets/character/Rise1R.png');
    IMAGE.protagonistRise2Right = loadSprite('assets/character/Rise2R.png');
        
    IMAGE.protagonistFall1Left = loadSprite('assets/character/Fall1.png');
    IMAGE.protagonistFall2Left = loadSprite('assets/character/Fall2.png');
    IMAGE.protagonistFall1Right = loadSprite('assets/character/Fall1R.png');
    IMAGE.protagonistFall2Right = loadSprite('assets/character/Fall2R.png');
		
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
    MUSIC.title = loadAudio(MUSIC,'assets/music/Decline (Title).mp3');
    MUSIC.level1 = loadAudio(MUSIC,'assets/music/Clear Air (Forests).mp3');
    MUSIC.level2 = loadAudio(MUSIC,'assets/music/Bittersweet (Trees).mp3');
    MUSIC.level4 = loadAudio(MUSIC,'assets/music/Ascending the Vale (Cliffside).mp3');
    MUSIC.ending = loadAudio(MUSIC,'assets/music/Floating Cities (Clouds).mp3');
    
    SOUND = new AudioChannel(audioContext);
    SOUND.start = loadAudio(SOUND,'assets/sfx/start button.wav');
    SOUND.water = loadAudio(SOUND,'assets/sfx/water.wav');
    SOUND.landing = loadAudio(SOUND,'assets/sfx/landing.wav');
    SOUND.dialogue = loadAudio(SOUND,'assets/sfx/dialogue.wav');
    
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