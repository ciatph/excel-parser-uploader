const { FirestoreData } = require('csv-firestore')
const firestore = new FirestoreData()

/**
 * Create or update the contents of a Firestore document under a Firestore collection
 * @param {String} collectionName - Firestore collection name
 * @param {String} docName - Firestore document name
 * @param {Object} jsonData - JSON data to upload in the Firestore docName document
 *    - {Object[]} data - crop recommendations mapped to crop stages, farm operations and other keys
 *    - {String} type - type of recommendations. One of RECOMMEDATIONS_TYPE.
 *    - {String} description - Brief text description describing the nature of data
 * @returns {Timestamp} Firestore timestamp of successful data upload
 */
module.exports.uploadToFirestore = async (collectionName, docName, jsonData) => {
  // CSV and Firestore handler
  jsonData.date_created = firestore.admin.firestore.Timestamp.now()

  try {
    // Upload data to Firestore
    const docRef = await firestore.db
      .collection(collectionName)
      .doc(docName)
      .set(jsonData)

    return docRef
  } catch (err) {
    throw new Error(err.message)
  }
}
