
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
                    db.collection("users").doc(userId).collection('chat')
                    .get()
                    .then((querySnapshot) => {
                        console.log(querySnapshot);
                        if(0 < querySnapshot.size) {
                            querySnapshot.forEach((doc) => {
                                let data = doc.data();
                                let uid = data.uid;
                                console.log(data);

                                let userRef = db.collection('users').doc(uid);
                                userRef.get().then((doc) => {
                                    let data = doc.data();
                                    let name = data.display_name;
                                    let html = '<div class="chat-child">' + name + '<button class="' + uid + '">メッセージ</button></div>';
                                    let added = $(html).appendTo('.chat-list');
                                    added.find('button').on('click', async function() {
                                        $('.chat-list').hide();
                                        $('.message-list').show();
                                        $('.message-list').empty();

                                        let chat_id = $(this).attr('class');

                                        db.collection("users").doc(userId).collection('chat').doc(chat_id).collection('message')
                                        .get()
                                        .then((querySnapshot) => {
                                            console.log(querySnapshot);
                                            if(0 < querySnapshot.size) {
                                                querySnapshot.forEach((doc) => {
                                                    let data = doc.data();
                                                    console.log(data);

                                                });
                                            }
                                        });

                                        // let aite_id = $(this).attr('class');
                                        // let date = new Date();
                                        // await db.collection('users').doc(userId).collection('chat').doc(aite_id).set({
                                        //     uid: aite_id,
                                        // });
                                        // await db.collection('users').doc(aite_id).collection('chat').doc(userId).set({
                                        //     uid: userId,
                                        // });
                                        // await db.collection('users').doc(userId).collection('chat').doc(aite_id).collection('message').add({
                                        //     uid: aite_id,
                                        //     isMine: true,
                                        //     date: date,
                                        //     message: 'トークルームを開設しました。',
                                        // });
                                        // await db.collection('users').doc(aite_id).collection('chat').doc(userId).collection('message').add({
                                        //     uid: userId,
                                        //     isMine: false,
                                        //     date: date,
                                        //     message: 'トークルームを開設しました。',
                                        // });
                                    });
                                }).catch((error) => {
                                    
                                });
           
                                
                            });
                        } else {
                            $('.non-chat-list').show();
                        }
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



