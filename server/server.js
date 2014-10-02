var App = {

	// Jonnhy five
	five: require("johnny-five"),


	// Express + Http pour créer le serveur node
	express: require('express')(),
	http : null,

	// Io pour le socket
	io: null,

	// Arduino board
	board: null,

	// Arduino components
	redLed: null,
	greenLed: null,
	waterLed: null,
	motor: null,

	// Socket
	socket : null,

	// Step for humidity, luminosity, temperature, etc.
	stepHumidity: 5,

	// Min for humidity, luminosity, temperature, etc.
	minHumidity: 35,

	// Plants' datas
	plant: {
		"plant_id":1,
		"last_watering":"29/09/2014",
		"datas": [
			{"date":"09/23/2014","humidity":15,"temperature":24.3,"luminosity":49,"people_interested_in":null},
			{"date":"09/24/2014","humidity":38,"temperature":16.6,"luminosity":57,"people_interested_in":null},
			{"date":"09/25/2014","humidity":13,"temperature":20.6,"luminosity":69,"people_interested_in":null},
			{"date":"09/26/2014","humidity":52,"temperature":25,"luminosity":67,"people_interested_in":null},
			{"date":"09/27/2014","humidity":60,"temperature":34.6,"luminosity":61,"people_interested_in":null},
			{"date":"09/28/2014","humidity":79,"temperature":18.8,"luminosity":23,"people_interested_in":null},
			{"date":"09/29/2014","humidity":41,"temperature":22.7,"luminosity":21,"people_interested_in":null},
			{"date":"09/30/2014","humidity":65,"temperature":20.2,"luminosity":52,"people_interested_in":null},
			{"date":"10/01/2014","humidity":32,"temperature":19.5,"luminosity":52,"people_interested_in":null},
			{"date":"10/02/2014","humidity":23,"temperature":23.6,"luminosity":52,"people_interested_in":null},
			{"date":"10/03/2014","humidity":20,"temperature":20.6,"luminosity":52,"people_interested_in":null},
			{"date":"10/04/2014","humidity":10,"temperature":25.2,"luminosity":52,"people_interested_in":null},
			{"date":"10/05/2014","humidity":47,"temperature":26.9,"luminosity":52,"people_interested_in":null},
			{"date":"10/06/2014","humidity":50,"temperature":27.1,"luminosity":52,"people_interested_in":null},
			{"date":"10/07/2014","humidity":65,"temperature":20.2,"luminosity":52,"people_interested_in":null},
			{"date":"10/08/2014","humidity":23,"temperature":20.5,"luminosity":52,"people_interested_in":null},
			{"date":"10/09/2014","humidity":32,"temperature":18.8,"luminosity":52,"people_interested_in":null},
			{"date":"10/10/2014","humidity":20,"temperature":17.3,"luminosity":52,"people_interested_in":null},
			{"date":"10/11/2014","humidity":10,"temperature":19.5,"luminosity":52,"people_interested_in":null},
			{"date":"10/12/2014","humidity":47,"temperature":19,"luminosity":52,"people_interested_in":null},
			{"date":"10/13/2014","humidity":50,"temperature":23,"luminosity":52,"people_interested_in":null}
		],
		"dayState": null
	},

	/**************
	 * INIT
	 *************/

	init: function(){

		console.log('Init');

		// Attends que l'Arduino soit prêt
		this.board = new this.five.Board();
		this.board.on("ready", this.arduinoReady.bind(this));
	},

	arduinoReady: function(){

		console.log('Arduino Ready');

		// Init Arduino
		this.initArduino();

		// Arduino est ok, init du socket
		this.initSocket();
	},

	initSocket : function(){

		console.log('Init Socket');

		// Serveur Http
		this.http = require('http').Server(this.express);

		// Socket IO pour communication avec page web
		this.io = require('socket.io').listen(this.http);

		// Routage : envoie le html sur http://localhost:3000
		// A remplacer par sendFile('path_to_/index.html)
		this.express.get('/', function(req, res){
			res.send('<!DOCTYPE html>' +
				'<html>' + 
				'<head lang="en">' + 
				    '<meta charset="UTF-8">' + 
				    '<title>Hana Cam Test</title>' + 
				'</head>' + 
				'<body>' + 
				    '<canvas id="cam-render" width="640" height="480"></canvas>' + 
				    '<video  id="video" width="640" height="480"></video>' + 
				'</body>' + 
				'<script src="http://localhost/socket.io/socket.io.js"></script>' + 
				'<script data-main="http://localhost/gobelins/Hana/server/src/main" src="http://localhost/gobelins/Hana/server/libs/require/require.js"></script>' + 
				'</html>'
			);
		});

		// Port 3000
		this.http.listen(3000, function(){
			console.log('listening on *:3000');
		});

		// Lance le socket quand un User se connecte
		this.io.on('connection', this.socketConnect.bind(this));
	},

	socketConnect : function(socket){

		console.log('User connected');

		// Socket
		this.socket = socket;

		// APP
		this.socket.emit('plant', this.getDatasForApp());

		// Deconnexion
		this.socket.on('disconnect', this.socketDisconnect.bind(this));

		// Lance le socket quand un User se connecte
		this.socket.on('faceDetected', this.faceDetected.bind(this));

		// // On écoute nos événements
		// this.socket.on('btn-add-water', this.btnAddWater.bind(this));
	},

	socketDisconnect : function(){

		console.log('User disconnected');
	},

	/**************
	 * Soket
	 *************/

	faceDetected : function(el) {
		console.log(el);
	},

	// btnAddWater : function(){

	// 	this.plant.dayState.humidity = this.plant.dayState.humidity + this.stepHumidity;

	// 	// Arduino
	// 	this.setLeds('humidity', this.plant.dayState.humidity);

	// 	// APP
	// 	this.socket.emit('plant', this.getDatasForApp());
	// },




	/*************
	 * APPLICATION
	 ************/

	getDatasForApp: function() {
		var datas = {};

		datas.dayState = this.plant.dayState;
		datas.lastWatering = this.plant.last_watering;
		datas.mins = {};
		datas.mins.humidity = this.minHumidity;
		datas.steps = {};
		datas.steps.humidity = this.stepHumidity;

		return datas;
	},








	/*************
	 * ARDUINO
	 ************/

	initArduino: function() {

		// Créer les composants Arduino
		this.redLed = new this.five.Led({
			pin: 9
		});
		this.greenLed = new this.five.Led({
			pin: 10
		});
		this.waterLed = new this.five.Led({
			pin: 11
		});
		this.motor = new this.five.Motor({
			pin: 3
		});

		this.board.repl.inject({
			motor: this.motor
		});

		var self = this;

		self.motor.on("start", function(err, timestamp) {
			console.log("start", timestamp);

			// Demonstrate motor stop in 2 seconds
			self.board.wait(2000, function() {
				self.motor.stop();
			});
		});

		this.motor.start();

		

		// Set dayState
		this.plant.dayState = this.getDayState();
		this.setLeds('humidity', this.plant.dayState.humidity);
	},

	getDayState: function() {
		var today = new Date();
		today.setHours(0,0,0,0);
		var currentDate;

		// JSON datas (if sensors to get datas, use them)
		for (var j = this.plant.datas.length - 1; j >= 0; j--) {
			currentDate = new Date(this.plant.datas[j].date);
			currentDate.setHours(0, 0, 0, 0);
			if(currentDate.getDate() == today.getDate() && currentDate.getMonth() == today.getMonth() && currentDate.getYear() == today.getYear()) {
				return this.plant.datas[j];
			}
		};
	},

	analyzeDatas: function() {

	},

	setLeds: function(type, value) {
		this.motor.start();
		switch(type) {
			case 'humidity':
				this.waterLed.on();
				if(value < this.minHumidity) {
					this.redLed.pulse(400);
					this.greenLed.stop().off();
				}
				else {
					this.redLed.stop().off();
					this.greenLed.pulse(1500);
				}
				break;
		}
	}
}

App.init();