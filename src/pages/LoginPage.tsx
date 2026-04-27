import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login } = useAuth()
  const [ userNameInput, setUserNameInput ] = useState<string>('')
  const [ userPw, setUserPw ] = useState<string>('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    login()
    navigate('/search')
  }

  const handleUserNameInput = (e) => {
    setUserNameInput(e.currentTarget.value)
  }

  const handleUserPw = (e) => {
    setUserPw(e.currentTarget.value)
  }
  return (
    <form onSubmit={handleLogin}>
      <div>    
        <label htmlFor='user-login'>
          User Name
        </label>
        <input
          id='user-login'
          type="text"
          value={userNameInput}
          onChange={handleUserNameInput}
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
        />
      </div>
      <Button type='submit'>
        Log In
      </Button>
    </form>
  )
}