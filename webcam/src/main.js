/**
 * Created by mgonzalez on 30/09/2014.
 */

require([
    "../libs/face_detector/ccv",
    "../libs/face_detector/face",
    "FaceDetector"
    ],

    function(main) {

    	var socket = io("http://127.0.0.1:3000");
        socket.on("connect_error", function(error){
            console.log("Error", error);
        });

        socket.on("connect", function() {
            console.log("Connected");
        });

        var cam = new FacesDetection();
    }
);

