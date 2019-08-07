const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = admin.initializeApp();

exports.loginUser = functions.https.onCall((data, context) => {
  let date = new Date();
  let email = "";
  let uid = "";
  email = context.auth.token.email;
  uid = context.auth.uid;
  console.log(date + " email:" + email + " UID:" + uid + " login");
  return {};
});

exports.logoutUser = functions.https.onCall((data, context) => {
  let date = new Date();
  let email = "";
  let uid = "";
  email = context.auth.token.email;
  uid = context.auth.uid;
  console.log(date + " email:" + email + " UID:" + uid + " logout");
  return {};
});

exports.postPost = functions.firestore
  .document("posts/{postId}")
  .onWrite((change, context) => {
    console.log(change.before.data());
    console.log(change.after.data());
    console.log(context);
    admin
      .firestore()
      .collection("fcmIdTokens")
      .get()
      .then(docSnapshots => {
        return docSnapshots.docs.map(doc => {
          let data = doc.data();
          let registrationToken = data.token;
          let message = {
            data: {
              message: "포스트 변경이 발생"
            },
            token: registrationToken
          };
          admin
            .messaging()
            .send(message)
            .then(response => {
              console.log('Successfully sent message:', response);
            })
            .catch(error => {
              console.log('Error sending message:', error);
            });
        });
      });
  });
