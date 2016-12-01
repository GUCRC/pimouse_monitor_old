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
	for( e in message )
		document.getElementById(e).innerHTML = message[e];
});

//CAMERA/////////////////////////////////////////////////////////
document.getElementById('camstream').data = 'http://'
        + location.hostname
        + ':10000/stream?topic=/usb_cam/image_raw';
