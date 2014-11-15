var express = require('express')
var firebase = require('firebase')
var _ = require('underscore')
var app = express();

var ref = new firebase("https://simultube.firebaseio.com/");

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
    response.send('Hello World!')
});

ref.on('value', function (ValueRef) {
    var curScreen = ValueRef.child("screen");
    var video = ValueRef.child("video");
    var devices = ValueRef.child("devices");

    if (devices.length > 0) {
        var nearestDevice = devices[0];
        _.each(devices, function (device) {
            if (device.distance < nearestDevice.distance)
                nearestDevice = device
        });

        if (nearestDevice.distance > 2.0){
            console.log("no device is currently available")
            ValueRef.update({
                curScreen: ""
            })
        } else if (curScreen != nearestDevice.id) {
            ValueRef.update({
                curScreen: nearestDevice.id
            })
        }
    } else {
        console.log("no device is currently online");
    }
});

app.listen(app.get('port'), function () {
    console.log("Node app is running at localhost:" + app.get('port'))
});
