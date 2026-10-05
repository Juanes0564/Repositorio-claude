import { voice } from '../content'
import { ConfirmDialog } from './ConfirmDialog'

/** Aviso de privacidad antes del primer uso del micrófono (regla 4a del brief). */
export function VoiceConsentDialog({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <ConfirmDialog
      title={voice.consent.title}
      body={voice.consent.body}
      confirmLabel={voice.consent.yes}
      cancelLabel={voice.consent.no}
      onConfirm={onAccept}
      onCancel={onDecline}
    />
  )
}
