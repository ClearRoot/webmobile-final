const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.loginUser = functions.https.onCall((data, context) => {
  let date = new Date()
  let email = ''
  let uid = ''
  email = context.auth.token.email
  uid = context.auth.uid
  console.log(date + ' email:' + email + ' UID:' + uid + ' login')
  return {}
});

exports.logoutUser = functions.https.onCall((data, context) => {
  let date = new Date()
  let email = ''
  let uid = ''
  email = context.auth.token.email
  uid = context.auth.uid
  console.log(date + ' email:' + email + ' UID:' + uid + ' logout')
  return {}
});
