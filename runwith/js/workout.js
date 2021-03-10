$('.pause-button').hide();
$('.restart-button').hide();
$('.end-button').hide();
$('.countdown').hide();
$('.info').hide();

$('.workresult').hide();

let countdownVal = 3;
let countupVal = 0;

function sec2str(second) {
    let min = Math.floor(second / 60);
    let sec = Math.floor(second % 60);
    let hour = Math.floor(min / 60);
    min = Math.floor(min % 60);
    let phour = ( '00' + hour ).slice( -2 );
    let pmin = ( '00' + min ).slice( -2 );
    let psec = ( '00' + sec ).slice( -2 );
    return (phour + ':' + pmin + ':' + psec);
}

function countupIntervalFunc() {
    countupVal++;
    let min = Math.floor(countupVal / 60);
    let sec = Math.floor(countupVal % 60);
    let hour = Math.floor(min / 60);
    min = Math.floor(min % 60);
    let phour = ( '00' + hour ).slice( -2 );
    let pmin = ( '00' + min ).slice( -2 );
    let psec = ( '00' + sec ).slice( -2 );
    $('.countup').text(phour + ':' + pmin + ':' + psec);
}

var gpsHist = [];
var latlng;
var speed;
var totalDistance = 0;

function getGps(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    latlng = {lat: lat, lng: lng};
    speed = position.coords.speed;
}

function distance(lat1, lng1, lat2, lng2) {
    lat1 *= Math.PI / 180;
    lng1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lng2 *= Math.PI / 180;
    return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}

function gpsIntervalFunc() {
    if(0 < gpsHist.length) {
        let prev = gpsHist.slice(-1)[0];
        let d = distance(latlng.lat, latlng.lng, prev.lat, prev.lng);

        if(!Number.isNaN(d)) {
            
            totalDistance += d;
            console.log(totalDistance);
            $('.distance').text(totalDistance.toFixed(2) + 'KM');
            $('.lat').text(latlng.lat);
            $('.lng').text(latlng.lng);
            if(speed == null) {
                $('.speed').text('null');
            } else {
                $('.speed').text(speed);
            }
        }
    } else {
        gpsHist.push(latlng);
    }   
}

var countupInterval;
var gpsInterval;

$('.start-button').on('click', function() {
    $('.start').hide();
    $('.start-button').hide();
    $('.countdown').show();
    $('.countdown').text(countdownVal);
    var countdownInterval = setInterval(function() {
        countdownVal--;
        $('.countdown').text(countdownVal);
        if(countdownVal == 0) {
            clearInterval(countdownInterval);
            $('.pause-button').show();
            $('.end-button').show();
            $('.countdown').hide();
            $('.info').show();
            $('.countup').text(sec2str(countupVal));
            $('.distance').text(totalDistance.toFixed(2) + 'KM');
            countupInterval = setInterval(countupIntervalFunc, 1000);
            gpsInterval = setInterval(gpsIntervalFunc, 1000);
        }
    }, 1000);
});

$('.pause-button').on('click', function() {
    $('.pause-button').hide();
    $('.restart-button').show();
    clearInterval(countupInterval);
    clearInterval(gpsInterval);
});

$('.restart-button').on('click', function() {
    $('.restart-button').hide();
    $('.pause-button').show();
    countupInterval = setInterval(countupIntervalFunc, 1000);
    gpsInterval = setInterval(gpsIntervalFunc, 1000);
});

const option = {
    enableHighAccuracy: true,
    maximumAge: 20000,
    timeout: 1000000,
};
function showError(error) {
    let e = '';
    if(error.code == 1) {
    e = '位置情報が許可されていません';
    } else if(error.code == 2) {
    e = '現在位置を特定できません';
    } else if(error.code == 3) {
    e = '位置情報を取得する前にタイムアウトになりました';
    }
    alert('error:' + e);
}

var watchId;
var map;
window.onload = function () {
    watchId = navigator.geolocation.watchPosition(getGps, showError ,option);
}

$('.end-button').on('click', function() {
    console.log('end');
    clearInterval(gpsInterval);
    clearInterval(countupInterval);
    navigator.geolocation.clearWatch(watchId);

    $('.workout').hide();
    $('.workresult').show();

    const lat = gpsHist[0].lat;
    const lng = gpsHist[0].lng;
    map = new Microsoft.Maps.Map('.map', {
    center: {
        latitude: lat, longitude: lng,
    },
    mapTypeId: Microsoft.Maps.MapTypeId.road,
    enableSearchLogo: false,
    enableClickableLogo:false,
    showDashboard:false,
    zoom: 15,
    });
    // pushPin(lat, lng, map);
    // generateInfobox(lat, lng, map);

    //線
    var locations = [];
    for(let i = 0; i < gpsHist.length; i++) {
        locations.push(new Microsoft.Maps.Location(gpsHist[i].lat, gpsHist[i].lng));
    }
    var line = new Microsoft.Maps.Polyline(locations,{
    strokeColor:new Microsoft.Maps.Color(0xff, 0, 0, 0x99),
    strokeThickness:2
    });
    map.entities.push(line);

    $('.record .distance').text(totalDistance.toFixed(2) + 'KM');
    $('.record .time').text(sec2str(countupVal));

    let aveTime = Math.floor(countupVal / totalDistance);

    let min = Math.floor(aveTime / 60);
    let sec = Math.floor(aveTime % 60);
    let pmin = ( '00' + min ).slice( -2 );
    let psec = ( '00' + sec ).slice( -2 );
    $('.record .speed').text(pmin + '分' + psec + '秒 / キロ');

});

function generateInfobox(lat, lng, now) {
    const location = new Microsoft.Maps.Location(lat, lng);
    const infobox = new Microsoft.Maps.Infobox(location, {
        title: 'イマココ',
        description: "I'm here!!!",
    });
    infobox.setMap(now);
}
function pushPin(lat, lng, now) {
    const location = new Microsoft.Maps.Location(lat, lng);
    const pin = new Microsoft.Maps.Pushpin(location, {
        color: 'navy',
        visible: true,
    });
    now.entities.push(pin);
}