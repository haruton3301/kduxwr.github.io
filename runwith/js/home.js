
$('.workinput-result').hide();

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
const db = firebase.firestore();

function getStringFromDate(date) {
 
    var year_str = date.getFullYear();
    //月だけ+1すること
    var month_str = 1 + date.getMonth();
    var day_str = date.getDate();
    var hour_str = date.getHours();
    var minute_str = date.getMinutes();
    var second_str = date.getSeconds();
    
    // month_str = ('0' + month_str).slice(-2);
    // day_str = ('0' + day_str).slice(-2);
    // hour_str = ('0' + hour_str).slice(-2);
    // minute_str = ('0' + minute_str).slice(-2);
    // second_str = ('0' + second_str).slice(-2);
    
    format_str = 'YYYY年MM月DD hh:mm';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    format_str = format_str.replace(/ss/g, second_str);
    
    return format_str;
   };

var userId;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log('logged in');
        userId = user.uid;

        console.log(userId);

        db.collection("workouts").where("uid", "==", userId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                
                let dateText = data.date.toLocaleDateString('ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                let timeText = data.date.toLocaleTimeString('ja-JP');
                let dateTimeText = dateText + timeText;
                let distance = data.distance;
                let time = data.time;
                let speed = data.speed;

                let html = `<div class="workout-child">
                    <div class="date">` + dateTimeText + `</div>
                    <div class="map"></div>
                    <div class="distance">` + distance + `</div>
                    <div class="time">` + time + `</div>
                    <div class="speed">` + speed + `</div>
                </div>`;

                let child = $(html).appendTo('.workout-list');
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    } else {
        window.location.href = "./index.html";
    } 
  });



