/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

	socket: null,
	isConnected: false,

	initialize: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady(), false);
	},

	onDeviceReady: function() {

		this.initApp();
	},

	initApp: function() {

		var self = this;


		/***********************************
		 * Local settings
		 ***********************************/
		var date = new Date();
		var days = ['DIM.', 'LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.'];
		var months = ['JAN.', 'FEV.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEP.', 'OCT.', 'NOV.', 'DEC.'];

		setInterval(function() {
			date = new Date();
			$('#hour').html(date.getHours() + ' : ' + date.getMinutes());
			$('#date').html(days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth() - 1]);
		},1000);




		/***********************************
		 * Try to connect to API
		 ***********************************/
		var connectedToMeteoAPI = false;
		console.log(">>>> Can access to meteo API?");
		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/weather?q=Annecy,fr',
			data: null,
			dataType: "json",
			success: function(data)
			{
				console.log("Yep. Set datas.");
				console.log(data);
				var t = data.main.temp_max - 273.15;
				var temp = '<h2>' + t + ' °C</h2>';
				var meteoicon = '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" />'
				var humidity = data.main.humidity;
				$('#meteo .content').html(temp + meteoicon);
			},
			error: function(e)
			{
				console.log("Nope.");
			}
		});




		/***********************************
		 * Socket io
		 ***********************************/
		console.log(">>>> Can connect to socket io?");
		if(typeof(io) !== 'undefined') {
			self.socket = io("http://127.0.0.1:3000");
			if(self.socket != null && self.socket != '') {

				self.socket.on("connect_error", function(error){
					console.log("Error", error);
					self.isConnected = false;
				});

				self.socket.on("connect", function() {
					console.log("Yep. Connected.");
					self.isConnected = true;
				});

				self.socket.on("plantDatas", function(datas) {
					if(datas != null && datas != '') {
						self.goToPlant(datas);
					}
				})
			}
			else {
				console.log("Nope. Problem with the connexion with Socket io.");
				self.isConnected = false;
			}
		}
		else {
			console.log("Nope. io is undefined.");
			self.isConnected = false;
		}




		/***********************************
		 * Clics
		 ***********************************/
		$('#watering').on('click', function(e) {
			e.preventDefault();
			console.log(">>>> Can water?");
			if(self.isConnected) {
				console.log("Yep. Send socket to server to water plant.");
				self.socket.emit("waterPlant");
			}
			else {
				self.displayModal("Sorry, you can't water the plant for now.", "Nope. You can't water the plant for now.");
			}
		});
		$('#plant').on('click', function(e) {
			e.preventDefault();
			console.log(">>>> Can access to plant datas?");
			if(self.isConnected) {
				console.log("Yep. Send socket to server to get datas' plant.");
				// self.socket.emit("getPlantDatas");
				$('body').addClass('plant_opened');
			}
			else {
				self.displayModal("Sorry, you can't access to the datas' plant for now. Try it later!", "Nope. You can't access to that part of the application.");
			}
		});
	},



	displayModal: function(message, log) {
		console.log(log);
		$('#modal #modal_message').html(message);
		$('#modal').modal();
	},



	goToPlant: function(datas) {
		console.log(datas);
	}
};

$(document).ready(function() {
	app.initialize();
});