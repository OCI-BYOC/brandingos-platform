export type UserTier = "free" | "pro" | "growth" | "brand"

export interface ApiResponse<T> {
  data: T
  error?: never
}

export interface ApiError {
  data?: never
  error: { code: string; message: string }
}

export type Result<T> = ApiResponse<T> | ApiError

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export type CreatorUsername = string

export type ISODateString = string
