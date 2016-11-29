var ros = new ROSLIB.Ros({ url : 'ws://' + location.hostname + ':9000' });

ros.on('connection', function() {console.log('websocket: connected'); });
ros.on('error', function(error) {console.log('websocket error: ', error); });
ros.on('close', function() {console.log('websocket: closed');});

//SENSORS///////////////////////////////////////////////////////
var ls = new ROSLIB.Topic({
	ros : ros,
	name : '/lightsensors',
	messageType : 'pimouse_ros/LightSensorValues'
});

ls.subscribe(function(message) {
	for( e in message )
		document.getElementById(e).innerHTML = message[e];
});

//MOTORS/////////////////////////////////////////////////////////
var on = new ROSLIB.Service({
	ros : ros,
	name : '/motor_on',
	messageType : 'std_srvs/Trigger'
});

var off = new ROSLIB.Service({
	ros : ros,
	name : '/motor_off',
	messageType : 'std_srvs/Trigger'
});

var vel = new ROSLIB.Topic({
	ros : ros,
	name : '/motor_raw',
	messageType : 'pimouse_ros/MotorFreqs'
});

function pubMotorValues(){
	lhz = document.getElementById("left_hz_val").innerHTML;
	rhz = document.getElementById("right_hz_val").innerHTML;
	console.log(lhz);
	v = new ROSLIB.Message({left_hz: parseInt(lhz),right_hz : parseInt(rhz)});
	vel.publish(v);
}

document.getElementById("motor_on").addEventListener("click", function(e){
	req = on.callService(ROSLIB.ServiceRequest(),function(result){
		if(result.success)
		document.getElementById("motor_on").className = "btn btn-danger";
		document.getElementById("motor_off").className = "btn btn-default";
	});

});
	
document.getElementById("motor_off").addEventListener("click", function(e){
	req = off.callService(ROSLIB.ServiceRequest(),function(result){
		document.getElementById("motor_on").className = "btn btn-default";
		document.getElementById("motor_off").className = "btn btn-primary";
	});
});


document.getElementById("left_hz_slide").addEventListener("change", function(e){
	document.getElementById("left_hz_val").innerHTML 
		= document.getElementById("left_hz_slide").value;
//	vel.publish(motorFreqGen());
});

document.getElementById("right_hz_slide").addEventListener("change", function(e){
	document.getElementById("right_hz_val").innerHTML
	       = document.getElementById("right_hz_slide").value;
});

setInterval(pubMotorValues,100);

//CAMERA/////////////////////////////////////////////////////////
document.getElementById('camera').innerHTML += '<iframe src="http://'
	+ location.hostname 
	+ ':10000/stream?topic=/usb_cam/image_raw" style="width:320px;height:240px" />';


