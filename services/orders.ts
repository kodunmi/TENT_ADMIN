import { OrderType } from './../lib';
import { AuthUserDataType ,BaseResponse,AdminType} from './../lib';
import { emptySplitApi } from './base';

export interface OrderResponse {
    page: number
    pages:  number
    orderCount: number
    orders: Array<OrderType>
}


const extendedApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders:builder.query<BaseResponse<OrderResponse>,{pageNumber:number}>({
            // query: ({filterByStatus,filterByOrderId,pageNumber,sortBy,order}) => `/order/all-orders?${filterByStatus ? 'filterByStatus'=filterByStatus : ''}&filterByOrderId=${filterByOrderId}&pageNumber=${pageNumber}&sortBy=${sortBy}&order=${order}`
            query: ({pageNumber}) => `order/all-orders?pageNumber=${pageNumber}`
        }),

        getOrder:builder.query<BaseResponse<OrderType>,{orderId:string}>({
            query: ({orderId}) => `/order/order/${orderId}`
        }),

        getInstallmentalOrders:builder.query<BaseResponse<OrderResponse>,string>({
            query: () => `/order/all-inst-order`
        }),

        terminateOrder:builder.mutation<BaseResponse<OrderType>,{orderId:string}>({
            query: ({orderId}) =>({
                url: `/order/terminate?orderId=${orderId}`,
                method: 'PATCH'
            }) 
        }),

    })

})

export const {
    useGetOrderQuery,
    useGetOrdersQuery,
    useGetInstallmentalOrdersQuery,
    useTerminateOrderMutation,
} = extendedApi
