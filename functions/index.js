const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://hacker-news-hooks-e1f82.firebaseio.com"
});
const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.linksPagination = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  let linksRef = db.collection("links");
  const offset = +request.query.offset;
  linksRef
    .orderBy("created", "desc")
    .limit(2)
    .offset(offset)
    .get()
    .then(snapshot => {
      const links = snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      response.json(links);
    });
});
