type ReviewStockMethod = {
  website: boolean
  instagram: boolean
  keyBrands: boolean
}

export interface LenderProfile {
  file: {
    url: string
    type: string
  }
  reviewStockMethod: ReviewStockMethod
  _id: string
  fullName: string
  phoneNumber: string
  email: string
  password: string
  username: string
  dob: string | null
  gender: string
  role: 'APPLICANT'
  bio: string
  profileImage: string
  multiProfileImage: string[]
  otp: string | null
  otpExpires: string | null
  refreshToken: string
  isActive: boolean
  hasActiveSubscription: boolean
  subscriptionExpireDate: string | null
  businessName: string
  abnNumber: string
  businessAddress: string
  instagramHandle: string
  businessWebsite: string
  numberOfDresses: string
  allowTryOn: boolean
  allowLocalPickup: boolean
  shipAustraliaWide: boolean
  agreedTerms: boolean
  agreedCurationPolicy: boolean
  totalbookings: number
  totalRatting: number
  totalListings: number
  totalReveneue: number
  city?: string
  state?: string
  country?: string
  postcode?: string
  suburb?: string
  placeName?: string
  latitude?: number
  longitude?: number
  address?: string
  status: 'pending' | 'approved' | 'rejected'
  applicationSubmittedAt: string
  applicationReviewedAt: string | null
  notes: string
  reason: string
  deactivationReason: string
  deactivationFeedback: string
  deactivated: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export type Pagination = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export type LendersGetResponse = {
  status: string
  message: string
  data: {
    data: LenderProfile[]
    pagination: Pagination
  }
}
