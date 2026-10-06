import { useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronDown, Download, Headset, MessageCircle, Smartphone, Video } from 'lucide-react'
import { help } from '../content'
import { HUMAN_HELP_ENABLED, humanHelpLink } from '../config/humanHelp'
import { canInstall, isInstalled, promptInstall, subscribeInstall } from '../lib/install'

/** Pantalla 10: ayuda humana (solo diseño, "Próximamente"), preguntas frecuentes y cómo instalar. */
export function Help() {
  const [soon, setSoon] = useState(false)
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false)
  const [installed] = useState(isInstalled)
  const link = humanHelpLink()
  const h = help.human

  return (
    <div className="page help">
      <h1>{help.title}</h1>

      <section className="panel" aria-labelledby="human-title">
        <h2 id="human-title">
          <Headset className="icon icon--inline" aria-hidden="true" /> {h.title}
        </h2>
        <p>{h.body}</p>
        {HUMAN_HELP_ENABLED && link ? (
          // Cuando haya guías: los botones abren WhatsApp (wa.me). Ver src/config/humanHelp.ts.
          <a className="btn btn--primary btn--block" href={link} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="icon" aria-hidden="true" />
            <span>{h.whatsapp}</span>
          </a>
        ) : (
          <>
            <button type="button" className="btn btn--secondary btn--block btn--stacked" onClick={() => setSoon(true)}>
              <span>
                <Video className="icon icon--inline" aria-hidden="true" /> {h.video}
              </span>
              <span className="btn__sub">{h.soon}</span>
            </button>
            <button type="button" className="btn btn--secondary btn--block btn--stacked" onClick={() => setSoon(true)}>
              <span>
                <MessageCircle className="icon icon--inline" aria-hidden="true" /> {h.chat}
              </span>
              <span className="btn__sub">{h.soon}</span>
            </button>
          </>
        )}
        <div aria-live="polite">
          {soon && (
            <div className="soon">
              <p>
                <strong>{h.soon}.</strong> {h.soonMessage}
              </p>
              <Link to="/copiloto" className="btn btn--primary btn--block">
                <Headset className="icon" aria-hidden="true" />
                <span>{h.copilot}</span>
              </Link>
              <Link to="/talleres" className="btn btn--secondary btn--block">
                <BookOpen className="icon" aria-hidden="true" />
                <span>{h.workshops}</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="faq-title" className="stack stack--tight">
        <h2 id="faq-title">{help.faqTitle}</h2>
        {help.faq.map((f) => (
          <details key={f.q} className="faq">
            <summary>
              <span>{f.q}</span>
              <ChevronDown className="icon faq__chevron" aria-hidden="true" />
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <section className="panel" aria-labelledby="install-title">
        <h2 id="install-title">
          <Smartphone className="icon icon--inline" aria-hidden="true" /> {help.install.title}
        </h2>
        <p>{help.install.intro}</p>
        {installed ? (
          <p className="status-text">{help.install.installed}</p>
        ) : (
          installable && (
            <button type="button" className="btn btn--primary btn--block" onClick={() => void promptInstall()}>
              <Download className="icon" aria-hidden="true" />
              <span>{help.install.now}</span>
            </button>
          )
        )}
        <h3>{help.install.android}</h3>
        <ol className="steps">
          {help.install.androidSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <h3>{help.install.iphone}</h3>
        <ol className="steps">
          {help.install.iphoneSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
