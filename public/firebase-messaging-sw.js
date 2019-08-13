importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "355527894492"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  var data = payload.data;
  var notificationTitle;
  var notificationOptions;
  if (data.comment) {
    notificationTitle = "게시물 '" + data.title + "'에 " + data.message;
    notificationOptions = {
      body: data.comment,
      icon: "./img/icons/android-chrome-192x192.png"
    };
  } else {
    notificationTitle = data.owner + "님이 " + data.message;
    notificationOptions = {
      body: data.title,
      icon: "./img/icons/android-chrome-192x192.png"
    };
  }
  self.addEventListener("notificationclick", function(event) {
    const clickedNotification = event.notification;
    clickedNotification.close();
  });
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
