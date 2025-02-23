import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/messaging";
import "firebase/auth";
import store from "../store";
const POSTS = "posts";
const PORTFOLIOS = "portfolios";
const IMAGEURLS = "imageurls";
const USERS = "users";
const FCMIDTOKENS = "fcmIdTokens";

// Setup Firebase
const config = {
  apiKey: "AIzaSyD1wKYdifRxEqoQ8rQ_F-EhAFJ5qIRWg9Q",
  authDomain: "webmobile-91fe9.firebaseapp.com",
  databaseURL: "https://webmobile-91fe9.firebaseio.com",
  projectId: "webmobile-91fe9",
  storageBucket: "webmobile-91fe9.appspot.com",
  messagingSenderId: "355527894492",
  appId: "1:355527894492:web:1796adaa402f1c92"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();
const messaging = firebase.messaging();
const functions = firebase.functions();

const loginUser = functions.httpsCallable("loginUser");
const logoutUser = functions.httpsCallable("logoutUser");
const creatComment = functions.httpsCallable("creatComment");

firestore.enablePersistence().catch(function(err) {
  if (err.code == "failed-precondition") {
    console.log(
      "여러 개의 탭이 열려 있으면 한 번에 하나의 탭에서만 지속성을 활성화 할 수 있습니다."
    );
  } else if (err.code == "unimplemented") {
    console.log(
      "현재 브라우저는 지속성을 활성화하는 데 필요한 모든 기능을 지원하지 않습니다."
    );
  }
});
messaging.usePublicVapidKey(
  "BBLKCeW84tGHTMfQg1aHQ7_NzxrXaBlWgB3J9qa6HdtAKW1SUY_qt4Zi5GyAV4nIx88ZcFjg4DvK-8rxX4yPWYs"
);

export default {
  getImageUrls() {
    const imageUrlsCollection = firestore.collection(IMAGEURLS);
    return imageUrlsCollection
      .orderBy("created_at", "desc")
      .get()
      .then(docSnapshots => {
        return docSnapshots.docs.map(doc => {
          let data = doc.data();
          data.created_at = new Date(data.created_at.toDate());
          return data;
        });
      });
  },
  postImageUrls(name, url) {
    return firestore.collection(IMAGEURLS).add({
      name,
      url,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  },
  getPosts() {
    const postsCollection = firestore.collection(POSTS);
    return postsCollection
      .orderBy("created_at", "desc")
      .get()
      .then(docSnapshots => {
        return docSnapshots.docs.map(doc => {
          let data = doc.data();
          data.created_at = new Date(data.created_at.toDate());
          data.id = doc.id;
          return data;
        });
      });
  },
  getPost(id) {
    const postsCollection = firestore
      .collection(POSTS)
      .doc(id)
      .get();
    return postsCollection.then(docSnapshots => {
      let data = docSnapshots.data();
      data.created_at = new Date(data.created_at.toDate());
      data.id = docSnapshots.id;
      return data;
    });
  },
  postPost(title, body) {
    return firestore.collection(POSTS).add({
      title,
      body,
      ownerId: firebase.auth().currentUser.uid,
      ownerEmail: firebase.auth().currentUser.email,
      ownerDisplayName: firebase.auth().currentUser.displayName,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  },
  getPortfolios() {
    const postsCollection = firestore.collection(PORTFOLIOS);
    return postsCollection
      .orderBy("created_at", "desc")
      .get()
      .then(docSnapshots => {
        return docSnapshots.docs.map(doc => {
          let data = doc.data();
          data.id = doc.id;
          if (data.created_at !== null) {
            data.created_at = new Date(data.created_at.toDate());
          } else {
            data.created_at = new Date();
          }
          return data;
        });
      });
  },
  postPortfolio(title, body, img) {
    return firestore.collection(PORTFOLIOS).add({
      title,
      body,
      img,
      ownerId: firebase.auth().currentUser.uid,
      ownerEmail: firebase.auth().currentUser.email,
      ownerDisplayName: firebase.auth().currentUser.displayName,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  },
  loginWithGoogle() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        loginUser({}).then(function() {});
        return result;
      })
      .catch(function(error) {
        console.error('[Google Login Error]', error)
      });
  },
  loginWithFacebook() {
    let provider = new firebase.auth.FacebookAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        loginUser({}).then(function() {});
        return result;
      })
      .catch(function(error) {
        console.error("[Facebook Login Error]", error);
      });
  },
  loginWithEmail(login_email, login_password) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(login_email, login_password)
      .then(result => {
        loginUser({}).then(function() {});
        return { result, errorCheck: false };
      })
      .catch(error => {
        return { msg: error.message, code: error.code, errorCheck: true };
      });
  },
  updateUser(nickName, photoURL) {
    var user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: nickName,
        photoURL: photoURL
      })
      .then(function() {
        return true;
      })
      .catch(function(error) {
        alert(error);
        return false;
      });
  },
  async logOut() {
    await logoutUser({}).then(function() {});
    await firebase
      .auth()
      .signOut()
      .then(function() {
        return true;
      })
      .catch(function(error) {
        alert(error);
        return false;
      });
  },
  joinWithEmail(join_email, join_password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(join_email, join_password)
      .then(user => {
        return user;
      })
      .catch(error => {
        console.log(error.message);
      });
  },
  loginChk() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        store.state.user = user;
      }
    });
  },
  authChk() {
    let self = this;
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        store.state.auth = await self.getUser();
      }
    });
  },
  createUserRule() {
    const uid = firebase.auth().currentUser.uid;
    return firestore
      .collection(USERS)
      .doc(uid)
      .set({
        userEmail: firebase.auth().currentUser.email,
        userAuth: "visitant",
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      });
  },
  updateUserRule(rule) {
    const uid = firebase.auth().currentUser.uid;
    return firestore
      .collection(USERS)
      .doc(uid)
      .update({
        userAuth: rule,
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      });
  },
  async updateUserAuth(uid, auth, email) {
    if (auth == "visitant") {
      await firestore
        .collection(USERS)
        .doc(uid)
        .delete();
      return firestore
        .collection(USERS)
        .doc(uid)
        .set({
          userEmail: email,
          userAuth: auth,
          updated_at: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    if (auth == "member")
      return firestore
        .collection(USERS)
        .doc(uid)
        .update({
          userAuth: auth,
          updated_at: firebase.firestore.FieldValue.serverTimestamp()
        });
  },
  async removeItem(id, table) {
    var rootRef = await firestore.collection(table).doc(id);
    await rootRef.delete();
  },
  async updatePortfolio(item) {
    var rootRef = await firestore.collection(PORTFOLIOS).doc(item.id);
    await rootRef.update({
      title: item.title,
      body: item.body,
      img: item.img
    });
  },
  async updatePost(item) {
    var rootRef = await firestore.collection(POSTS).doc(item.id);
    await rootRef.update({
      title: item.title,
      body: item.body
    });
  },
  async getUsers() {
    const postsCollection = firestore.collection(USERS);
    let result = await postsCollection
      .orderBy("userAuth", "asc")
      .get()
      .then(docSnapshots => {
        return docSnapshots.docs.map(doc => {
          let data = doc.data();
          data.created_at = new Date(data.updated_at.toDate());
          data.id = doc.id;

          return data;
        });
      });
    for (let i = 0; i < result.length; i++) {
      var posts = await firestore
        .collection(POSTS)
        .where("ownerId", "==", String(result[i].id))
        .get();
      var portfolios = await firestore
        .collection(PORTFOLIOS)
        .where("ownerId", "==", String(result[i].id))
        .get();
      result[i].posts = posts.docs.length;
      result[i].portfolios = portfolios.docs.length;
    }
    return result;
  },
  async getUser() {
    var cur = firebase.auth().currentUser;
    var uid = cur.uid;
    var result;
    await firestore
      .collection(USERS)
      .doc(uid)
      .get()
      .then(docSnapshots => {
        result = docSnapshots.data();
      });
    return result;
  },
  requestPermission(userAuth) {
    messaging
      .requestPermission()
      .then(() => {
        console.log("Have permission");
        return messaging.getToken();
      })
      .then(token => {
        const uid = firebase.auth().currentUser.uid;
        return firestore
          .collection(FCMIDTOKENS)
          .doc(uid)
          .set({
            token: token,
            userAuth: userAuth,
            updated_at: firebase.firestore.FieldValue.serverTimestamp()
          });
      })
      .catch(error => {
        console.log("Error Occured.");
        console.log(error);
        const uid = firebase.auth().currentUser.uid;
        return firestore
          .collection(FCMIDTOKENS)
          .doc(uid)
          .set({
            token: "",
            userAuth: userAuth,
            updated_at: firebase.firestore.FieldValue.serverTimestamp()
          });
      });
  },
  onMessage() {
    messaging.onMessage(payload => {
      console.log("onMessage: ", payload);
    });
  },
  creatCommentMessage(comment) {
    creatComment(comment).then(function() {});
  }
};
