import { AuthUserDataType ,BaseResponse,AdminType} from './../lib';
import { emptySplitApi } from './base';


export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  username: string
  role: "superAdmin"|"admin"
  password:string
}



const extendedApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<BaseResponse<AuthUserDataType>, LoginRequest>({
      query: (credentials) => ({
        url: 'admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<BaseResponse<AdminType>, RegisterRequest>({
      query: (body) => ({
        url: 'admin/create',
        method: 'POST',
        body: body,
      })
    }),
    logout: builder.mutation<BaseResponse<string>,string>({ 
      query: () => ({
        url: 'admin/logout',
        method: 'POST'
      })
    })
  }),
})

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useLogoutMutation,
   } = extendedApi