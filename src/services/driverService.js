import axios from "axios"

export const driverService = {
    getAllDriver: async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/driver/getAllDriver`);
            return response.data;
        } catch (error) {
            console.error("Error", error);
        }
    }
}