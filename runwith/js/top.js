const provider = new firebase.auth.GoogleAuthProvider();

$('.login-button').on('click', function() {
    firebase.auth().signInWithPopup(provider).then(result => {
        // // GoogleプロパイダのOAuthトークンを取得します。
        // const token = result.credential.accessToken;
        // // ログインしたユーザーの情報を取得します。
        // const user = result.user;
    }).catch(function(err) {
        console.error(err);
        // エラー処理
    });
});