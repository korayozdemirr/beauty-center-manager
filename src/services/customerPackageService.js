import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/init';

// Create a new customer package
export const createCustomerPackage = async (packageData) => {
  try {
    const docRef = await addDoc(collection(db, 'customerPackages'), {
      ...packageData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating customer package:', error);
    throw error;
  }
};

// Get all customer packages for a specific customer
export const getCustomerPackages = async (customerId) => {
  try {
    const q = query(collection(db, 'customerPackages'), where('customerId', '==', customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting customer packages:', error);
    throw error;
  }
};

// Get all customer packages
export const getAllCustomerPackages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'customerPackages'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all customer packages:', error);
    throw error;
  }
};

// Update customer package
export const updateCustomerPackage = async (id, data) => {
  try {
    const packageRef = doc(db, 'customerPackages', id);
    await updateDoc(packageRef, data);
  } catch (error) {
    console.error('Error updating customer package:', error);
    throw error;
  }
};

// Delete customer package
export const deleteCustomerPackage = async (id) => {
  try {
    const packageRef = doc(db, 'customerPackages', id);
    await deleteDoc(packageRef);
  } catch (error) {
    console.error('Error deleting customer package:', error);
    throw error;
  }
};

// Get a specific customer package
export const getCustomerPackage = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, 'customerPackages', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting customer package:', error);
    throw error;
  }
};