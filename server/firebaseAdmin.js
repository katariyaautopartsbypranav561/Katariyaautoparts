// Mock Firebase Admin for local development
// Replace with real Firebase Admin when deploying to production

let adminAuth = null;
let adminMessaging = null;

// Mock adminAuth for local dev - bypasses Firebase token verification
adminAuth = {
  verifyIdToken: async (token) => {
    // In local dev, accept any token and return a mock user
    // Token format: "local:<email>" or just return default admin
    if (token && token.startsWith('local:')) {
      const email = token.replace('local:', '');
      return { uid: 'local-uid-' + email, email };
    }
    return { uid: 'local-dev-uid', email: 'admin@katariya.com' };
  }
};

module.exports = { adminAuth, adminMessaging };
