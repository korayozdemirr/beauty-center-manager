import { db } from '../firebase/init';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'packageTemplates';

// Create a new package template
export const createPackageTemplate = async (packageData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...packageData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...packageData };
  } catch (error) {
    console.error('Error adding package template: ', error);
    throw error;
  }
};

// Get all package templates
export const getAllPackageTemplates = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const packages = [];
    querySnapshot.forEach((doc) => {
      packages.push({ id: doc.id, ...doc.data() });
    });
    return packages;
  } catch (error) {
    console.error('Error getting package templates: ', error);
    throw error;
  }
};

// Update a package template
export const updatePackageTemplate = async (packageId, packageData) => {
  try {
    const packageRef = doc(db, COLLECTION_NAME, packageId);
    await updateDoc(packageRef, {
      ...packageData,
      updatedAt: serverTimestamp()
    });
    return { id: packageId, ...packageData };
  } catch (error) {
    console.error('Error updating package template: ', error);
    throw error;
  }
};

// Delete a package template
export const deletePackageTemplateById = async (packageId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, packageId));
    return packageId;
  } catch (error) {
    console.error('Error deleting package template: ', error);
    throw error;
  }
};