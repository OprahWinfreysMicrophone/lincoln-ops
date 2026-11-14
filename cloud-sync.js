// ── LINCOLN OPS — SHARED FIRESTORE SYNC LAYER ──
// Used by both index.html (iPad app) and dashboard.html (parent dashboard).
//
// Data model (all under one family):
//   families/{FAMILY_ID}/app/config   — what the parent controls:
//       blocks[], chores[], rewards[], rotWeek, rotWeekDate, rotOverrides{},
//       pin, resetProgressAt, resetSchoolAt, resetActivitiesAt
//   families/{FAMILY_ID}/app/progress — what the iPad reports:
//       flat map of the app's v4_* progress keys (XP, streaks, done-flags…)
//
// The iPad app is the only writer of `progress`; the dashboard is the only
// writer of `config` (except rotation-week auto-advance, which merges safely).

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  initializeFirestore, getFirestore,
  persistentLocalCache, persistentSingleTabManager,
  doc, onSnapshot, setDoc, deleteField
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Values equal to this sentinel are turned into Firestore field deletions.
export const DELETE = '__DELETE__';

export function initCloud(config, familyId) {
  const app = initializeApp(config);
  let db;
  try {
    // Offline-first: cached config lets the iPad app boot with no network.
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentSingleTabManager() })
    });
  } catch (e) {
    db = getFirestore(app);
  }

  const configRef = doc(db, 'families', familyId, 'app', 'config');
  const progressRef = doc(db, 'families', familyId, 'app', 'progress');

  const mapDeletes = o => {
    const out = {};
    for (const k in o) out[k] = o[k] === DELETE ? deleteField() : o[k];
    return out;
  };

  return {
    familyId,
    onConfig: cb => onSnapshot(configRef, cb, err => console.warn('[cloud] config subscription error:', err)),
    onProgress: cb => onSnapshot(progressRef, cb, err => console.warn('[cloud] progress subscription error:', err)),
    patchConfig: o => setDoc(configRef, mapDeletes(o), { merge: true }),
    patchProgress: o => setDoc(progressRef, mapDeletes(o), { merge: true }),
    // Full overwrite — used by the dashboard's "reset all progress".
    setProgressAll: o => setDoc(progressRef, o)
  };
}
