const SESSION_KEY = 'app_session'

export function getSession() {
  return localStorage.getItem(SESSION_KEY)
}

export function storeSession(userId: string) {
  localStorage.setItem(SESSION_KEY, String(userId))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}