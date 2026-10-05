import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PhoneFrame } from './components/PhoneFrame'
import { screenTitles } from './content'
import { ComingSoon } from './screens/ComingSoon'
import { Home } from './screens/Home'
import { NotFound } from './screens/NotFound'
import { Profile } from './screens/Profile'
import { Welcome } from './screens/Welcome'
import { useAppState } from './state/useAppState'

function Routed() {
  const { data } = useAppState()
  const { pathname } = useLocation()

  if (!data.onboardingDone && pathname !== '/bienvenida') {
    return <Navigate to="/bienvenida" replace />
  }

  return (
    <Routes>
      <Route element={<Layout showNav={false} />}>
        <Route path="/bienvenida" element={<Welcome />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/avances" element={<ComingSoon title={screenTitles.progress} />} />
        <Route path="/ayuda" element={<ComingSoon title={screenTitles.help} />} />
        <Route path="/practicar" element={<ComingSoon title={screenTitles.practice} />} />
        <Route path="/copiloto" element={<ComingSoon title={screenTitles.copilot} />} />
        <Route path="/talleres" element={<ComingSoon title={screenTitles.workshops} />} />
        <Route path="/modo-sencillo" element={<ComingSoon title={screenTitles.simpleMode} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <PhoneFrame>
      <Routed />
    </PhoneFrame>
  )
}
