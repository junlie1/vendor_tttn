import axios from "axios"

export const cityVnService = {
    getAllCity: async () => {
        try {
            const response = await axios.get('https://provinces.open-api.vn/api/?depth=2');
            return response;
        } catch (error) {
            console.error("Error", error);
        }
    }
}