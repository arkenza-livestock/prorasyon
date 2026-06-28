import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Landing from './pages/auth/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Rasyon from './pages/rasyon/Rasyon'
import Tartim from './pages/tartim/Tartim'
import Gider from './pages/gider/Gider'
import Kar from './pages/kar/Kar'
import Raporlar from './pages/raporlar/Raporlar'
import Admin from './pages/admin/Admin'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#22663a', fontWeight:700 }}>Yükleniyor...</div>
  return user ? children : <Navigate to="/giris" replace />
}

function AdminRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  return profile?.role === 'admin' ? children : <Navigate to="/panel" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/giris" element={<Login />} />
  <Route path="/kayit" element={<Register />} />
  <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
    <Route index element={<Navigate to="/app/panel" replace />} />
    <Route path="panel" element={<Dashboard />} />
    <Route path="rasyon" element={<Rasyon />} />
    <Route path="tartim" element={<Tartim />} />
    <Route path="gider" element={<Gider />} />
    <Route path="kar" element={<Kar />} />
    <Route path="raporlar" element={<Raporlar />} />
    <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
  </Route>
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}