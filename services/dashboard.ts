import { emptySplitApi } from "."
import { BaseResponse } from "../lib"

export interface dataType {
    status: string;
    data: {
        userChart: {
            labels: Array<string>;
            registration: Array<number>;
            verification: Array<number>;
        };
        userStatus: {
            totalUsers: number;
            totalVerifiedUsers: number;
            avgNewUsers: number;
        };
        orderStatus: {
            totalOrders: number;
            totalPendingOrders: number;
            totalCanceledOrders: number;
        };
        salesStatus: {
            totalSales: number;
            landSales: number;
            buildingSales: number;
        };
        topSelling: Array<{ location: string; unitSold: number }>;
    };
    code: number;
}


const extendedApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardData:builder.query<BaseResponse<dataType>, {start:string, end:string}>({
            query: (params) => `admin/overView?start=${params.start}&end=${params.end}`
        }),
       
    })
})

export const {useGetDashboardDataQuery} = extendedApi