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
const gdb = new GeoFirestore(db);
const collection = gdb.collection('workouts');

window.onload = function() {
    $('.non-search-list').hide();
    var userId;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('logged in');
            userId = user.uid;
    
            console.log(userId);

            let userRef = db.collection('users').doc(userId);
            userRef.get().then((doc) => {
                if (doc.exists) {
                    db.collection("workouts").where("uid", "==", userId)
                    .orderBy("date", "desc").limit(1)
                    .get()
                    .then((querySnapshot) => {
                        console.log(querySnapshot);
                        if(0 < querySnapshot.size) {
                            querySnapshot.forEach((doc) => {
                                let data = doc.data();
                
                                gdb.collection('workouts').near({ 
                                    // 中心となる座標をGeoPointで指定
                                    center: data.g.geopoint,
                                    // 中心座標からの半径(km)を指定
                                    radius: 20,
                                }).get().then((d) => {
                                    let searchUsers = [];
                                    d.forEach((doc) => {
                                        let data = doc.data();
                                        console.log(data);
                                        searchUsers.push(data.uid);
                                    });
                                    let set = new Set(searchUsers);
                                    searchUsers = Array.from(set);
                                    let index = searchUsers.indexOf(userId);
                                    searchUsers.splice(index, 1);

                                    searchUsers.forEach((uid) => {
                                        let userRef = db.collection('users').doc(uid);
                                        userRef.get().then((doc) => {
                                            let data = doc.data();
                                            let name = data.display_name;
                                            let html = '<div class="search-child">' + name + '<button class="' + uid + '">メッセージ</button></div>';
                                            let added = $(html).appendTo('.search-list');
                                            added.find('button').on('click', async function() {
                                                let aite_id = $(this).attr('class');
                                                let date = new Date();
                                                await db.collection('users').doc(userId).collection('chat').doc(aite_id).collection('message').add({
                                                    uid: aite_id,
                                                    isMine: true,
                                                    date: date,
                                                    message: 'トークルームを開設しました。',
                                                });
                                                await db.collection('users').doc(aite_id).collection('chat').doc(userId).collection('message').add({
                                                    uid: userId,
                                                    isMine: false,
                                                    date: date,
                                                    message: 'トークルームを開設しました。',
                                                });
                                            });
                                        }).catch((error) => {
                                            
                                        });
                                    });
                                });
                            });
                        } else {
                            $('.non-search-list').show();
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

            gdb.collection('test').near({ 
                // 中心となる座標をGeoPointで指定
                center: new firebase.firestore.GeoPoint(35.306767, 138.9606928), 
                // 中心座標からの半径(km)を指定
                radius: 5 
            }).get().then((d) => {
                // ...略
            });
            

            
        } else {
            window.location.href = "./index.html";
        } 
    });
}



