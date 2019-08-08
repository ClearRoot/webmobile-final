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
  .onCreate((snap, context) => {
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
              message: "새로운 포스터를 작성했습니다.",
              title: snap.data().title,
              owner: snap.data().ownerDisplayName
            },
            token: registrationToken
          };
          admin
            .messaging()
            .send(message)
            .then(response => {
              console.log("Successfully sent message:", response);
            })
            .catch(error => {
              console.log("Error sending message:", error);
            });
        });
      });
  });

exports.postPortfolio = functions.firestore
  .document("portfolios/{portfolioId}")
  .onCreate((snap, context) => {
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
              message: "새로운 포트폴리오를 작성했습니다.",
              title: snap.data().title,
              owner: snap.data().ownerDisplayName
            },
            token: registrationToken
          };
          admin
            .messaging()
            .send(message)
            .then(response => {
              console.log("Successfully sent message:", response);
            })
            .catch(error => {
              console.log("Error sending message:", error);
            });
        });
      });
  });
