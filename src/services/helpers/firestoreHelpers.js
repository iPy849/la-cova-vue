import {
  collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy,
} from 'firebase/firestore';
import firestore from '../firebase/firestore';
import analyticsHelpers from './analyticsHelpers';

function joinInformation(item, sectionId) {
  return {
    id: item.id,
    sectionId,
    ...item.data(),
  };
}

async function getSections() {
  // Obtiene datos de la coleccion general de Menu
  const sectionCollection = collection(firestore, 'Menu');
  const _query = query(sectionCollection, orderBy('section'));
  const sectionSnapshot = await getDocs(_query);
  const returnData = [];
  sectionSnapshot.forEach((section) => {
    const sectionData = {
      id: section.id, ...section.data(),
    };
    returnData.push(sectionData);
  });
  return returnData;
}

async function deleteSections(sectionId) {
  try {
    const sectionProductsCollection = await collection(firestore, 'Menu', sectionId, 'Producto');
    const sectionSnapshot = await getDocs(sectionProductsCollection);
    sectionSnapshot.forEach((sectionDoc) => {
      deleteDoc(sectionDoc.ref);
    });
    await deleteDoc(doc(firestore, 'Menu', sectionId));
    analyticsHelpers.sendAnalyticsLog('Sección_borrada', { sectionId });
    return true;
  } catch {
    return false;
  }
}

async function addSection(section) {
  try {
    const addition = await addDoc(collection(firestore, 'Menu'), { section });
    analyticsHelpers.sendAnalyticsLog('Sección_añadida', { ...addition });
    return { id: addition.id, section };
  } catch {
    return false;
  }
}

async function getFoodBySection(sectionId) {
  // Obtiene datos de la coleccion general de Menu
  const menuSnapshot = await getDocs(collection(firestore, 'Menu', sectionId, 'Producto'));
  const returnData = [];
  menuSnapshot.forEach((product) => {
    returnData.push(joinInformation(product, sectionId));
  });
  return returnData;
}

async function addFoodInSection(sectionId, foodName, foodPrice) {
  try {
    await addDoc(
      collection(firestore, 'Menu', sectionId, 'Producto'),
      { Name: foodName, PriceMn: foodPrice },
    );
    analyticsHelpers.sendAnalyticsLog('Producto_añadido', { sectionId, foodName, foodPrice });
    return true;
  } catch {
    return false;
  }
}

async function editFood(sectionId, foodId, data) {
  try {
    const foodDoc = await doc(firestore, 'Menu', sectionId, 'Producto', foodId);
    await updateDoc(foodDoc, data);
    analyticsHelpers.sendAnalyticsLog('Producto_editado', { sectionId, foodId });
    return true;
  } catch {
    return false;
  }
}

async function deleteFood(sectionId, foodId) {
  try {
    const foodDoc = await doc(firestore, 'Menu', sectionId, 'Producto', foodId);
    await deleteDoc(foodDoc);
    analyticsHelpers.sendAnalyticsLog('Producto_borrado', { sectionId, foodId });
    return true;
  } catch {
    return false;
  }
}

async function getAllCurrencyExchange() {
  const currencyCollection = collection(firestore, 'CambioMoneda');
  const _query = query(currencyCollection, orderBy('Name'));
  const currencySnapshot = await getDocs(_query);
  const results = [];
  currencySnapshot.forEach((currency) => {
    results.push({
      id: currency.id,
      ...currency.data(),
    });
  });
  return results;
}

async function addCurrencyExchange(Name, Value) {
  const currencyCollection = collection(firestore, 'CambioMoneda');
  const data = { Name, Value };
  const r = await addDoc(currencyCollection, data);
  return r.id;
}

async function editCurrencyExchange(currencyId, Value) {
  const currencyDoc = doc(firestore, 'CambioMoneda', currencyId);
  await updateDoc(currencyDoc, Value);
  return true;
}

async function deleteCurrencyExchange(currencyId) {
  await deleteDoc(
    doc(firestore, 'CambioMoneda', currencyId),
  );
  return true;
}

export default {
  getSections,
  addSection,
  deleteSections,
  getFoodBySection,
  addFoodInSection,
  editFood,
  deleteFood,
  getAllCurrencyExchange,
  addCurrencyExchange,
  editCurrencyExchange,
  deleteCurrencyExchange,
};
