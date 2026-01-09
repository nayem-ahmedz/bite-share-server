const admin = require("firebase-admin");
// var serviceAccount = require("../firebase-adminsdk-key.json");
// converted fbkey into base64, now making it a boject again
const decoded = Buffer.from(process.env.FIREBASE_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);

// console.log('admin apps length:', admin.apps.length);
// initilize admin once only

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;