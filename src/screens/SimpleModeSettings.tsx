import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Send } from 'lucide-react'
import { Switch } from '../components/Switch'
import { TopBar } from '../components/TopBar'
import { simpleModeUi as ui } from '../content'
import type { FontSize, VoiceRate } from '../lib/storage'
import { workshopPath } from '../lib/paths'
import { useAppState } from '../state/useAppState'

/** Grupo de opciones con botones de radio grandes. */
function Choice<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string
  name: string
  value: T
  options: Record<T, string>
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="choice-group">
      <legend>{legend}</legend>
      <div className="choice-row">
        {(Object.keys(options) as T[]).map((key) => (
          <label key={key} className="choice">
            <input type="radio" name={name} value={key} checked={value === key} onChange={() => onChange(key)} />
            <span>{options[key]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Pantalla 7: configurar el modo sencillo. Los cambios se aplican al instante en toda la app. */
export function SimpleModeSettings() {
  const { data, updateSettings, setSimpleMode } = useAppState()
  const s = data.settings

  return (
    <div className="page">
      <TopBar title={ui.title} />
      <p>{ui.intro}</p>

      <Switch label={ui.master} help={ui.masterHelp} checked={s.simpleMode} onChange={setSimpleMode} />

      <section className="panel" aria-label={ui.title}>
        <Choice<FontSize>
          legend={ui.fontSize}
          name="font-size"
          value={s.fontSize}
          options={ui.fontSizes}
          onChange={(v) => updateSettings({ fontSize: v })}
        />
        <Choice<'normal' | 'large'>
          legend={ui.icons}
          name="icon-size"
          value={s.largeIcons ? 'large' : 'normal'}
          options={ui.iconSizes}
          onChange={(v) => updateSettings({ largeIcons: v === 'large' })}
        />
        <Switch
          label={ui.fewerOptions}
          help={ui.fewerOptionsHelp}
          checked={s.fewerOptions}
          onChange={(v) => updateSettings({ fewerOptions: v })}
        />
        <Switch
          label={ui.simpleLanguage}
          help={ui.simpleLanguageHelp}
          checked={s.simpleLanguage}
          onChange={(v) => updateSettings({ simpleLanguage: v })}
        />
        <Switch
          label={ui.highContrast}
          help={ui.highContrastHelp}
          checked={s.highContrast}
          onChange={(v) => updateSettings({ highContrast: v })}
        />
        <Choice<VoiceRate>
          legend={ui.voiceRate}
          name="voice-rate-simple"
          value={s.voiceRate}
          options={ui.voiceRates}
          onChange={(v) => updateSettings({ voiceRate: v })}
        />
      </section>

      <section className="panel preview" aria-labelledby="preview-title">
        <h2 id="preview-title">{ui.previewTitle}</h2>
        <p>{ui.previewText}</p>
        <span className="preview__button" aria-hidden="true">
          <Send className="icon" />
          <span>{ui.previewButton}</span>
        </span>
      </section>

      <section className="panel" aria-labelledby="phone-title">
        <h2 id="phone-title">{ui.phoneTitle}</h2>
        <p>{ui.phoneBody}</p>
        <Link to={workshopPath('phoneSettings')} className="row-link">
          <span>
            <BookOpen className="icon icon--inline" aria-hidden="true" /> {ui.phoneLink}
          </span>
          <ChevronRight className="icon" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
