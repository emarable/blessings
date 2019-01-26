var mainCanvas = null;
var mainContext = null;

window.onload = function () {
	Game.load();
	Game.start();
  
  var muteButton = document.getElementById('audio_mute');
  muteButton.addEventListener('click', function () {
    if (!MUSIC.isMuted) {
      MUSIC.mute();
    } else {
      MUSIC.unMute();
    }
    try {
      localStorage.setItem('gad.monday.mute', MUSIC.isMuted.toString());
    } catch (ex) {
      console.error('Error saving mute state: ',ex);
    }
  });
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

window.onresize = function () {
	canvasX = mainCanvas.offsetLeft;
	canvasY = mainCanvas.offsetTop;
};

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
    
    mainContext['imageSmoothingEnabled'] = false;       /* standard */
    mainContext['mozImageSmoothingEnabled'] = false;    /* Firefox */
    mainContext['oImageSmoothingEnabled'] = false;      /* Opera */
    mainContext['webkitImageSmoothingEnabled'] = false; /* Safari */
    mainContext['msImageSmoothingEnabled'] = false;     /* IE */
		
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
		
		IMAGE.splash = loadSprite('assets/bg_splash.png');
    IMAGE.bgTitle = loadSprite('assets/bg_title.png');
    IMAGE.edward = loadSprite('assets/sp_edward.png');
    IMAGE.wallGrass = loadSprite('assets/sp_wall_grass.png');
		
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
	
    var init = that.loader.require(IMAGE.splash);
    init.onComplete = function () { that.setState(controllerIntro); };
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

var controllerIntro = {
	onEnter: function () {
		this.t = 0;
	},
	step: function (elapsed) {
		this.t += elapsed;
		if (this.t >= 5000) {
			this.nextState();
		}
	},
	draw: function (ctx) {
		var alpha = 0;
		if (this.t < 1000) { alpha = this.t / 1000; }
		else if (this.t < 4000) { alpha = 1; }
		else if (this.t < 5000) { alpha = (5000 - this.t)/1000; }
		
		// Draw splash screen
		ctx.drawImage(IMAGE.splash.get(), 0, 0);
		
		// Clear the background
		ctx.globalAlpha = 1 - alpha;
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.rect(0,0,Game.WIDTH,Game.HEIGHT);
		ctx.fill();
		ctx.globalAlpha = 1;
	},
	mouseup: function (ev) {
		this.nextState();
	},
	keyup: function (ev) {
		if (ev.keyCode === 13) {
			this.nextState();
		}
	},
  
  nextState: function () {
    // var init = Game.loader.require(MUSIC.menu);
    var init = Game.loader.require(IMAGE.bgTitle);
    init.onComplete = function () { Game.setState(MainMenu); };
		Game.setState(init);
  }
}