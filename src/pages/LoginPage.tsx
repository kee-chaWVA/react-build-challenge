import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import Button from "../components/Button"
import { useNavigate } from 'react-router-dom'
import { users } from '../data/users'

export default function LoginPage() {
  const { login } = useAuth()
  const [ userNameInput, setUserNameInput ] = useState<string>('')
  const [ userPw, setUserPw ] = useState<string>('')
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()
  
  
  const handleLogin = (e) => {
    e.preventDefault()
    const normalizeUserInput =  userNameInput.trim() 
    const foundUser = users.find(
      (user) => user.userName === normalizeUserInput
    )
    if (!foundUser) {
      setError('User not found!')
      return
    }
    setError('')
    login(foundUser)
    navigate('/')
  }

  const handleUserNameInput = (e) => {
    setError('')
    setUserNameInput(e.currentTarget.value)
  }

  const handleUserPw = (e) => {
    setError('')
    setUserPw(e.currentTarget.value)
  }


  return (
    <form onSubmit={handleLogin}>
      {error &&
          <p 
            id='login-error'
            aria-live="assertive"
          >
            {error}
          </p>}
      <div>    
        <label htmlFor='user-login'>
          User Name
        </label>
        <input
          id='user-login'
          type="text"
          value={userNameInput}
          onChange={handleUserNameInput}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'login-error' : undefined}
          autoComplete="username"
          required
          />
      </div>
      <div>
        <label htmlFor="user-pw">
          Password
        </label>
        <input
          id='user-pw'
          type='password'
          value={userPw}
          onChange={handleUserPw}
          autoComplete="current-password"
          required
        />
      </div>
      <Button type='submit'>
        Log In
      </Button>
    </form>
  )
}