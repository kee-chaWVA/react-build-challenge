const SESSION_KEY = 'app_session'

export function getSession() {
  return localStorage.getItem(SESSION_KEY)
}

export function storeSession(userId: string) {
  if (userId.trim().length < 1) return;
  localStorage.setItem(SESSION_KEY, String(userId))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}