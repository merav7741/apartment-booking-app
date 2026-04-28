export interface Apartment {
  _id: string
  name: string
  price: number
  pricePerNight: number
  address: string
  bedrooms: number
  description?: string
  location?: string
  ownerId: string
  image?: string[]
  amenities?: string[]
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
