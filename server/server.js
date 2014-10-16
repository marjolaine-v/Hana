var App = {

	// Jonnhy five
	five            : require("johnny-five"),

	// Http pour créer le serveur node
	http            : null,

	// Io pour le socket
	io              : null,

	// Arduino board
	board           : null,

	// Arduino components
	sleepyLed       : null,
	thirstyLed      : null,
	excitedLed      : null,
	boredLed		: null,
	happyLed		: null,
	angryLed		: null,
	wateringLed		: null,
	servo           : null,

	// Plant
	plant 			: null,
	thirstyNotif    : false,

	// Socket
	socket          : null,

	// Step for humidity, luminosity, temperature, etc.
	stepHumidity    : 5,

	// Min for humidity, luminosity, temperature, etc.
	minHumidity     : 35,




	/*******************************************
	 * INIT
	 *******************************************/
	init: function(){

		// Wait for arduinoReady
		this.board = new this.five.Board();
		this.board.on("ready", this.arduinoReady.bind(this));

		// DEBUG : just for tests without Arduino board
        // this.initSocket();
	},

	arduinoReady: function(){

        var fs = require('fs');
        var vm = require('vm');

        var includeInThisContext = function(path) {
            var code = fs.readFileSync(path);
            vm.runInThisContext(code, path);
        }.bind(this);
        includeInThisContext("./src/Plant.js");

        // Set plant
        this.plant = new Plant(1);
        this.plant.init();

		// Init Arduino
		this.initArduino();

		// Init du socket
		this.initSocket();
	},




	/*******************************************
	 * SOCKET
	 *******************************************/
	initSocket : function(){

		var http = require('http');
		var app = http.createServer(function(req, res) {
			res.end('Ok en attente...');
		}).listen(3000, '127.0.0.1');

		this.io = require('socket.io').listen(app);

		// Lance le socket quand un User se connecte
		this.io.sockets.on('connection', this.socketConnect.bind(this));
	},

	socketConnect : function(socket){

		// Socket
		this.socket = socket;

		// Deconnexion
		this.socket.on('disconnect', this.socketDisconnect.bind(this));

		// Webcam
		this.socket.on('faceDetected', this.faceDetected.bind(this));

		// APP
		this.socket.on('getPlantDatas', this.getPlantDatas.bind(this));
		this.socket.on('waterPlant', this.waterPlant.bind(this));

		var self = this;

		// DEBUG
		/*setTimeout(function() {
			self.setLeds(self);
			self.socket.emit("thirstyNotif");
		}, 5000);*/
	},

	socketDisconnect : function(){
		console.log('User disconnected');
	},




	/*******************************************
	 * WEBCAM
	 *******************************************/
	faceDetected : function(count) {
		if(this.plant) {
            this.plant.updatePeopleAround(parseInt(count));
        }
	},




	/*******************************************
	 * APPLICATION
	 *******************************************/
	getPlantDatas: function() {
		this.socket.emit("plantDatas", this.plant.getLastDatas());
	},

	waterPlant: function() {
		this.wateringLed.pulse(500);
		this.servo.to(100, 2000);
		var self = this;

		setTimeout(function() {
			self.wateringLed.stop().off();
			self.servo.to(0, 2000);
			self.plant.updateLastWatering(new Date());
			self.setLeds(self);
			self.thirstyNotif = false;
		}, 5000);
	},




	/*******************************************
	 * ARDUINO
	 *******************************************/
	initArduino: function() {

		// Set moods leds
		this.sleepyLed = new this.five.Led({
			pin: 11
		});
		this.thirstyLed = new this.five.Led({
			pin: 10
		});
		this.excitedLed = new this.five.Led({
			pin: 9
		});
		this.boredLed = new this.five.Led({
			pin: 8
		});
		this.happyLed = new this.five.Led({
			pin: 7
		});
		this.angryLed = new this.five.Led({
			pin: 6
		});


		// Water led
		this.wateringLed = new this.five.Led({
			pin: 3
		});


		// Servo
		this.servo = new this.five.Servo({
			pin: 5
		});
		this.servo.to(0);
		

		var self = this;

		// Set leds every second
		setInterval(function() {
			self.setLeds(self);

			// If thirsy & no notification sent, send a notification
			if(self.plant.MOOD_LIST.Thirsty) {
				if(!self.thirstyNotif && self.socket) {
					self.socket.emit("thirstyNotif");
					self.thirstyNotif = true;
				}
			}
		}, 1000);

		
	},

	setLeds: function(self) {

		// Sleepy led
		if(self.plant.MOOD_LIST.Sleepy) {
			self.sleepyLed.on();
		}
		else {
			self.sleepyLed.off();
		}

		// Thirsty led
		if(self.plant.MOOD_LIST.Thirsty) {
			self.thirstyLed.on();
		}
		else {
			self.thirstyLed.off();
		}

		// Excited led
		if(self.plant.MOOD_LIST.Excited) {
			self.excitedLed.on();
		}
		else {
			self.excitedLed.off();
		}

		// Bored led
		if(self.plant.MOOD_LIST.Bored) {
			self.boredLed.on();
		}
		else {
			self.boredLed.off();
		}

		// Happy led
		if(self.plant.MOOD_LIST.Happy) {
			self.happyLed.on();
		}
		else {
			self.happyLed.off();
		}

		// Angry led
		if(self.plant.MOOD_LIST.Angry) {
			self.angryLed.on();
		}
		else {
			self.angryLed.off();
		}
	}
};

App.init();