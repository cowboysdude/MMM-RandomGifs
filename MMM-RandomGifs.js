/* Magic Mirror
 * Module: MMM-RandomGifs
 *
 * By Mykle1
 * MIT Licensed.
 */
Module.register("MMM-RandomGifs", {

    defaults: {
        picName: "2.gif",   // .jpg, .gif, .png, etc.. (animated gif's too!)
		maxWidth: "350px",             // your picture files go in "pix" folder of module
		rotateInterval: 5 * 1000,
		updateInterval: 10 * 60 * 1000,
		
		},                               

    start: function() {
    	this.url = "http://gifbase.com/tag/lust?format=json";
        this.Rimgs = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },
    

    getStyles: function() {
        return ["MMM-RandomGifs.css"]
    },

    // Override dom generator.
    getDom: function() {
    	
           for (var i = 0; i < this.Rimgs.gifs.length; i++) {
    	 if (this.activeItem >= this.Rimgs.gifs.length) {
                this.activeItem = 0;
           }
    	 var imgs = this.Rimgs.gifs[this.activeItem];
    	
    	
        var wrapper = document.createElement("div");
        var image = document.createElement("img");
            image.src = imgs.url;
            image.className = "photo";
			image.style.maxWidth = this.config.maxWidth;
			
			}
        wrapper.appendChild(image);
        return wrapper;
    },
    
    processRandom: function(data) {
        this.today = data.Today;
        this.Rimgs = data; 
 console.log(this.Rimgs);
        this.loaded = true;
    },

    scheduleCarousel: function() {
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getRandom();
        }, this.config.updateInterval);
        this.getRandom(this.config.initialLoadDelay);
    },

    getRandom: function() {
        this.sendSocketNotification('GET_RANDOM', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "RANDOM_RESULT") {
            this.processRandom(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
    
});