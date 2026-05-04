import { Routes, Route } from 'react-router-dom'
import QuotesPage from './pages/QuotesPage'
import SearchPage from './pages/SearchPage'
import Navbar from './components/Navbar'
import './styles/layout.css'
import NotFoundPage from './pages/NotFound'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AboutPage from './pages/AboutPage'
import ContactUsPage from './pages/ContactUsPage'
import ProtectedLayout from './routes/ProtectedLayout'
import PokemonPage from './pages/PokemonPage'
import { ThemeModeToggle } from './components/ThemeModeToggle'

export default function App() {
  return (
    <div className='app'>
      <header className='site-header'>
        <div className='container'>
          <Navbar/>
        </div>
      </header>
      <main className='site-main'>
        <div className='content-container'>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/about' element={<AboutPage/>}/>
            <Route path='/contact-us' element={<ContactUsPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route element={<ProtectedLayout/>}>
              <Route path='/pokemon' element={<PokemonPage/>}/>
              <Route path='/search' element={<SearchPage/>}/>
              <Route path='/quotes' element={<QuotesPage/>}/>
            </Route>
            <Route path='*' element={<NotFoundPage/>}/>
          </Routes>
        </div>
      </main>
      <footer
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px'
        }}
        >
          <ThemeModeToggle/>
        </footer>
    </div>
  )
}