export interface ApartmentOwner {
  _id: string
  name?: string
  fullName?: string
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
  createdAt?: string
  updatedAt?: string
}

export interface ApartmentState {
  allApartments: Apartment[]
  myApartments: Apartment[]
  currentApartment: Apartment | null
  loading: boolean
  error: string | null
}
