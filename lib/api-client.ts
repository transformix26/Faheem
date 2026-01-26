/**
 * API Client with JWT Token Management
 * 
 * Features:
 * - Automatic access token refresh on 401 TOKEN_EXPIRED
 * - Request interceptor adds Authorization header
 * - Response interceptor handles token expiration
 * - Retry logic for failed requests after token refresh
 */

interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: string
  credentials?: RequestCredentials
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

class ApiClient {
  private baseUrl: string
  private getAccessToken: () => string | null
  private refreshToken: () => Promise<void>
  private isRefreshing: boolean = false
  private refreshQueue: Array<() => void> = []

  constructor(
    baseUrl: string,
    getAccessToken: () => string | null,
    refreshToken: () => Promise<void>
  ) {
    this.baseUrl = baseUrl
    this.getAccessToken = getAccessToken
    this.refreshToken = refreshToken
  }

  private enqueueRefresh(callback: () => void) {
    this.refreshQueue.push(callback)
  }

  private processQueue() {
    this.refreshQueue.forEach(callback => callback())
    this.refreshQueue = []
  }

  private addAuthHeader(headers: Record<string, string>): Record<string, string> {
    const token = this.getAccessToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = this.addAuthHeader(config?.headers || {})

    try {
      const response = await fetch(url, {
        method: config?.method || 'GET',
        headers,
        body: config?.body,
        credentials: config?.credentials || 'include',
      })

      // Handle 401 Unauthorized with TOKEN_EXPIRED
      if (response.status === 401) {
        const errorData = await response.json()
        
        if (errorData.code === 'TOKEN_EXPIRED') {
          // Token expired, need to refresh
          if (!this.isRefreshing) {
            this.isRefreshing = true
            
            try {
              await this.refreshToken()
              this.processQueue()
            } catch (error) {
              this.refreshQueue = []
              throw error
            } finally {
              this.isRefreshing = false
            }
          }

          // Wait for refresh to complete, then retry
          return new Promise((resolve, reject) => {
            this.enqueueRefresh(() => {
              this.request<T>(endpoint, config)
                .then(resolve)
                .catch(reject)
            })
          })
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`[v0] API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export factory function that takes auth context
export function createApiClient(
  getAccessToken: () => string | null,
  refreshToken: () => Promise<void>
) {
  return new ApiClient('/api', getAccessToken, refreshToken)
}

export type { ApiResponse }
