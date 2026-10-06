import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Switch } from '../components/Switch'
import { common, profile, voice } from '../content'
import { isRecognitionSupported } from '../lib/recognition'
import { useAppState } from '../state/useAppState'

/** Perfil: nombre, voz, modo sencillo, privacidad, acerca de y borrar datos. */
export function Profile() {
  const { data, setName, updateSettings, setSimpleMode, eraseAll } = useAppState()
  const navigate = useNavigate()
  const [nameDraft, setNameDraft] = useState(data.profile.name)
  const [justSaved, setJustSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const s = data.settings

  const saveName = (e: FormEvent) => {
    e.preventDefault()
    setName(nameDraft)
    setJustSaved(true)
  }

  const erase = () => {
    eraseAll()
    setConfirming(false)
    navigate('/bienvenida', { replace: true })
  }

  return (
    <div className="page">
      <h1>{profile.title}</h1>

      <section className="panel" aria-labelledby="p-name">
        <h2 id="p-name">{profile.name.heading}</h2>
        <form className="stack stack--tight" onSubmit={saveName}>
          <div className="field">
            <label htmlFor="profile-name">{profile.name.label}</label>
            <input
              id="profile-name"
              type="text"
              autoComplete="given-name"
              autoCapitalize="words"
              maxLength={40}
              value={nameDraft}
              onChange={(e) => {
                setNameDraft(e.target.value)
                setJustSaved(false)
              }}
            />
            <p className="field__help">{profile.name.help}</p>
          </div>
          <button type="submit" className="btn btn--primary btn--block">
            {common.save}
          </button>
          <p className="status-text" role="status">
            {justSaved && (
              <>
                <Check className="icon icon--inline" aria-hidden="true" /> {common.saved}
              </>
            )}
          </p>
        </form>
      </section>

      <section className="panel" aria-labelledby="p-voice">
        <h2 id="p-voice">{profile.voice.heading}</h2>
        <Switch
          label={profile.voice.toggle}
          help={profile.voice.toggleHelp}
          checked={s.voiceEnabled}
          onChange={(v) => updateSettings({ voiceEnabled: v })}
        />
        {isRecognitionSupported() ? (
          <Switch
            label={voice.profile.toggle}
            help={voice.profile.help}
            checked={s.voiceInput === 'granted'}
            onChange={(v) => updateSettings({ voiceInput: v ? 'granted' : 'declined' })}
          />
        ) : (
          <p className="muted">{voice.profile.unsupported}</p>
        )}
        <fieldset className="choice-group">
          <legend>{profile.voice.rate}</legend>
          <div className="choice-row">
            {(['slow', 'normal'] as const).map((rate) => (
              <label key={rate} className="choice">
                <input
                  type="radio"
                  name="voice-rate"
                  value={rate}
                  checked={s.voiceRate === rate}
                  onChange={() => updateSettings({ voiceRate: rate })}
                />
                <span>{rate === 'slow' ? profile.voice.slow : profile.voice.normal}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="panel" aria-labelledby="p-simple">
        <h2 id="p-simple">{profile.simple.heading}</h2>
        <Switch
          label={profile.simple.toggle}
          help={profile.simple.toggleHelp}
          checked={s.simpleMode}
          onChange={setSimpleMode}
        />
        <Link to="/modo-sencillo" className="row-link">
          <span>{profile.simple.more}</span>
          <ChevronRight className="icon" aria-hidden="true" />
        </Link>
      </section>

      <section className="panel" aria-labelledby="p-passport">
        <h2 id="p-passport">{profile.passport.heading}</h2>
        <Link to="/avances" className="row-link">
          <span>{profile.passport.link}</span>
          <ChevronRight className="icon" aria-hidden="true" />
        </Link>
      </section>

      <section className="panel" aria-labelledby="p-privacy">
        <h2 id="p-privacy">{profile.privacy.heading}</h2>
        <ul className="bullets">
          {profile.privacy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="p-about">
        <h2 id="p-about">{profile.about.heading}</h2>
        <p>
          <strong>{common.appName}</strong> · {profile.about.version(__APP_VERSION__)}
        </p>
        <p>{profile.about.beta}</p>
        <p className="muted">{profile.about.origin}</p>
      </section>

      <section className="panel" aria-labelledby="p-erase">
        <h2 id="p-erase">{profile.erase.heading}</h2>
        <p>{profile.erase.help}</p>
        <button type="button" className="btn btn--danger-outline btn--block" onClick={() => setConfirming(true)}>
          <Trash2 className="icon" aria-hidden="true" />
          <span>{profile.erase.button}</span>
        </button>
      </section>

      {confirming && (
        <ConfirmDialog
          title={profile.erase.confirmTitle}
          body={profile.erase.confirmBody}
          confirmLabel={profile.erase.confirmYes}
          cancelLabel={profile.erase.confirmNo}
          danger
          onConfirm={erase}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  )
}
