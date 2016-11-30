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
	name : '/cmd_vel',
	messageType : 'geometry_msgs/Twist'
});

function pubMotorValues(){
	fw = document.getElementById("vel_fw").innerHTML;
	rot = document.getElementById("vel_rot").innerHTML;

	fw = parseInt(fw)*0.001;
	rot = 3.141592*parseInt(rot)/180;
	v = new ROSLIB.Message({linear:{x:fw,y:0,z:0}, angular:{x:0,y:0,z:rot}});
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

document.getElementById("touchmotion").addEventListener("click", function(e){
	rect = document.getElementById("touchmotion").getBoundingClientRect();
	x = e.pageX - rect.left - window.pageXOffset;
	y = e.pageY - rect.top - window.pageYOffset;

	vel_fw = (rect.height/2 - y)*3;
	vel_rot = rect.width/2 - x;
	document.getElementById("vel_fw").innerHTML = parseInt(vel_fw);
	document.getElementById("vel_rot").innerHTML = parseInt(vel_rot);
});

/*
document.getElementById("left_hz_slide").addEventListener("change", function(e){
	document.getElementById("left_hz_val").innerHTML 
		= document.getElementById("left_hz_slide").value;
});

document.getElementById("right_hz_slide").addEventListener("change", function(e){
	document.getElementById("right_hz_val").innerHTML
	       = document.getElementById("right_hz_slide").value;
});
*/

setInterval(pubMotorValues,100);

//CAMERA/////////////////////////////////////////////////////////
document.getElementById('camera').innerHTML += '<object data=' 
	+ '"http://' + location.hostname + ':10000/stream?topic=/usb_cam/image_raw"'
	+ ' style="width:300px;height:240px"/>';


