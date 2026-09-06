const adminAuth = {
  verifyIdToken: jest.fn().mockImplementation((token) => {
    if (token === 'valid_token') {
      return Promise.resolve({
        uid: 'test_firebase_uid',
        email: 'admin@primepets.com',
        name: 'Admin User'
      });
    }
    return Promise.reject(new Error('Firebase ID token has invalid signature.'));
  })
};

const adminMessaging = {
  send: jest.fn().mockResolvedValue('projects/primepets/messages/mock_message_id')
};

// Export as { adminAuth, adminMessaging } to match the real firebaseAdmin.js exports
module.exports = { adminAuth, adminMessaging };
