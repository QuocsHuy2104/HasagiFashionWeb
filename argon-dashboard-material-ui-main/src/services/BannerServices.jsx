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
    getAllBanners() {
        return getDocs(bannerCollectionRef);
    };
    deleteBanner(id) {
        const bannerDoc = doc(db, "Banners", id);
        return deleteDoc(bannerDoc);
    }
    addBanner(newBanner) {
        return addDoc(bannerCollectionRef, newBanner);
    };
    updateBanner(id, updateBanner) {
        const bannerDoc = doc(db, "Banners", id)
        return updateDoc(bannerDoc, updateBanner);
    };
    getBanner(id) {
        const bannerDoc = doc(db, "Banners", id)
        return getDoc(bannerDoc);
    };

}

// Gán thể hiện của BannerDataService vào biến trước khi export
const bannerDataServiceInstance = new BannerDataService();
export default bannerDataServiceInstance;
