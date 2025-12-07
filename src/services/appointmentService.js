import { db } from '../firebase/init';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

const COLLECTION_NAME = 'appointments';

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...appointmentData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...appointmentData };
  } catch (error) {
    console.error('Error adding appointment: ', error);
    throw error;
  }
};

// Get all appointments
export const getAllAppointments = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return appointments;
  } catch (error) {
    console.error('Error getting appointments: ', error);
    throw error;
  }
};

// Get appointments by date range
export const getAppointmentsByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });
    return appointments;
  } catch (error) {
    console.error('Error getting appointments by date range: ', error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
  try {
    const appointmentRef = doc(db, COLLECTION_NAME, appointmentId);
    await updateDoc(appointmentRef, {
      ...appointmentData,
      updatedAt: new Date()
    });
    return { id: appointmentId, ...appointmentData };
  } catch (error) {
    console.error('Error updating appointment: ', error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, appointmentId));
    return appointmentId;
  } catch (error) {
    console.error('Error deleting appointment: ', error);
    throw error;
  }
};