import axios from "axios"

export const driverService = {
    getAllDriver: async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/driver/getAllDriver`);
            return response.data;
        } catch (error) {
            console.error("Error", error);
        }
    },
    assignSchedule: async (driverId, scheduleId) => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/driver/assignSchedule`, {
            driverId,
            scheduleId
          });
          return response.data;
        } catch (error) {
          console.error("Lỗi khi giao lịch trình", error);
          throw error;
        }
      },
      deleteDriver: async (driverId) => {
        try {
          const response = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/driver/${driverId}`);
          return response.data;
        } catch (error) {
          console.error("Lỗi khi xóa tài xế", error);
          throw error;
        }
      }
}