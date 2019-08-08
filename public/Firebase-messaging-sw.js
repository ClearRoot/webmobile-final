importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "355527894492"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  var data = payload.data;
  var notificationTitle = data.owner + "님이 " + data.message;
  var notificationOptions = {
    body: data.title,
    icon: "/firebase-logo.png"
  };
  self.addEventListener("notificationclick", function(event) {
    const clickedNotification = event.notification;
    clickedNotification.close();
  });

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
