export interface BaseResponse<T> {
    data: T
    status: "success" | "error"
    message?: string
}

export interface AdminType {
    _id: string
    fullName: string
    email: string
    username: string
    role: "superAdmin" | "admin"
    createdAt: string
    updatedAt: string
}

export interface AuthUserDataType {
    token: string
    admin: AdminType
}

export interface UserDataType {
    ipAddress?: string
    accountVerified?: boolean
    profileVerified?: boolean
    emailVerified?: boolean
    verifyPhoneNumberOtp?: string | null
    verifyPhoneNumberOtpExpires?: string | null
    phoneNumberVerified?: boolean
    _id?: string
    fullName?: string
    email?: string
    phoneNumber?: string
    tentUserId?: string
    verifyEmailOtp?: string | null
    verifyEmailOtpExpires?: string | null
    creator?: "user" | "admin",
    createdAt?: string
    updatedAt?: string
    gender?: "male" | "female"
    dateOfBirth?: string
    profileImage?: string
    stateOfOrigin?: string
    maritalStatus?: "single" | "married"
    occupation?: string
    password?: string
    nextOfKin?: {
        name: string
        relationship: string
        phoneNumber: string
        address: string
        state: string
        city: string
    },
    residentialAddress?: {
        address: string
        city: string
        state: string
        zipCode: number
    },
    businessAddress?: {
        address: string
        city: string
        state: string
        zipCode: number
    }
}

export interface BuildingType {
    _id?: string
    buildingType?: string
    numberOfRoom?: number
    price?: number
}

export interface FacilityType {

    estateLocation?: {
        address?: string
        city?: string
        state?: string
        zipCode?: number
    },
    landSizeSold?: number
    percentageLandSold?: number
    totalSales?: number
    totalUnitSold?: number
    totalBuildingSold?: number
    fullySoldOut?: boolean
    _id?: string
    estateName?: string
    totalLandSize?: number
    totalLandPrice?: number
    estateDescription?: string
    buildings?: Array<BuildingType>
    landSizeLeft?: number
    estateId?: string
    createdAt?: string
    updatedAt?: string
}

export interface OrderType {
    addedBuilding?: boolean
    discount?: number
    status: "processing"|"complete"|"terminate"
    paymentCompleted?: boolean
    instalmentPaymentStarted?: boolean
    _id: string
    estateId: {
        estateLocation: {
            address: string
            city: string
            state: string
            zipCode: number
        },
        _id: string
        estateName: string
    },
    landSize: number
    paymentMethod: "instalmentPayment" | 'fullPayment',
    user: {
        _id: string
        fullName: string
        email: string
        phoneNumber: string
        tentUserId: string
        profileImage?: string
    }
    estateName: string
    landEstimatedPrice: number
    building?: {
        buildingType: string
        numberOfRoom: number
        buildingEstimatedPrice: number
    },
    orderId: string
    createdAt: string
    updatedAt: string
    infrastructureFee?: number
    legalFee?: number
    surveyFee?: number
    engineeringSupervisionFee?: number
    totalEstimatedPrice: number
}

export interface PaymentType {
    paymentCompleted: boolean
    _id: string
    user: {
      _id: string
      fullName: string
      email: string
      phoneNumber: string
      tentUserId: string
      profileImage: string
    },
    order: {
      _id: string
      estateId: string
      estateName: string
      orderId: string
    },
    payerName?: string
    payerEmail?: string
    payerPhoneNumber?: string
    amount: number
    currency: string
    invoiceRef: string
    paymentMethod:  'instalmentPayment'|'fullPayment'
    payment_options: string
    flw_ref: string
    flutterId: number,
    orderId: string
    paymentDate: string
    createdAt: string
    updatedAt: string
  }