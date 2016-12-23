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
	Object.keys(message).forEach(function(e){
		$("#"+e)[0].innerHTML = message[e];
	});
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
	fw = $("#vel_fw")[0].innerHTML;
	rot = $("#vel_rot")[0].innerHTML;

	fw = parseInt(fw)*0.001;
	rot = 3.141592*parseInt(rot)/180;
	v = new ROSLIB.Message({linear:{x:fw,y:0,z:0}, angular:{x:0,y:0,z:rot}});
	vel.publish(v);
}

$("#motor_on")[0].addEventListener("click", function(e){
	req = on.callService(ROSLIB.ServiceRequest(),function(result){
		if(result.success){
			$("#motor_on")[0].className = "btn btn-danger";
			$("#motor_off")[0].className = "btn btn-default";
		}
	});

});
	
$("#motor_off")[0].addEventListener("click", function(e){
	req = off.callService(ROSLIB.ServiceRequest(),function(result){
		if(result.success){
			$("#motor_on")[0].className = "btn btn-default";
			$("#motor_off")[0].className = "btn btn-primary";
		}
	});
});

$("#touchmotion")[0].addEventListener("click", function(e){
	rect = $("#touchmotion")[0].getBoundingClientRect();
	x = e.pageX - rect.left - window.pageXOffset;
	y = e.pageY - rect.top - window.pageYOffset;

	vel_fw = (rect.height/2 - y)*3;
	vel_rot = rect.width/2 - x;
	$("#vel_fw")[0].innerHTML = parseInt(vel_fw);
	$("#vel_rot")[0].innerHTML = parseInt(vel_rot);
});

setInterval(pubMotorValues,100);

//CAMERA/////////////////////////////////////////////////////////
$('#camstream')[0].data = 'http://' 
	+ location.hostname 
	+ ':10000/stream?topic=/cv_camera_node/image_raw';
