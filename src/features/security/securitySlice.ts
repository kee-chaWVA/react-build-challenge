import { createSlice } from '@reduxjs/toolkit'

interface SecurityState {
  isTwoFactorVerified: boolean
  rememberBrowser: boolean
  verifiedUntil: string | null
}

const initialState: SecurityState = {
  isTwoFactorVerified: false,
  rememberBrowser: false,
  verifiedUntil: null,
}

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    verifyTwoFactor: (state) => {
      console.log("verifyTwoFactor reducer called")
      state.isTwoFactorVerified = true
    },
    resetTwoFactor: (state) => {
      state.isTwoFactorVerified = false;
    }
  },
})

export const { verifyTwoFactor, resetTwoFactor } = securitySlice.actions
export default securitySlice.reducer