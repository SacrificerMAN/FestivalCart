const firebaseModules = 'https://www.gstatic.com/firebasejs/10.14.1';

export class OrdersService {
  constructor(auth) {
    this.auth = auth;
    this.db = null;
  }

  async initialize() {
    if (!this.auth.app) return false;
    const { getFirestore } = await import(`${firebaseModules}/firebase-firestore.js`);
    this.db = getFirestore(this.auth.app);
    return true;
  }

  async submit({ localOrder, area, phone, address, deliveryDate }) {
    if (!this.db || !this.auth.user) throw new Error('Order database is not ready yet.');
    const { addDoc, collection, serverTimestamp } = await import(`${firebaseModules}/firebase-firestore.js`);
    const items = Object.entries(localOrder)
      .filter(([key, value]) => key !== 'catalogItems' && (key === 'pujaBasic' ? value : value > 0))
      .map(([key, value]) => ({ item: key, quantityKg: key === 'pujaBasic' ? null : value }));
    items.push(...(localOrder.catalogItems || []).map((item) => ({ item, quantityKg: null })));
    return addDoc(collection(this.db, 'orders'), {
      customer: { uid: this.auth.user.uid, name: this.auth.user.displayName || null, email: this.auth.user.email || null, phone, address, area },
      items,
      preferredDeliveryDate: deliveryDate || null,
      status: 'requested',
      paymentStatus: 'not_collected',
      createdAt: serverTimestamp()
    });
  }
}

