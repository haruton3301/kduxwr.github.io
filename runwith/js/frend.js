
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
    $('.non-chat-list').hide();
    var userId;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('logged in');
            userId = user.uid;
    
            console.log(userId);

            let userRef = db.collection('users').doc(userId);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    db.collection("users").doc(userId)
                    .get()
                    .then((querySnapshot) => {
                        console.log(querySnapshot);
                        console.log(querySnapshot.data())
                        // if(0 < querySnapshot.size) {
                        //     querySnapshot.forEach((doc) => {
                        //         let data = doc.data();

                        //         console.log(data);
           
                                
                        //     });
                        // } else {
                        //     $('.non-chat-list').show();
                        // }
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    window.location.href = "./register.html";
                }
            }).catch((error) => {
                window.location.href = "./register.html";
            });
        } else {
            window.location.href = "./index.html";
        } 
    });
}



