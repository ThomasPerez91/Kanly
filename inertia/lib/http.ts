export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string; details?: unknown }

type RequestOptions<TBody> = {
  method?: HttpMethod
  body?: TBody
  headers?: Record<string, string>
  query?: Record<string, string | number | boolean | null | undefined>
  signal?: AbortSignal

  /**
   * Adonis session auth => must send cookies
   */
  credentials?: RequestCredentials

  /**
   * Pass CSRF explicitly (recommended with Inertia shared props)
   */
  csrfToken?: string
}

const withQuery = (url: string, query?: RequestOptions<any>['query']) => {
  if (!query) return url

  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue
    params.set(k, String(v))
  }

  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

const parseError = (status: number, payload?: any): string => {
  if (payload?.message) return payload.message
  if (payload?.error) return payload.error

  if (status === 401) return 'Unauthorized'
  if (status === 403) return 'Forbidden'
  if (status === 404) return 'Not found'
  if (status >= 500) return 'Server error'

  return 'Request failed'
}

const safeJsonParse = (raw: string) => {
  try {
    return { ok: true as const, value: JSON.parse(raw) }
  } catch {
    return { ok: false as const, value: raw }
  }
}

export const http = {
  async request<TResponse, TBody = unknown>(
    url: string,
    options: RequestOptions<TBody> = {}
  ): Promise<HttpResult<TResponse>> {
    const method = options.method ?? 'GET'

    const headers: Record<string, string> = {
      Accept: 'application/json',
      // Helps many backends return JSON errors instead of HTML
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    }

    if (options.csrfToken) {
      headers['X-CSRF-TOKEN'] = options.csrfToken
    }

    let body: BodyInit | undefined
    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(options.body)
    }

    try {
      const response = await fetch(withQuery(url, options.query), {
        method,
        headers,
        body,
        credentials: options.credentials ?? 'same-origin',
        signal: options.signal,
        redirect: 'follow',
      })

      // 204 No Content
      if (response.status === 204) {
        if (!response.ok) {
          return { ok: false, status: response.status, error: parseError(response.status) }
        }
        return { ok: true, status: response.status, data: undefined as unknown as TResponse }
      }

      const contentType = response.headers.get('content-type') ?? ''
      const raw = await response.text()

      // Empty body (can happen on redirects / some responses)
      if (!raw) {
        if (!response.ok) {
          return {
            ok: false,
            status: response.status,
            error: parseError(response.status),
          }
        }
        return { ok: true, status: response.status, data: undefined as unknown as TResponse }
      }

      // Parse JSON only when it makes sense (or try-parse safely)
      let payload: any = undefined

      if (contentType.includes('application/json')) {
        const parsed = safeJsonParse(raw)
        payload = parsed.ok ? parsed.value : undefined
      } else {
        // Non-json (HTML redirect pages, etc.)
        const parsed = safeJsonParse(raw)
        payload = parsed.ok ? parsed.value : raw
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: parseError(response.status, payload),
          details: payload,
        }
      }

      return {
        ok: true,
        status: response.status,
        data: payload as TResponse,
      }
    } catch (error: any) {
      return {
        ok: false,
        status: 0,
        error: error?.message ?? 'Network error',
        details: error,
      }
    }
  },

  get<T>(url: string, options: Omit<RequestOptions<never>, 'method' | 'body'> = {}) {
    return http.request<T>(url, { ...options, method: 'GET' })
  },

  post<T, B>(url: string, body: B, options: Omit<RequestOptions<B>, 'method' | 'body'> = {}) {
    return http.request<T, B>(url, { ...options, method: 'POST', body })
  },

  put<T, B>(url: string, body: B, options: Omit<RequestOptions<B>, 'method' | 'body'> = {}) {
    return http.request<T, B>(url, { ...options, method: 'PUT', body })
  },

  patch<T, B>(url: string, body: B, options: Omit<RequestOptions<B>, 'method' | 'body'> = {}) {
    return http.request<T, B>(url, { ...options, method: 'PATCH', body })
  },

  del<T>(url: string, options: Omit<RequestOptions<never>, 'method' | 'body'> = {}) {
    return http.request<T>(url, { ...options, method: 'DELETE' })
  },

  delete<T>(url: string, options: Omit<RequestOptions<never>, 'method' | 'body'> = {}) {
    return http.request<T>(url, { ...options, method: 'DELETE' })
  },
}
