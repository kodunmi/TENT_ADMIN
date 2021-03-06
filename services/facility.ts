import { BaseResponse, BuildingType, FacilityType } from '../lib';
import { emptySplitApi } from './base';

export interface CardFactoryType {
    _id: string
    estateName: string
    estateLocation: {
        address: string
        city: string
        state: string
        zipCode: number
    },
    totalLandSize: number
    landSizeSold: number
    percentageLandSold: number
}

interface FacilityResponse {
    page: number
    pages:  number
    facilityCount: number
    facilities: Array<FacilityType>
}


export interface SingleFacilityResponse {
    summary:{
        totalLandSize: number
        totalBuildingSold: number
        totalUnitSold: number
    },
    facility: FacilityType
    estateStatus: {
        page: number
        pages: number
        statusCount: number
        status:Array<{building: string, dateCreated: string, fullName: string, orderId: string, orderSize: number, phoneNumber: string, status: 'processing' | 'completed' | 'terminated', userId:string}>
}
}

export interface FacilityMutationType {
    estateLocation?: {
        address: string
        city: string
        state: string
        zipCode: number
    },
    totalLandSize?: number
    totalLandPrice?: number
    estateDescription?: string
    estateName?: string
}

const extendedApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getFacilities:builder.query<BaseResponse<FacilityResponse>, {searchEstateName?:string,pageNumber?:number,sortBy?:string,order?:string}>({
            query: ({searchEstateName,pageNumber,sortBy,order}) => `/facility/all?pageNumber=${pageNumber}${searchEstateName ? `&searchEstateName=${searchEstateName}`:''}${sortBy ? `&sortBy=${sortBy}`:''}${order ? `&order=${order}`:''}`,
        }),

        getFacility:builder.query<BaseResponse<SingleFacilityResponse>, {id:string,estateStatusPageNumber:number}>({
            query: ({id,estateStatusPageNumber}) => `/facility/single/${id}?estateStatusPageNumber=${estateStatusPageNumber}`
        }),

        addFacility:builder.mutation<BaseResponse<FacilityType>, FacilityMutationType>({
            query: (facility) => ({
                url: `/facility/add`,
                method: 'POST',
                body: facility,
            })
        }),

        updateFacility:builder.mutation<BaseResponse<FacilityType>, {facility:FacilityType,id:string}>({
            query: ({id,facility}) => ({
                url: `/facility/edit/${id}`,
                method: 'PUT',
                body: facility,
            })
        }),

        addBuilding:builder.mutation<BaseResponse<FacilityType>, {id:string,building:{buildingType:string,numberOfRoom:number,price:number}}>({
            query: ({id,building}) => ({
                url: `/facility/add-building?facilityId=${id}`,
                method: 'PATCH',
                body: building,
            })
        }),

        removeBuilding:builder.mutation<BaseResponse<FacilityType>, {facilityId:string,buildingId:string}>({
            query: ({facilityId,buildingId}) => ({
                url: `/facility/remove-building?facilityId=${facilityId}&buildingId=${buildingId}`,
                method: 'PATCH',
            })
        }),

        deleteFacility:builder.mutation<BaseResponse<string>, string>({
            query: (id) => ({
                url: `/facility/delete/${id}`,
                method: 'DELETE',
            })
        }),

        getFacilitySummary:builder.query<BaseResponse<{totalEstates:number,totalLandSize:number,totalBuildings:number,totalUnitSold:number}>, string>({
            query: () => `/facility/summary`
        }),

        getCardFacilities:builder.query<BaseResponse<Array<CardFactoryType>>, string>({
            query: () => "facility/user/all-cards"
        })


       
    })
})

export const {
    useGetFacilitiesQuery,
    useAddBuildingMutation,
    useAddFacilityMutation,
    useDeleteFacilityMutation,
    useGetFacilitySummaryQuery,
    useRemoveBuildingMutation,
    useUpdateFacilityMutation,
    useGetFacilityQuery,
    useGetCardFacilitiesQuery,
    useLazyGetFacilityQuery
} = extendedApi