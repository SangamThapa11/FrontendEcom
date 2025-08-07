import axiosConfig from "../config/axios.config";
import type { IPaginationParams } from "../config/constants";
import type { ICategoryDataType } from "../pages/Category/categoryCreatePage";

class categoryService {
    async addCategory(data: ICategoryDataType) {
        return await axiosConfig.post('/v1/category', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async updateCategory(categoryId: string, data: ICategoryDataType) {
        return await axiosConfig.put('/v1/category/'+categoryId, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async getAllCategory(params: IPaginationParams) {
        return await axiosConfig.get("/v1/category/", {
            params: params
        })
    }
    async deleteCategoryById(categoryId: string) {
        return await axiosConfig.delete('/v1/category/'+categoryId)
    }
    async getCategoryById(categoryId: string) {
        return axiosConfig.get('/v1/category/'+categoryId)
    }
}
export default new categoryService(); 