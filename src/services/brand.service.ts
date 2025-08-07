import axiosConfig from "../config/axios.config"
import type { IPaginationParams } from "../config/constants"
import type { IBrandCreateDataType } from "../pages/Brand/BrandCreatePage"

class BrandService {
    async addBrand(data: IBrandCreateDataType) {
        return await axiosConfig.post('/v1/brand', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async updateBrand(brandId: string, data: IBrandCreateDataType) {
        return await axiosConfig.put('/v1/brand/'+brandId, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async getAllBrands(params: IPaginationParams) {
        return await axiosConfig.get("/v1/brand/", {
            params: params
        })
    }
    async deleteBrandById(brandId: string) {
        return await axiosConfig.delete('/v1/brand/'+brandId)
    }
    async getBrandById(brandId: string) {
        return axiosConfig.get('/v1/brand/'+brandId)
    }
}

export default new BrandService(); 