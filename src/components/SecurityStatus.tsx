import { useSelector } from 'react-redux'
import type { RootState } from '../app/store'

export default function SecurityStatus() {
  const verified = useSelector(
    (state: RootState) => state.security.isTwoFactorVerified
  )

  return (
    <div>
      <h2>2FA Status</h2>
      {verified ? 'Verified' : 'Not Verifiedt'}
    </div>
  )
}