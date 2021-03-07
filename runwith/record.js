$('.pause-button').hide();
$('.restart-button').hide();
$('.end-button').hide();
$('.countdown').hide();
$('.info').hide();

let countdownVal = 3;
let countupVal = 0;

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
var totalDistance = 0;

function getGps(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    latlng = {lat: lat, lng: lng};
}

function distance(lat1, lng1, lat2, lng2) {
    lat1 *= Math.PI / 180;
    lng1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lng2 *= Math.PI / 180;
    return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
}

function gpsIntervalFunc() {
    let prev = gpsHist.slice(-1)[0];
    console.log(prev)
    gpsHist.push(latlng);
    console.log(gpsHist);
    let d = distance(latlng.lat, latlng.lng, prev.lat, prev.lng);
    totalDistance += d;
    console.log(totalDistance);
    $('.distance').text(totalDistance.toFixed(2) + 'KM');
    $('.lat').text(latlng.lat);
    $('.lng').text(latlng.lng);
}

var countupInterval;
var gpsInterval;

$('.start-button').on('click', function() {
    $('.start').hide();
    $('.start-button').hide();
    $('.pause-button').show();
    $('.end-button').show();
    $('.countdown').show();
    $('.countdown').text(countdownVal);
    var countdownInterval = setInterval(function() {
        countdownVal--;
        $('.countdown').text(countdownVal);
        if(countdownVal == 0) {
            clearInterval(countdownInterval);
            $('.countdown').hide();
            $('.info').show();
            let min = Math.floor(countupVal / 60);
            let sec = Math.floor(countupVal % 60);
            let hour = Math.floor(min / 60);
            min = Math.floor(min % 60);
            let phour = ( '00' + hour ).slice( -2 );
            let pmin = ( '00' + min ).slice( -2 );
            let psec = ( '00' + sec ).slice( -2 );
            $('.countup').text(phour + ':' + pmin + ':' + psec);
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

window.onload = function () {
    navigator.geolocation.watchPosition(getGps, showError ,option);
}



// let map;
// const option = {
//     enableHighAccuracy: true,
//     maximumAge: 20000,
//     timeout: 1000000,
// };
// function mapsInit(position) {
//     console.log(position)
//     const lat = position.coords.latitude;
//     const lng = position.coords.longitude;
//     map = new Microsoft.Maps.Map('#map', {
//     center: {
//         latitude: lat, longitude: lng,
//     },
//     zoom: 15,
//     });
//     pushPin(lat, lng, map);
//     generateInfobox(lat, lng, map);
// }
// function generateInfobox(lat, lng, now) {
//     const location = new Microsoft.Maps.Location(lat, lng);
//     const infobox = new Microsoft.Maps.Infobox(location, {
//         title: 'イマココ',
//         description: "I'm here!!!",
//     });
//     infobox.setMap(now);
// }
// function pushPin(lat, lng, now) {
//     const location = new Microsoft.Maps.Location(lat, lng);
//     const pin = new Microsoft.Maps.Pushpin(location, {
//         color: 'navy',
//         visible: true,
//     });
//     now.entities.push(pin);
// }


// window.onload = function () {
//     navigator.geolocation.getCurrentPosition(mapsInit, showError, option);
// }