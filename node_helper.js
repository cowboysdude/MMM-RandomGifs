/* Magic Mirror
    * Module: MMM-RandomGifs
    *
    * By Cowboysdude
    * 
    */
const NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
   getRandom: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                this.sendSocketNotification('RANDOM_RESULT', result);
            }
        });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_RANDOM') {
                this.getRandom(payload);
            }
         }  
    });
