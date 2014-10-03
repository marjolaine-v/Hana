var Plant = function(id) {

    const ID            = id;
    const WATERING_TIME = 4; // in hours

	/**************
	    MEMBERS
	**************/

	var self = this;

	self.lastWatering 	= null;

    self.lastCheckout   = {};

    self.MOOD_LIST = {
        Happy 	: false,
        Sleepy	: false,
        Excited	: false,
        Angry	: false,
        Thirsty	: false,
        Bored   : false
    };

    self.datas          = [];

    self.friends        = 0;


    /**************
        METHODS
     **************/

	self.init = function() {
		self.MOOD_LIST.Happy    = true;
        self.lastWatering       = new Date();

        self.datas = [
            {"date": "10/23/2014", "humidity": 15, "temperature":24.3, "luminosity":49},
            {"date": "10/23/2014", "humidity": 15, "temperature":24.3, "luminosity":49},
            {"date": "10/22/2014", "humidity": 38, "temperature":16.6, "luminosity":57},
            {"date": "10/21/2014", "humidity": 13, "temperature":20.6, "luminosity":69},
            {"date": "10/20/2014", "humidity": 52, "temperature":25.0, "luminosity":67},
            {"date": "10/19/2014", "humidity": 60, "temperature":34.6, "luminosity":61},
            {"date": "10/18/2014", "humidity": 79, "temperature":18.8, "luminosity":23},
            {"date": "10/17/2014", "humidity": 41, "temperature":22.7, "luminosity":21},
            {"date": "10/16/2014", "humidity": 65, "temperature":20.2, "luminosity":52},
            {"date": "10/15/2014", "humidity": 32, "temperature":19.5, "luminosity":52},
            {"date": "10/14/2014", "humidity": 23, "temperature":23.6, "luminosity":52},
            {"date": "10/13/2014", "humidity": 20, "temperature":20.6, "luminosity":52},
            {"date": "10/12/2014", "humidity": 10, "temperature":25.2, "luminosity":52},
            {"date": "10/11/2014", "humidity": 47, "temperature":26.9, "luminosity":52},
            {"date": "10/10/2014", "humidity": 50, "temperature":27.1, "luminosity":52},
            {"date": "10/09/2014", "humidity": 65, "temperature":20.2, "luminosity":52},
            {"date": "10/08/2014", "humidity": 23, "temperature":20.5, "luminosity":52},
            {"date": "10/07/2014", "humidity": 32, "temperature":18.8, "luminosity":52},
            {"date": "10/06/2014", "humidity": 20, "temperature":17.3, "luminosity":52},
            {"date": "10/05/2014", "humidity": 10, "temperature":19.5, "luminosity":52},
            {"date": "10/04/2014", "humidity": 47, "temperature":19.0, "luminosity":52},
            {"date": "10/03/2014", "humidity": 50, "temperature":23.0, "luminosity":52}
        ];

        setInterval(self.updateMood, 1000);
	};


    // retourne l'ID de la plante
    self.getID = function() {
        return ID;
    };


    self.getLastDatas = function() {
        return self.datas[0];
    };


    self.updatePeopleAround = function(val) {
        self.friends = val;
    };


    // met à jours la date du dernier arrosage
	self.updateLastWatering = function(date) {
		self.lastWatering       = date;
        self.MOOD_LIST.Thirsty  = false;
	};


    // met à jours l'humeur de la plante
    self.updateMood = function() {
        var currentDate = new Date();
        var milliseconds, seconds, minutes, hours, days;

        currentDate = (currentDate - (milliseconds = currentDate%1000)) / 1000;
        currentDate = (currentDate - (seconds = currentDate%60)) / 60;
        currentDate = (currentDate - (minutes = currentDate%60)) / 60;
        days        = (currentDate - (hours   = currentDate%24)) / 24;

        self.lastCheckout ={
            days            : days,
            hours           : hours,
            minutes         : minutes,
            seconds         : seconds,
            milliseconds    : milliseconds
        };

        self.checkThirsty();
        self.checkAngry();
        self.checkBored();
        self.checkExcited();
        self.checkHappy();
        self.checkSleepy();
    };


    // met à jours les données sur l'environnement de la plante
    self.updateData = function(data) {
        self.datas.unshift(data);

        if(self.datas.length > 100)
            self.datas.pop();
    };


    // check si la plante est contente
    self.checkHappy = function() {
        self.MOOD_LIST.Happy = !self.MOOD_LIST.Thirsty && (!self.MOOD_LIST.Bored || self.datas[0].temperature > 20);
    };


    // check si la plante est excitée
    self.checkExcited = function() {
        self.MOOD_LIST.Excited = self.friends > 1;
    };


    // check si la plante s'ennuie
    self.checkBored = function() {
        self.MOOD_LIST.Bored = !self.MOOD_LIST.Excited && !self.MOOD_LIST.Sleepy;
    };


    // check si la plante est en colère
    self.checkAngry = function() {
        self.MOOD_LIST.Angry = self.MOOD_LIST.Bored && self.MOOD_LIST.Thirsty;
    };


    // check si la plante est endormie
    self.checkSleepy = function() {
        self.MOOD_LIST.Sleepy = self.MOOD_LIST.Bored && (self.lastCheckout.hours < 8 || self.datas[0].luminosity < 20);
    };


    // check si la plante a besoin d'eau
    self.checkThirsty = function() {
        var currentDate = new Date();
        var diff = currentDate - self.lastWatering ;
        var sign = diff < 0 ? - 1 : 1;
        var milliseconds, seconds, minutes, hours, days;

        diff /= sign;
        diff = (diff - (milliseconds = diff%1000)) / 1000;
        diff = (diff - (seconds = diff%60)) / 60;
        diff = (diff - (minutes = diff%60)) / 60;
        days = (diff - (hours   = diff%24)) / 24;

        console.info(sign === 1 ? "Elapsed: " : "Remains: ",
                days            + " days, ",
                hours           + " hours, ",
                minutes         + " minutes, ",
                seconds         + " seconds, ",
                milliseconds    + " milliseconds.");

        if(hours >= WATERING_TIME) {
            self.MOOD_LIST.Thirsty = true;
        }
    };


	// INIT
	self.init();
};

