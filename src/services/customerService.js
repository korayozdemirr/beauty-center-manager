import { db } from '../firebase/init';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const COLLECTION_NAME = 'customers';

// Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...customerData };
  } catch (error) {
    console.error('Error adding customer: ', error);
    throw error;
  }
};

// Get all customers
export const getAllCustomers = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const customers = [];
    querySnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() });
    });
    return customers;
  } catch (error) {
    console.error('Error getting customers: ', error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const customerRef = doc(db, COLLECTION_NAME, customerId);
    await updateDoc(customerRef, {
      ...customerData,
      updatedAt: new Date()
    });
    return { id: customerId, ...customerData };
  } catch (error) {
    console.error('Error updating customer: ', error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (customerId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, customerId));
    return customerId;
  } catch (error) {
    console.error('Error deleting customer: ', error);
    throw error;
  }
};