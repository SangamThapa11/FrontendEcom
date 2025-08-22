import axiosConfig from "../config/axios.config";
import type { IPaginationParams } from "../config/constants";
import type { IProductData } from "../pages/Products/productEditPage";

class productService {
    async addProduct(data: FormData) {
        return await axiosConfig.post('/v1/product/', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async updateProduct(productId: string, data: IProductData) {
        return await axiosConfig.put('/v1/product/' + productId, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async getAllProduct(params: IPaginationParams) {
        return await axiosConfig.get("/v1/product/", {
            params: params
        })
    }
    async deleteProductById(productId: string) {
        return await axiosConfig.delete('/v1/product/' + productId)
    }
    async getProductById(productId: string) {
        return axiosConfig.get('/v1/product/' + productId)
    }
    async getSellerBrands(params: IPaginationParams) {
        return await axiosConfig.get('/v1/brand', { params });
    }
    async getSellerCategories(params: IPaginationParams) {
        return await axiosConfig.get('/v1/category', { params });
    }
}
export default new productService(); 