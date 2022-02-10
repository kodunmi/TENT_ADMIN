import { BaseResponse, PaymentType } from './../lib/type';
import { emptySplitApi } from './base';

export interface TransactionResponse {
    page: number
    pages:  number
    paymentCount: number
    payments: Array<PaymentType>
}


const extendedApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions:builder.query<BaseResponse<TransactionResponse>,{pageNumber:number}>({
            // query: ({pageNumber,sortBy,order}) => `/payment/all?pageNumber=${pageNumber}&sortBy=${sortBy}&order=${order}`
            query: ({pageNumber}) => `payment/all?pageNumber=${pageNumber}`
        }),
        getTransaction:builder.query<BaseResponse<PaymentType>,{transactionId:string}>({
            query: ({transactionId}) => `/payment/${transactionId}`
        }),
        getPaymentSummary:builder.query<BaseResponse<{totalPayments:number, completedPayments:number,incompletePayments:number,totalSales:number,avgSales:number}>,string>({
            query: () => `/payment/summary`
        }),
        getPaymentGraph:builder.mutation<BaseResponse<{labels:Array<string>,completedPayments:Array<number>,incompletePayments:Array<number>}>,{start:string,end:string}>({
            query: ({start,end}) => ({
                url: `/payment/chart`,
                method: 'POST',
                body: {start,end},
            })
        }),
    })
})

export const {useGetPaymentGraphMutation,useGetPaymentSummaryQuery,useGetTransactionQuery,useGetTransactionsQuery} = extendedApi;