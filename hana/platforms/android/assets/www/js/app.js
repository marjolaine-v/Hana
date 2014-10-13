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
    shadowHeight: null,
    margins: null,
    socket: null,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady(), false);
        // this.onDeviceReady();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        var that = this;
        that.initApp();

        // Socket io
        this.socket = io("http://127.0.0.1:3000");
        this.socket.on("connect_error", function(error){
            console.log("Error", error);
        });

        this.socket.on("connect", function() {
            console.log("Connected");
        });


        this.socket.on('plant', function (data) {
            $('.infos #water span').html(data.lastWatering);
            $('.infos #humidity span').html(data.dayState.humidity);
            $('.infos #luminosity span').html(data.dayState.luminosity);
            $('.infos #temperature span').html(data.dayState.temperature);
        });


        /** Navigation **/
        $('#plant').on('click', function(e) {
            e.preventDefault();
            that.switchToPlant();
        });

        $('header h1').on('click', function(e) {
            e.preventDefault();
            that.switchToHome(that.shadowHeight, that.margins);
        });



        // /** CLIC ON THE ALERT **/
        // $("#warning").on("click", function(){

        //     if($(this).hasClass('water')) {
        //         console.log("ADD WATER (HTML)");
        //         that.socket.emit("btn-add-water");
        //     }
        // });
    },







    initApp: function() {

        var date = new Date();


        /** Time **/
        setInterval(function() {
            date = new Date();
            $('.hour').html(date.getHours());
            $('.minute').html(date.getMinutes());
        },1000);

        /** Height round **/
        $('.height-js').height($('.height-js').width());
        $('.height-js-content').height($('.height-js-content').width());
        this.shadowHeight = $('.height-js-80').width() * 0.8;
        $('.height-js-80').height(this.shadowHeight);
        $('.height-js-bordered-80').height($('.height-js-bordered-80').width() * 0.8);
        $('.height-js-bordered').height($('.height-js-bordered').width());

        this.margins = this.getMargins();
        console.log(this.margins);
        $('#main').css('marginTop', this.margins);
        $('#main').css('marginBottom', this.margins);

        $('.infos').hide();
    },






    getMargins: function() {
        return (($(window).height() - $('header').height() - $('footer').height() - 20) / 2) - ($('#round').height() / 2);
    },

    switchToPlant: function() {
        $('#wrapper').addClass('plant');
        $('#main').stop().animate({
            marginTop: 0,
            marginBottom: 0
        });
        $('.temp').fadeTo(1000, 0);
        $('.hour-minute').fadeTo(800, 0);

        $('.infos').slideDown(1000);

        $('.shadow').stop().animate({
            height: '0'
        }, 1000, function() {
            $('header').removeClass('blue').addClass('green');
            $('footer').removeClass('blue').addClass('green');
            $('.shadow').hide();
        });
        $('#plant .coloration').fadeOut(1000);
        $('#plant').stop().animate({
            borderWidth: '4px'
        }, 1000, function() {

        });
    },
    switchToHome: function(h, m) {

        $('#wrapper').removeClass('plant');
        $('.shadow').show();
        $('.infos').slideUp(1000);
        $('#plant .coloration').fadeIn(1000);
        $('#main').stop().animate({
            marginTop: m,
            marginBottom: m
        });
        $('.shadow').stop().animate({
            height: h
        }, 1000, function() {
            $('header').removeClass('green').addClass('blue');
            $('footer').removeClass('green').addClass('blue');
            $('.temp').fadeTo(500, 1);
            $('.hour-minute').fadeTo(200, 1);
        });
        $('#plant').stop().animate({
            borderWidth: '18px'
        }, 1000, function() {

        });
    },


    // warningElement: function(type) {
    //     switch(type) {
    //         case 'water':
    //             $('#warning').addClass('water').addClass('on').find('button').html('Arroser');
    //             $('#water').addClass('warning');
    //             break;
    //         case 'luminosity':
    //             $('#warning').addClass('on').find('button').html('Eclairer');
    //             $('#luminosity').addClass('warning');
    //             break;
    //     }
    // }
};
$(document).ready(function() {
    app.initialize();
});