/**
 * Created by mael on 02/10/2014.
 */

var FacesDetection = function() {
    /* MEMBERS */

    const SNAP_FREQ     = 15; // snapshot frequency : en frames

    var self = this;

    self.socket     = null;

    self.video      = null;
    self.ctx        = null;
    self.canvas     = null;

    self.authDetect = false;

    self.faces      = 0;
    self.frames     = 0;


    /* METHODS */

    // init la classe MyCamMotion
    self.init = function() {
        console.log("Init Faces Detection");

        // Socket

        self.socket = io("http://localhost:3000");
        self.socket.on("connect_error", function(error){
            console.log("Error", error);
        });

        self.socket.on("connect", function() {
            console.log("Connected");
        });



        // Canvas
        self.canvas = document.getElementById("cam-render");

        self.ctx    = self.canvas.getContext("2d");
        self.ctx.scale(-1, 1);

        self.video  = document.getElementById("video");
        self.video.autoplay =  true;

        navigator.getUserMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getUserMedia({
                video   : true,
                audio   : false
            },
            self.initCamera.bind(self),
            function() {
                console.log("Error");
            }
        );

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    };


    // retourne le nombre de visages detectés
    self.getFacesCount = function() {
        return self.faces;
    };


    // init Webcam
    self.initCamera = function(stream) {
        self.video.src =  window.URL.createObjectURL(stream);
        self.video.onloadedmetadata = function() {
            console.log("Load Meta Data");

            self.authDetect = true;

            setTimeout(self.updateCamera, 1000);
        };
    };


    // update camera on enter frame
    self.updateCamera = function() {
        self.frames++;

        if (self.authDetect && self.frames%SNAP_FREQ == 0) {
            self.frames = 0;

            self.snapshot();
            self.facesDetector();
        }

        requestAnimationFrame(self.updateCamera);
    };


    // Prend un snapshot de la webcam
    self.snapshot = function() {
        self.canvas.width   = self.video.videoWidth;
        self.canvas.height  = self.video.videoHeight;

        self.ctx.drawImage(self.video, 0, 0);
    };


    // détection des visages
    self.facesDetector = function() {
        var pos = ccv.detect_objects(
            {
                "canvas"        : self.canvas,
                "cascade"       : cascade,
                "interval"      : 2,
                "min_neighbors" : 1
            });

        self.ctx.lineWidth = 2;
        self.ctx.strokeStyle = 'rgba(230,87,0,0.8)';

        for (var i = 0; i < pos.length; i++) {
            self.ctx.beginPath();
            self.ctx.arc((pos[i].x + pos[i].width * 0.5), (pos[i].y + pos[i].height * 0.5),(pos[i].width + pos[i].height) * 0.25 * 1.2, 0, Math.PI * 2);
            self.ctx.stroke();
        }
        if(self.faces != pos.length) {
            self.socket.emit("faceDetected", pos.length);
        }
        self.faces = pos.length;
        console.log("Faces detected : " + pos.length);
    };


    self.init();
};
