import axios from "axios";
import axiosConfig from "../config/axios.config";
import type { IPaginationParams } from "../config/constants";

class OrderService {
   async getAllOrder(params: IPaginationParams) {
        return await axiosConfig.get("/v1/order/", {
            params: params
        })
    }

    static async getAllOrder(params: {
    page?: number;
    limit?: number;
    search?: string | null;
    isPaid?: boolean;
    startDate?: string;
    endDate?: string;
  }) {
    const { page = 1, limit = 10, search, isPaid, startDate, endDate } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) queryParams.append('search', search);
    if (isPaid) queryParams.append('isPaid', 'true');
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    return axios.get(`/orders?${queryParams.toString()}`);
  }
}
export default new OrderService;