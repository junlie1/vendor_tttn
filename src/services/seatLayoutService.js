import axios from "axios";
import { API_URL } from "../config/constants";

export const seatLayoutService = {
  getSeatLayout: async (seatLayoutId) => {
    try {
      const response = await axios.get(`${API_URL}/seat-layout/${seatLayoutId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching seat layout:", error);
      throw error;
    }
  },
};
