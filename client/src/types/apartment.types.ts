export interface ApartmentOwner {
  _id: string
  name?: string
  fullName?: string
}

export interface Review {
  _id?: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export interface Booking {
  guestId: string
  guestName: string
  startDate: string
  endDate: string
  createdAt?: string
}

export interface Apartment {
  _id: string
  name: string
  price: number
  pricePerNight: number
  address: string
  bedrooms: number
  city?: string
  location?: 'Center' | 'North' | 'South' | 'East' | 'West'
  description?: string
  image?: string[]
  characteristics?: string[]
  ownerId: string | ApartmentOwner
  notAvailableDates?: Date[]
  bookings?: Booking[]
  createdAt?: string
  updatedAt?: string
  reviews?: Review[]

}

export interface ApartmentState {
  allApartments: Apartment[]
  myApartments: Apartment[]
  currentApartment: Apartment | null
  loading: boolean
  error: string | null
}
