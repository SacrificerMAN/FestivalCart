const firebaseModules = 'https://www.gstatic.com/firebasejs/10.14.1';

function configured() {
  const firebase = window.FESTIVALCART_AUTH_CONFIG?.firebase;
  return Boolean(firebase?.apiKey && firebase?.authDomain && firebase?.projectId && firebase?.appId);
}

export class AuthService {
  constructor() {
    this.user = null;
    this.auth = null;
    this.app = null;
    this.ready = false;
  }

  async initialize(onChange) {
    if (!configured()) return false;
    const [{ initializeApp }, { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut }] = await Promise.all([
      import(`${firebaseModules}/firebase-app.js`),
      import(`${firebaseModules}/firebase-auth.js`)
    ]);
    this.app = initializeApp(window.FESTIVALCART_AUTH_CONFIG.firebase);
    this.auth = getAuth(this.app);
    this.provider = new GoogleAuthProvider();
    this.signInWithPopup = signInWithPopup;
    this.signOut = signOut;
    this.ready = true;
    onAuthStateChanged(this.auth, (user) => { this.user = user; onChange(user); });
    return true;
  }

  isConfigured() { return configured(); }
  isSignedIn() { return Boolean(this.user); }

  async signIn() {
    if (!this.ready) throw new Error('Google sign-in is not configured yet.');
    await this.signInWithPopup(this.auth, this.provider);
  }

  async signOutUser() {
    if (this.ready) await this.signOut(this.auth);
  }
}

