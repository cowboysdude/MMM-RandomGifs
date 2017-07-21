/* Magic Mirror
 * Module: MMM-RandomGifs
 *
 * By Cowboysdude
 * MIT Licensed.
 */
Module.register("MMM-RandomGifs", {

    defaults: {
        Key: "",   
		Search: "G",
		limit: "25",
		maxWidth: "350px",            
		rotateInterval: 5 * 1000,
		updateInterval: 10 * 60 * 1000,
		
		},                               

    start: function() {
    	this.url = "https://api.giphy.com/v1/gifs/search?api_key="+this.config.Key+"&q="+this.config.Search+"&limit="+this.config.limit+"&offset=0&rating=R&lang=en";
    	
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
    	
           for (var i = 0; i < this.Rimgs.data.length; i++) {
    	 if (this.activeItem >= this.Rimgs.data.length) {
                this.activeItem = 0;
           }
    	 var imgs = this.Rimgs.data[this.activeItem];
    	//console.log(imgs);
    	
        var wrapper = document.createElement("div");
        var image = document.createElement("img");
            image.src = imgs.images.downsized_large.url;
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
