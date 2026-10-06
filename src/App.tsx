import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PhoneFrame } from './components/PhoneFrame'
import { Certificate } from './screens/Certificate'
import { Copilot } from './screens/Copilot'
import { Help } from './screens/Help'
import { Passport } from './screens/Passport'
import { SimpleModeSettings } from './screens/SimpleModeSettings'
import { Home } from './screens/Home'
import { NotFound } from './screens/NotFound'
import { PlatformDetail } from './screens/PlatformDetail'
import { PlatformPicker } from './screens/PlatformPicker'
import { Profile } from './screens/Profile'
import { Simulator } from './screens/Simulator'
import { Welcome } from './screens/Welcome'
import { WorkshopView } from './screens/WorkshopView'
import { Workshops } from './screens/Workshops'
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
        <Route path="/practicar/:platformId/:flowId" element={<Simulator />} />
      </Route>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/avances" element={<Passport />} />
        <Route path="/avances/certificado" element={<Certificate />} />
        <Route path="/ayuda" element={<Help />} />
        <Route path="/practicar" element={<PlatformPicker />} />
        <Route path="/practicar/:platformId" element={<PlatformDetail />} />
        <Route path="/copiloto" element={<Copilot />} />
        <Route path="/talleres" element={<Workshops />} />
        <Route path="/talleres/:workshopId" element={<WorkshopView />} />
        <Route path="/modo-sencillo" element={<SimpleModeSettings />} />
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
