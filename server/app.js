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
	led: null,

	// Socket
	socket : null,

	// Plants' datas
	plant: {
		"plant_id":1,
		"last_watering":"29/09/2014",
		"datas": [
			{"date":"09/01/2014","humidity":43,"temperature":18.8,"luminosity":48,"people_interested_in":null},
			{"date":"09/02/2014","humidity":96,"temperature":26.1,"luminosity":13,"people_interested_in":null},
			{"date":"09/03/2014","humidity":33,"temperature":34.4,"luminosity":53,"people_interested_in":null},
			{"date":"09/04/2014","humidity":54,"temperature":26.5,"luminosity":16,"people_interested_in":null},
			{"date":"09/05/2014","humidity":56,"temperature":29.8,"luminosity":12,"people_interested_in":null},
			{"date":"09/06/2014","humidity":21,"temperature":15.8,"luminosity":28,"people_interested_in":null},
			{"date":"09/07/2014","humidity":43,"temperature":20.2,"luminosity":27,"people_interested_in":null},
			{"date":"09/08/2014","humidity":20,"temperature":27,"luminosity":32,"people_interested_in":null},
			{"date":"09/09/2014","humidity":36,"temperature":28,"luminosity":67,"people_interested_in":null},
			{"date":"09/10/2014","humidity":24,"temperature":24,"luminosity":58,"people_interested_in":null},
			{"date":"09/11/2014","humidity":79,"temperature":25.2,"luminosity":70,"people_interested_in":null},
			{"date":"09/12/2014","humidity":58,"temperature":22.2,"luminosity":47,"people_interested_in":null},
			{"date":"09/13/2014","humidity":30,"temperature":29.9,"luminosity":60,"people_interested_in":null},
			{"date":"09/14/2014","humidity":58,"temperature":30.7,"luminosity":11,"people_interested_in":null},
			{"date":"09/15/2014","humidity":63,"temperature":34.7,"luminosity":14,"people_interested_in":null},
			{"date":"09/16/2014","humidity":28,"temperature":23.3,"luminosity":30,"people_interested_in":null},
			{"date":"09/17/2014","humidity":58,"temperature":34.4,"luminosity":20,"people_interested_in":null},
			{"date":"09/18/2014","humidity":23,"temperature":19.5,"luminosity":36,"people_interested_in":null},
			{"date":"09/19/2014","humidity":85,"temperature":25.2,"luminosity":20,"people_interested_in":null},
			{"date":"09/20/2014","humidity":25,"temperature":15.2,"luminosity":40,"people_interested_in":null},
			{"date":"09/21/2014","humidity":28,"temperature":28.7,"luminosity":14,"people_interested_in":null},
			{"date":"09/22/2014","humidity":44,"temperature":15.9,"luminosity":54,"people_interested_in":null},
			{"date":"09/23/2014","humidity":15,"temperature":24.3,"luminosity":49,"people_interested_in":null},
			{"date":"09/24/2014","humidity":38,"temperature":16.6,"luminosity":57,"people_interested_in":null},
			{"date":"09/25/2014","humidity":13,"temperature":20.6,"luminosity":69,"people_interested_in":null},
			{"date":"09/26/2014","humidity":52,"temperature":25,"luminosity":67,"people_interested_in":null},
			{"date":"09/27/2014","humidity":60,"temperature":34.6,"luminosity":61,"people_interested_in":null},
			{"date":"09/28/2014","humidity":79,"temperature":18.8,"luminosity":23,"people_interested_in":null},
			{"date":"09/29/2014","humidity":41,"temperature":22.7,"luminosity":21,"people_interested_in":null},
			{"date":"09/30/2014","humidity":65,"temperature":20.2,"luminosity":52,"people_interested_in":null},
			{"date":"10/01/2014","humidity":23,"temperature":19.5,"luminosity":52,"people_interested_in":null},
			{"date":"10/02/2014","humidity":23,"temperature":19.5,"luminosity":52,"people_interested_in":null}
		]
	},

	// Day state of the plant
	dayState: null,

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

		// Créer les composants Arduino
		this.redLed = new this.five.Led({
			pin: 6
		});
		this.greenLed = new this.five.Led({
			pin: 3
		});
		this.waterLed = new this.five.Led({
			pin: 11
		});

		this.dayState = this.getDayState();
		this.analyzeDatas();



		// Arduino est ok, init du socket
		this.initSocket();
	},

	getDayState: function() {
		var today = new Date();
		today.setHours(0,0,0,0);
		var currentDate;

		for (var j = this.plant.datas.length - 1; j >= 0; j--) {
			currentDate = new Date(this.plant.datas[j].date);
			currentDate.setHours(0, 0, 0, 0);
			if(currentDate >= today) {
				return this.plant.datas[j];
			}
		};
	},

	analyzeDatas: function() {
		// Humidity
		this.setLeds('humidity', this.dayState.humidity);
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
			// res.sendFile('/wamp/www/tests/nodejs-arduino/add-water.html');
			res.sendFile('/wamp/www/tests/nodejs-arduino/add-water.html');
			// res.send('<!DOCTYPE html>' +
			// '<html>'+
			// 	'<head>'+
			// 		'<title></title>'+
			// 	'</head>'+
			// 	'<body>'+

			// 		'<button id="btn-add-water">Ajouter EAU</button>'+

			// 		'<script src="/socket.io/socket.io.js"></script>'+
			// 		'<script src="http://code.jquery.com/jquery-1.11.1.js"></script>'+
			// 		'<script>'+
			// 		'var socket = io("http://localhost:3000");'+

			// 		'socket.on("connect_error", function(error){'+
			// 			'console.log("Error", error);'+
			// 		'});'+

			// 		'socket.on("connect", function() {'+
			// 			'console.log("Connected");'+
			// 		'});'+

			// 		'$("#btn-add-water").on("click", function(){'+

			// 			'console.log("ADD WATER (HTML)");'+
			// 			'socket.emit("btn-add-water");'+
			// 		'});'+

			// 		'</script>'+

			// 	'</body>'+
			// '</html>');
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

		// Deconnexion
		this.socket.on('disconnect', this.socketDisconnect.bind(this));

		// On écoute nos événements
		this.socket.on('btn-add-water', this.btnAddWater.bind(this));
	},

	socketDisconnect : function(){

		console.log('User disconnected');
	},

	/**************
	 * Soket
	 *************/

	btnAddWater : function(){

		this.dayState = this.getDayState();
		this.dayState.humidity = this.dayState.humidity + 5;
		this.analyzeDatas();
	},




	/*************
	 * Plant functions
	 ************/
	setLeds: function(type, value) {
		switch(type) {
			case 'humidity':
				this.waterLed.on();
				if(value > 60 || value < 35) {
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