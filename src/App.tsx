import { Routes, Route } from 'react-router-dom'
import QuotesPage from './pages/QuotesPage'
import SearchPage from './pages/SearchPage'
import Navbar from './components/Navbar'
import './App.css'
import NotFoundPage from './pages/NotFound'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProtectedLayout from './routes/ProtectedLayout'

export default function App() {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route element={<ProtectedLayout/>}>
          <Route path='/search' element={<SearchPage/>}/>
          <Route path='/quotes' element={<QuotesPage/>}/>
          <Route path='*' element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </div>
  )
}