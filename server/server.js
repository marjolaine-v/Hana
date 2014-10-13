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
	motor           : null,

	// Socket
	socket          : null,

	// Step for humidity, luminosity, temperature, etc.
	stepHumidity    : 5,

	// Min for humidity, luminosity, temperature, etc.
	minHumidity     : 35,

	/**************
	 * INIT
	 *************/

	init: function(){
		console.log('Init');

		// Attends que l'Arduino soit prêt
		this.board = new this.five.Board();
		this.board.on("ready", this.arduinoReady.bind(this));

		// Just for tests without Arduino board
        // this.initSocket();
	},

	arduinoReady: function(){
		console.log('Arduino Ready');

        var fs = require('fs');
        var vm = require('vm');

        var includeInThisContext = function(path) {
            var code = fs.readFileSync(path);
            vm.runInThisContext(code, path);
        }.bind(this);
        includeInThisContext("./src/Plant.js");

        this.plant = new Plant(1);
        this.plant.init();

		// Init Arduino
		this.initArduino();

		// Arduino est ok, init du socket
		this.initSocket();
	},

	initSocket : function(){

		console.log('Init Socket');

		var http = require('http');
		var app = http.createServer(function(req, res) {
			res.end('Ok en attente...');
		}).listen(3000, '127.0.0.1');

		this.io = require('socket.io').listen(app);

		// Lance le socket quand un User se connecte
		this.io.sockets.on('connection', this.socketConnect.bind(this));
	},

	socketConnect : function(socket){
		console.log('User connected');

		var self = this;

		// Socket
		self.socket = socket;

		// Deconnexion
		self.socket.on('disconnect', self.socketDisconnect.bind(this));

		// APP
		self.socket.on('getPlantDatas', self.getPlantDatas.bind(this));
		self.socket.on('waterPlant', self.waterPlant.bind(this));
	},

	socketDisconnect : function(){

		console.log('User disconnected');
	},

	/**************
	 * Soket
	 *************/

	faceDetected : function(count) {
		if(this.plant) {
            this.plant.updatePeopleAround(parseInt(count));
        }
	},


	/*************
	 * APPLICATION
	 ************/

	getPlantDatas: function() {
		var self = this;
		self.socket.emit("plantDatas", self.plant.getLastDatas());
	},


	/*************
	 * ARDUINO
	 ************/

	initArduino: function() {

		var self = this;

		// Moods leds
		self.sleepyLed = new self.five.Led({
			pin: 11
		});
		self.thirstyLed = new self.five.Led({
			pin: 10
		});
		self.excitedLed = new self.five.Led({
			pin: 9
		});
		self.boredLed = new self.five.Led({
			pin: 8
		});
		self.happyLed = new self.five.Led({
			pin: 7
		});
		self.angryLed = new self.five.Led({
			pin: 6
		});


		// Water led
		self.wateringLed = new self.five.Led({
			pin: 3
		});


		// Motor
		self.motor = new self.five.Motor({
			pin: 5
		});

		// self.motor.on("start", function(err, timestamp) {
		// 	console.log("start", timestamp);

		// 	// Demonstrate motor stop in 2 seconds
		// 	self.board.wait(2000, function() {
		// 		self.motor.stop();
		// 	});
		// });

		// this.motor.start();

		self.setLeds();
	},

	setLeds: function() {

		var self = this;
		console.log(self.plant.MOOD_LIST);

		if(self.plant.MOOD_LIST.Sleepy) {
			self.sleepyLed.on();
		}
		else {
			self.sleepyLed.off();
		}

		if(self.plant.MOOD_LIST.Thirsty) {
			self.thirstyLed.on();
		}
		else {
			self.thirstyLed.off();
		}

		if(self.plant.MOOD_LIST.Excited) {
			self.excitedLed.on();
		}
		else {
			self.excitedLed.off();
		}

		if(self.plant.MOOD_LIST.Bored) {
			self.boredLed.on();
		}
		else {
			self.boredLed.off();
		}

		if(self.plant.MOOD_LIST.Happy) {
			self.happyLed.on();
		}
		else {
			self.happyLed.off();
		}

		if(self.plant.MOOD_LIST.Angry) {
			self.angryLed.on();
		}
		else {
			self.angryLed.off();
		}
	},

	waterPlant: function() {
		this.wateringLed.pulse(500);
		// this.plant.updateLastWatering();
		this.setLeds();
	}
};

App.init();