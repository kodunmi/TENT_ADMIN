import { emptySplitApi } from "."
import { BaseResponse, UserDataType } from "../lib"


export interface UsersType {
    page: number;
    pages: number;
    userCount: number;
    users: Array<UserDataType>;
}

export interface RegisterUserRequest {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    gender: string
    dateOfBirth: string
}



const extendedApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<BaseResponse<UsersType>, { pageNumber: number }>({
            query: ({ pageNumber }) => `user/all-users?pageNumber?${pageNumber}`
        }),

        getUser: builder.query<BaseResponse<UserDataType>, string | string[]>({
            query: (id) => `user/user/${id}`
        }),
        addUser: builder.mutation<BaseResponse<UserDataType>, RegisterUserRequest>({
            query: (body) => ({
                url: 'user/admin/reg-user',
                method: 'POST',
                body: body,
            })
        }),

        editProfile: builder.mutation<BaseResponse<UserDataType>, { data: UserDataType, id: string }>({
            query: ({ data, id }) => ({
                url: `user/edit-user/${id}`,
                method: 'PUT',
                body: data
            })
        }),

        deleteUser: builder.mutation<BaseResponse<string>, string>({
            query: (id) => ({
                url: `user/delete-user/${id}`,
                method: 'DELETE'
            })
        }),

        getUserSammary: builder.query<BaseResponse<{totalUsers:number,newUsers:number,unverifiedUsers:number,verifiedUsers:number}>, string>({
            query: () => `user/summary`
        }),

    })
})

export const { useGetUserQuery, useGetUsersQuery, useAddUserMutation, useEditProfileMutation, useDeleteUserMutation, useGetUserSammaryQuery, useLazyGetUserQuery } = extendedApi