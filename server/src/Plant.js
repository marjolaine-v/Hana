var Plant = function(id) {

    const ID            = id;
    const WATERING_TIME = 4; // in hours

	// MEMBER
	var self = this;

	self.lastWatering 	= null;
	self.humidity 		= null;

    self.MOOD_LIST = {
        Happy 	: false,
        Angry	: false,
        Thirsty	: false,
        Sleepy	: false,
        Bored   : false
    };

    self.datas          = [];

	
	// METHODS
	self.init = function() {
		self.MOOD_LIST.Happy = true;

        self.datas = [
            {"date": "09/23/2014", "humidity": 15, "temperature":24.3, "luminosity":49, "people_interested_in": null},
            {"date": "09/23/2014", "humidity": 15, "temperature":24.3, "luminosity":49, "people_interested_in": null},
            {"date": "09/24/2014", "humidity": 38, "temperature":16.6, "luminosity":57, "people_interested_in": null},
            {"date": "09/25/2014", "humidity": 13, "temperature":20.6, "luminosity":69, "people_interested_in": null},
            {"date": "09/26/2014", "humidity": 52, "temperature":25.0, "luminosity":67, "people_interested_in": null},
            {"date": "09/27/2014", "humidity": 60, "temperature":34.6, "luminosity":61, "people_interested_in": null},
            {"date": "09/28/2014", "humidity": 79, "temperature":18.8, "luminosity":23, "people_interested_in": null},
            {"date": "09/29/2014", "humidity": 41, "temperature":22.7, "luminosity":21, "people_interested_in": null},
            {"date": "09/30/2014", "humidity": 65, "temperature":20.2, "luminosity":52, "people_interested_in": null},
            {"date": "10/01/2014", "humidity": 32, "temperature":19.5, "luminosity":52, "people_interested_in": null},
            {"date": "10/02/2014", "humidity": 23, "temperature":23.6, "luminosity":52, "people_interested_in": null},
            {"date": "10/03/2014", "humidity": 20, "temperature":20.6, "luminosity":52, "people_interested_in": null},
            {"date": "10/04/2014", "humidity": 10, "temperature":25.2, "luminosity":52, "people_interested_in": null},
            {"date": "10/05/2014", "humidity": 47, "temperature":26.9, "luminosity":52, "people_interested_in": null},
            {"date": "10/06/2014", "humidity": 50, "temperature":27.1, "luminosity":52, "people_interested_in": null},
            {"date": "10/07/2014", "humidity": 65, "temperature":20.2, "luminosity":52, "people_interested_in": null},
            {"date": "10/08/2014", "humidity": 23, "temperature":20.5, "luminosity":52, "people_interested_in": null},
            {"date": "10/09/2014", "humidity": 32, "temperature":18.8, "luminosity":52, "people_interested_in": null},
            {"date": "10/10/2014", "humidity": 20, "temperature":17.3, "luminosity":52, "people_interested_in": null},
            {"date": "10/11/2014", "humidity": 10, "temperature":19.5, "luminosity":52, "people_interested_in": null},
            {"date": "10/12/2014", "humidity": 47, "temperature":19.0, "luminosity":52, "people_interested_in": null},
            {"date": "10/13/2014", "humidity": 50, "temperature":23.0, "luminosity":52, "people_interested_in": null}
        ];

        self.update();
	};


    // retourne l'ID de la plante
    self.getID = function() {
        return ID;
    };


    // met à jours la date du dernier arrosage
	self.updateLastWatering = function(date) {
		self.lastWatering       = date;
        self.MOOD_LIST.Thirsty  = false;
	};


    // met à jours l'humeur de la plante
    self.updateMood = function() {
        var currentDate = new Date();

        if(currentDate - self.lastWatering > WATERING_TIME) {
            self.MOOD_LIST.Thirsty = true;
        }

        console.log(currentDate - new Date(2014, 1, 1));
    };


    self.update = function() {
        self.updateMood();

        requestAnimationFrame(self.update);
    };


	// INIT
	self.init();
};

