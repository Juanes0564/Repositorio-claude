import { CheckCircle2, ChevronRight, Info, MessageSquareText, Mic, Image, TriangleAlert, UserRound } from 'lucide-react'
import { PlatformMark } from '../../components/PlatformMark'
import { common } from '../../content'
import type { SimBlock } from '../types'
import { useSim } from '../SimContext'
import { simIcons } from './icons'
import { Keypad } from './Keypad'
import { SimButton } from './SimButton'

/** Dibuja un bloque de pantalla simulada. Cada tipo es una pieza reutilizable. */
export function Block({ block }: { block: SimBlock }) {
  const { text } = useSim()
  switch (block.type) {
    case 'heading':
      return <h3 className="sim-heading">{text(block.text)}</h3>

    case 'text':
      return <p className={block.tone === 'muted' ? 'sim-text muted' : 'sim-text'}>{text(block.text)}</p>

    case 'notice': {
      const Icon = block.tone === 'warning' ? TriangleAlert : Info
      return (
        <p className={`sim-notice sim-notice--${block.tone ?? 'info'}`}>
          <Icon className="icon" aria-hidden="true" />
          <span>{text(block.text)}</span>
        </p>
      )
    }

    case 'balance':
      return (
        <div className="sim-balance">
          <span className="sim-balance__label">{text(block.label)}</span>
          <span className="sim-balance__amount">{block.amount}</span>
          {block.note && <span className="sim-balance__note">{text(block.note)}</span>}
        </div>
      )

    case 'tiles':
      return (
        <div className={`sim-tiles sim-tiles--${block.columns ?? 2}`}>
          {block.items.map((item) => {
            const Icon = item.icon ? simIcons[item.icon] : null
            return (
              <SimButton key={item.id} id={item.id} className="sim-tile">
                {item.platform ? (
                  <PlatformMark id={item.platform} size="md" />
                ) : (
                  Icon && (
                    <span className="sim-tile__icon">
                      <Icon className="icon" aria-hidden="true" />
                    </span>
                  )
                )}
                <span className="sim-tile__label">{text(item.label)}</span>
              </SimButton>
            )
          })}
        </div>
      )

    case 'list':
      return (
        <div className="sim-list">
          {block.title && <p className="sim-list__title">{text(block.title)}</p>}
          {block.items.map((item) => {
            const Icon = item.icon ? simIcons[item.icon] : null
            return (
              <SimButton key={item.id} id={item.id} className="sim-row">
                {Icon && (
                  <span className="sim-row__icon">
                    <Icon className="icon" aria-hidden="true" />
                  </span>
                )}
                <span className="sim-row__text">
                  <span className="sim-row__label">{text(item.label)}</span>
                  {item.detail && <span className="sim-row__detail">{text(item.detail)}</span>}
                </span>
                <ChevronRight className="icon sim-row__chevron" aria-hidden="true" />
              </SimButton>
            )
          })}
        </div>
      )

    case 'form':
      return (
        <div className="sim-form">
          {block.fields.map((f) => (
            <SimButton key={f.id} id={f.id} className="sim-field">
              <span className="sim-field__label">{text(f.label)}</span>
              <span className={f.value ? 'sim-field__value' : 'sim-field__value muted'}>
                {f.value ? text(f.value) : f.placeholder ? text(f.placeholder) : ''}
              </span>
            </SimButton>
          ))}
        </div>
      )

    case 'actions':
      return (
        <div className="sim-actions">
          {block.items.map((a) => (
            <SimButton key={a.id} id={a.id} className={`sim-action sim-action--${a.variant ?? 'primary'}`}>
              {text(a.label)}
            </SimButton>
          ))}
        </div>
      )

    case 'keypad':
      return <Keypad block={block} />

    case 'summary':
      return (
        <div className="sim-summary">
          {block.title && <p className="sim-list__title">{text(block.title)}</p>}
          <dl>
            {block.rows.map((r, i) => (
              <div key={i} className="sim-summary__row">
                <dt>{text(r.label)}</dt>
                <dd>{text(r.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )

    case 'receipt':
      return (
        <div className="sim-receipt">
          <CheckCircle2 className="sim-receipt__icon" aria-hidden="true" />
          <p className="sim-receipt__title">{text(block.title)}</p>
          <p className="sim-receipt__status">{text(block.status)}</p>
          <dl>
            {block.rows.map((r, i) => (
              <div key={i} className="sim-summary__row">
                <dt>{text(r.label)}</dt>
                <dd>{text(r.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )

    case 'sms':
      return (
        <div className="sim-sms">
          <p className="sim-sms__head">
            <MessageSquareText className="icon" aria-hidden="true" />
            <strong>{text(block.sender)}</strong>
            {block.time && <span className="muted">{text(block.time)}</span>}
          </p>
          <p className="sim-sms__body">{text(block.body)}</p>
          {block.link && (
            <SimButton id={block.link.id} className="sim-sms__link">
              {text(block.link.label)}
            </SimButton>
          )}
        </div>
      )

    case 'chat':
      return (
        <div className="sim-chat">
          <p className="sim-chat__contact">
            <UserRound className="icon" aria-hidden="true" />
            <strong>{text(block.contact)}</strong>
          </p>
          <ol className="sim-chat__messages">
            {block.messages.map((m, i) => (
              <li key={i} className={`sim-bubble sim-bubble--${m.from}`}>
                {m.kind === 'audio' && <Mic className="icon icon--inline" aria-hidden="true" />}
                {m.kind === 'photo' && <Image className="icon icon--inline" aria-hidden="true" />} {text(m.text)}
              </li>
            ))}
          </ol>
          {block.composer && (
            <div className="sim-chat__composer">
              <span className="sim-chat__input">{text(block.composer.placeholder)}</span>
              <div className="sim-chat__buttons">
                {block.composer.buttons.map((b) => {
                  const Icon = simIcons[b.icon]
                  return (
                    <SimButton key={b.id} id={b.id} className="sim-chat__btn">
                      <Icon className="icon" aria-hidden="true" />
                      <span>{text(b.label)}</span>
                    </SimButton>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )

    case 'settings':
      return (
        <div className="sim-settings">
          {block.rows.map((r) => {
            const Icon = r.icon ? simIcons[r.icon] : null
            return (
              <SimButton key={r.id} id={r.id} className="sim-row sim-setting">
                {Icon && (
                  <span className="sim-row__icon">
                    <Icon className="icon" aria-hidden="true" />
                  </span>
                )}
                <span className="sim-row__text">
                  <span className="sim-row__label">{text(r.label)}</span>
                  {r.value && <span className="sim-row__detail">{text(r.value)}</span>}
                </span>
                {r.control === 'toggle' ? (
                  <span className={`sim-toggle ${r.on ? 'is-on' : ''}`}>{r.on ? common.yes : common.no}</span>
                ) : (
                  <ChevronRight className="icon sim-row__chevron" aria-hidden="true" />
                )}
              </SimButton>
            )
          })}
        </div>
      )
  }
}
