
import axiosConfig from "../config/axios.config";
import type { IPaginationParams } from "../config/constants";
import type { IBannerCreateDataType } from "../pages/Banners/BannerCreatePage";

class BannerService {
    async addBanner(data: IBannerCreateDataType) {
        return await axiosConfig.post('/v1/banner', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }
    async updateBanner(bannerId: string, data: IBannerCreateDataType) {
        return await axiosConfig.put('/v1/banner/'+bannerId, data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    async getBannerList(params: IPaginationParams) {
        return await axiosConfig.get('/v1/banner', {
            params: params
        })
    }

    async deleteBannerById(bannerId: string) {
        return await axiosConfig.delete('/v1/banner/'+bannerId)
    }
    async getBannerById(bannerId: string) {
        return axiosConfig.get('/v1/banner/'+bannerId)
    }
}

export default new BannerService(); 