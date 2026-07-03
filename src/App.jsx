import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import ToolViewer from './pages/ToolViewer'
import Login from './pages/Login'
import Register from './pages/Register'
import ComingSoon from './pages/ComingSoon'

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
          <Route path="/suppliers" element={<ComingSoon page="Supplier Directory" />} />
          <Route path="/community" element={<ComingSoon page="Community" />} />
          <Route path="/courses" element={<ComingSoon page="Courses" />} />
          <Route path="/resources" element={<ComingSoon page="Resources" />} />
        </Routes>
      </main>
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
