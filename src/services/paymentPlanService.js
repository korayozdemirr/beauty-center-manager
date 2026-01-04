import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/init';

// Create a new payment plan
export const createPaymentPlan = async (planData) => {
  try {
    const docRef = await addDoc(collection(db, 'paymentPlans'), {
      ...planData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating payment plan:', error);
    throw error;
  }
};

// Get all payment plans for a specific customer
export const getPaymentPlans = async (customerId) => {
  try {
    const q = query(collection(db, 'paymentPlans'), where('customerId', '==', customerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting payment plans:', error);
    throw error;
  }
};

// Get all payment plans for a specific customer package
export const getPaymentPlanByCustomerPackage = async (customerPackageId) => {
  try {
    const q = query(collection(db, 'paymentPlans'), where('customerPackageId', '==', customerPackageId));
    const querySnapshot = await getDocs(q);
    const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return plans.length > 0 ? plans[0] : null;
  } catch (error) {
    console.error('Error getting payment plan by customer package:', error);
    throw error;
  }
};

// Get all payment plans
export const getAllPaymentPlans = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'paymentPlans'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all payment plans:', error);
    throw error;
  }
};

// Update payment plan
export const updatePaymentPlan = async (id, data) => {
  try {
    const planRef = doc(db, 'paymentPlans', id);
    await updateDoc(planRef, data);
  } catch (error) {
    console.error('Error updating payment plan:', error);
    throw error;
  }
};

// Delete payment plan
export const deletePaymentPlan = async (id) => {
  try {
    const planRef = doc(db, 'paymentPlans', id);
    await deleteDoc(planRef);
  } catch (error) {
    console.error('Error deleting payment plan:', error);
    throw error;
  }
};

// Get a specific payment plan
export const getPaymentPlan = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, 'paymentPlans', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting payment plan:', error);
    throw error;
  }
};