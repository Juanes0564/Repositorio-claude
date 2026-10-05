import { tv } from './treatment'

export const common = {
  appName: 'Vínculo',
  tagline: 'Aprende, practica y hazlo tú',
  back: 'Volver',
  cancel: 'Cancelar',
  save: 'Guardar',
  saved: 'Guardado',
  continue: 'Continuar',
  yes: 'Sí',
  no: 'No',
  on: 'Activado',
  off: 'Desactivado',
  close: 'Cerrar',
  nav: {
    label: 'Navegación principal',
    home: 'Inicio',
    progress: 'Mis avances',
    help: 'Ayuda',
    profile: 'Perfil',
  },
  skipToContent: 'Saltar al contenido',
  statusBarLabel: 'Barra de estado decorativa',
  comingSoon: {
    title: 'Estamos preparando esta sección',
    body: tv(
      'Muy pronto podrás usarla. Mientras tanto, vuelve al inicio.',
      'Muy pronto podrá usarla. Mientras tanto, vuelva al inicio.',
    ),
    goHome: 'Ir al inicio',
  },
  notFound: {
    title: 'No encontramos esta página',
    body: tv('No pasa nada. Vuelve al inicio.', 'No pasa nada. Vuelva al inicio.'),
  },
}
