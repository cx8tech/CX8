import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import ToolViewer from './pages/ToolViewer'
import Login from './pages/Login'
import Register from './pages/Register'
import Suppliers from './pages/Suppliers'
import Community from './pages/Community'
import Courses from './pages/Courses'
import Resources from './pages/Resources'
import ScrollToTop from './components/ScrollToTop'

function AppLayout() {
  const { pathname } = useLocation()
  const isToolViewer = /^\/tools\/.+/.test(pathname)

  return (
    <div className="page-wrap">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:toolId" element={<ToolViewer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <ScrollToTop />
      {!isToolViewer && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
