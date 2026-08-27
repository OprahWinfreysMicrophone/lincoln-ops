// ── LINCOLN OPS — CLOUD CONFIG ──
// Shared by index.html (iPad app) and dashboard.html (parent dashboard).
//
// SETUP (one time, ~5 minutes):
//   1. Go to https://console.firebase.google.com and sign in with any Google account.
//   2. "Add project" → name it anything (e.g. lincoln-ops). Disable Analytics.
//   3. In the project: Build → Firestore Database → "Create database" → Start in
//      production mode → pick a US location.
//   4. Firestore → Rules tab → replace the rules with:
//
//        rules_version = '2';
//        service cloud.firestore {
//          match /databases/{database}/documents {
//            match /families/{family}/{document=**} {
//              allow read, write: if true;
//            }
//          }
//        }
//
//      → Publish. (Access is limited to whoever knows the FAMILY_ID below.)
//   5. Project Overview → gear icon → Project settings → "Your apps" → click the
//      </> (Web) icon → register app (no hosting needed). Copy the firebaseConfig
//      object it shows you and paste it below, replacing `null`.
//   6. Upload this file along with index.html, dashboard.html and cloud-sync.js.
//      Open the app on the iPad once FIRST — it migrates the existing schedule,
//      rewards and XP to the cloud. Then open dashboard.html on your phone.
//
// Until a config is pasted here, the iPad app keeps working exactly as before
// (local-only), and the dashboard shows these setup instructions.

window.FIREBASE_CONFIG = null;
/* Example — replace null above with your own values:
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy....",
  authDomain: "lincoln-ops.firebaseapp.com",
  projectId: "lincoln-ops",
  storageBucket: "lincoln-ops.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
*/

// Acts as the family's shared secret — anyone who knows it can read/write this
// family's data, so keep it random. No need to change it unless you want to.
window.FAMILY_ID = 'lincoln-q7v2xk9dm4';
