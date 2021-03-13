
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

window.onload = function() {
    var userId;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('logged in');
            userId = user.uid;
    
            console.log(userId);

            let userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                window.location.href = "./home.html";
            }
        } else {
            window.location.href = "./index.html";
        } 
    });
}

$('.user-add-button').on('click', function() {
    db.collection('users').doc(userId).set({
        uid: userId,
        display_name: $('.input-name').val(),
        follow: [],
        chat: [],
    });

    window.location.href = "./home.html";
});




