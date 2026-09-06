const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { createClient } = require('@libsql/client');

const EMAIL = 'fortunefood273@gmail.com';

async function makeAdmin() {
  // Init Firebase
  const pk = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = pk.includes('\\n') ? pk.replace(/\\n/g, '\n') : pk;
  const app = getApps().length === 0
    ? initializeApp({ credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey }) })
    : getApps()[0];
  const auth = getAuth(app);

  // Init Turso
  const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

  try {
    // 1. Try to get existing user from Firebase
    let user;
    try {
      user = await auth.getUserByEmail(EMAIL);
      console.log('Found existing Firebase user:', user.uid);
    } catch (e) {
      // Create user if not exists
      user = await auth.createUser({ email: EMAIL, displayName: 'Katariya Auto Parts Admin', emailVerified: true });
      console.log('Created Firebase user:', user.uid);
    }

    // 2. Set admin custom claim in Firebase
    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    console.log('✅ Firebase custom claim set: role=admin');

    // 3. Upsert user in Turso DB as admin
    const existing = await db.execute({ sql: 'SELECT id FROM User WHERE firebaseId = ?', args: [user.uid] });
    if (existing.rows.length > 0) {
      await db.execute({ sql: 'UPDATE User SET role = ? WHERE firebaseId = ?', args: ['admin', user.uid] });
      console.log('✅ Turso DB updated: role=admin');
    } else {
      await db.execute({
        sql: 'INSERT INTO User (id, firebaseId, email, name, role) VALUES (?, ?, ?, ?, ?)',
        args: [user.uid, user.uid, EMAIL, 'Katariya Auto Parts Admin', 'admin']
      });
      console.log('✅ Turso DB inserted: role=admin');
    }

    console.log('\n🎉 fortunefood273@gmail.com is now an ADMIN!\n');
  } catch (e) {
    console.error('❌ FAILED:', e.message);
  }
}

makeAdmin();
