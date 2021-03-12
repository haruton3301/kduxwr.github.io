var firebaseConfig = {
    apiKey: "AIzaSyCr9eiIN966ucGKJfw4rdo_RncpFvCfbdU",
    authDomain: "runwith-9be83.firebaseapp.com",
    projectId: "runwith-9be83",
    storageBucket: "runwith-9be83.appspot.com",
    messagingSenderId: "683736651114",
    appId: "1:683736651114:web:ef9bf56c84355609b78113",
    measurementId: "G-X1NCY7LC7S"
    };
    
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log('logged in');
    } else {
        window.location.href = "./index.html";
    } 
  });


const firestore = firebase.firestore();
//const geoFirestore = new GeoFirestore(firestore);
const collection = firestore.collection('workouts')

collection.add({
    user: 'user',
});



const option = {
    enableHighAccuracy: true,
    maximumAge: 20000,
    timeout: 1000000,
};
function mapsInit(position) {
    console.log(position)
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
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
  }
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

var map;
window.onload = function () {
    navigator.geolocation.getCurrentPosition(mapsInit, showError ,option);
}

// $('.workinput-exe-button').on('click', function() {
//     var center = map.getCenter();
//     //Create array of locations
//     var coords = [];
//     for(let i = 0; i < gpsHist.length; i++) {
//         let location = new Microsoft.Maps.Location(gpsHist[i].lat, gpsHist[i].lng);
//         coords.push(location);
//     }
// });

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

