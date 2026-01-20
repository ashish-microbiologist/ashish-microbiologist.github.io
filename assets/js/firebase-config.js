/**
 * OP ASHISH YT - Firebase Configuration Template
 * NOTE: इस फ़ाइल को firebase-config.js के नाम से सेव करें और अपना Firebase Config डालें
 */

// Your Firebase configuration - इसे अपने Firebase Project से लें
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firestore Database
    const db = firebase.firestore();
    
    // Initialize Storage for files
    const storage = firebase.storage();
    
    console.log('🔥 Firebase initialized successfully!');
} else {
    console.warn('⚠️ Firebase SDK not loaded');
}

// Firebase Functions
const FirebaseApp = {
    // Get all apps from database
    async getAllApps() {
        try {
            if (!db) {
                console.warn('Firestore not available');
                return [];
            }
            const snapshot = await db.collection('apps').get();
            const apps = [];
            snapshot.forEach(doc => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            return apps;
        } catch (error) {
            console.error('Error getting apps:', error);
            return [];
        }
    },

    // Get single app by ID
    async getAppById(appId) {
        try {
            if (!db) return null;
            const doc = await db.collection('apps').doc(appId).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting app:', error);
            return null;
        }
    },

    // Add new app
    async addApp(appData) {
        try {
            if (!db) throw new Error('Firestore not available');
            
            // Add timestamp
            const appWithTimestamp = {
                ...appData,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                downloads: 0,
                featured: false,
                rating: 0
            };

            const docRef = await db.collection('apps').add(appWithTimestamp);
            return { id: docRef.id, ...appData };
        } catch (error) {
            console.error('Error adding app:', error);
            throw error;
        }
    },

    // Update app
    async updateApp(appId, updatedData) {
        try {
            if (!db) throw new Error('Firestore not available');
            await db.collection('apps').doc(appId).update(updatedData);
            return true;
        } catch (error) {
            console.error('Error updating app:', error);
            throw error;
        }
    },

    // Delete app
    async deleteApp(appId) {
        try {
            if (!db) throw new Error('Firestore not available');
            await db.collection('apps').doc(appId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting app:', error);
            throw error;
        }
    },

    // Increment download count
    async incrementDownloads(appId) {
        try {
            if (!db) return false;
            const appRef = db.collection('apps').doc(appId);
            await appRef.update({
                downloads: firebase.firestore.FieldValue.increment(1)
            });
            return true;
        } catch (error) {
            console.error('Error incrementing downloads:', error);
            return false;
        }
    },

    // Upload file to Firebase Storage
    async uploadFile(file, path) {
        try {
            if (!storage) throw new Error('Storage not available');
            const storageRef = storage.ref();
            const fileRef = storageRef.child(path);
            const uploadTask = await fileRef.put(file);
            
            // Get download URL
            const downloadURL = await uploadTask.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    // Search apps
    async searchApps(query) {
        try {
            if (!db) return [];
            const snapshot = await db.collection('apps')
                .where('name', '>=', query)
                .where('name', '<=', query + '\uf8ff')
                .get();
            
            const apps = [];
            snapshot.forEach(doc => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            return apps;
        } catch (error) {
            console.error('Error searching apps:', error);
            return [];
        }
    },

    // Get featured apps
    async getFeaturedApps(limit = 6) {
        try {
            if (!db) return [];
            const snapshot = await db.collection('apps')
                .where('featured', '==', true)
                .limit(limit)
                .get();
            
            const apps = [];
            snapshot.forEach(doc => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            return apps;
        } catch (error) {
            console.error('Error getting featured apps:', error);
            return [];
        }
    },

    // Get apps by category
    async getAppsByCategory(category, limit = 50) {
        try {
            if (!db) return [];
            const snapshot = await db.collection('apps')
                .where('category', '==', category)
                .limit(limit)
                .get();
            
            const apps = [];
            snapshot.forEach(doc => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            return apps;
        } catch (error) {
            console.error('Error getting apps by category:', error);
            return [];
        }
    },

    // Get total downloads count
    async getTotalDownloads() {
        try {
            if (!db) return 0;
            const snapshot = await db.collection('apps').get();
            let total = 0;
            snapshot.forEach(doc => {
                total += doc.data().downloads || 0;
            });
            return total;
        } catch (error) {
            console.error('Error getting total downloads:', error);
            return 0;
        }
    }
};

// Make FirebaseApp available globally
if (typeof window !== 'undefined') {
    window.FirebaseApp = FirebaseApp;
    window.db = db;
    window.storage = storage;
}

console.log('✅ FirebaseApp template loaded! Replace with your Firebase credentials.');