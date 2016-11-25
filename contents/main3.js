var ros = new ROSLIB.Ros({ url : 'ws://' + location.hostname + ':9000' });

ros.on('connection', function() {console.log('websocket: connected'); });
ros.on('error', function(error) {console.log('websocket error: ', error); });
ros.on('close', function() {console.log('websocket: closed');});

var listener = new ROSLIB.Topic({
	ros : ros,
	name : '/lightsensors',
	messageType : 'pimouse_ros/LightSensorValues'
});

listener.subscribe(function(message) {
	str = JSON.stringify(message);
	for( e in message ){
		tbl = document.getElementById(e).innerHTML = message[e];
	}
});

