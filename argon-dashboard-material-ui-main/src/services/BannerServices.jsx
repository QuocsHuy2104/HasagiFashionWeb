import { db } from "../config/firebase-config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";

const bannerCollectionRef = collection(db, "Banners");

class BannerDataService {
  // Update getAllBanners method to be an async function
  async getAllBanners() {
    try {
      const data = await getDocs(bannerCollectionRef);
      // Map over the documents to extract the data
      const banners = data.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Include doc ID and data
      return { docs: banners }; // Return a consistent structure with 'docs'
    } catch (error) {
      console.error("Error fetching banners:", error);
      return { docs: [] }; // Return an empty array in case of an error
    }
  }

  async deleteBanner(id) {
    try {
      const bannerDoc = doc(db, "Banners", id);
      await deleteDoc(bannerDoc);
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  }

  async addBanner(newBanner) {
    try {
      const docRef = await addDoc(bannerCollectionRef, newBanner);
      return docRef;
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  }

  async updateBanner(id, updatedBanner) {
    try {
      const bannerDoc = doc(db, "Banners", id);
      await updateDoc(bannerDoc, updatedBanner);
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  }

  async getBanner(id) {
    try {
      const bannerDoc = doc(db, "Banners", id);
      const docSnap = await getDoc(bannerDoc);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }; // Return the banner data
      } else {
        console.log("No such banner!");
        return null; // Return null if no document found
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      return null; // Return null in case of an error
    }
  }
}

const bannerDataServiceInstance = new BannerDataService();
export default bannerDataServiceInstance;
