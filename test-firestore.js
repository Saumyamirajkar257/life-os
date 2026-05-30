const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "life-os-app-2026",
  appId: "1:531059756717:web:8f5695382e72a6ce180024",
  storageBucket: "life-os-app-2026.firebasestorage.app",
  apiKey: "AIzaSyCcNv873lNfULk0noSXn-MC1E1BhBc6y-0",
  authDomain: "life-os-app-2026.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    await setDoc(doc(db, 'test/test'), { success: true });
    console.log("Firestore is ready!");
  } catch (e) {
    console.error("Firestore Error:", e.message);
  }
}
test();
