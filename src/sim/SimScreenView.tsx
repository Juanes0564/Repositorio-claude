import { PlatformMark } from '../components/PlatformMark'
import { getPlatform } from '../content/platforms'
import { simulator } from '../content'
import type { PlatformId, SimScreen } from './types'
import { Block } from './blocks/Blocks'
import { useSim } from './SimContext'

/** La "pantalla del celular" de práctica, siempre con la cinta PRÁCTICA – no es real. */
export function SimScreenView({ screen, platform }: { screen: SimScreen; platform: PlatformId }) {
  const { text } = useSim()
  const p = getPlatform(platform)
  return (
    <section className="sim-device" aria-label={simulator.practiceScreen} style={{ ['--brand' as string]: p.color }}>
      <p className="sim-ribbon">{simulator.ribbon}</p>
      {screen.chrome === 'platform' ? (
        <div className="sim-appbar">
          <PlatformMark id={platform} size="sm" />
          <span className="sim-appbar__text">
            <span className="sim-appbar__name">{p.name}</span>
            {screen.title && <span className="sim-appbar__title">{text(screen.title)}</span>}
          </span>
        </div>
      ) : (
        <p className="sim-phonebar">{simulator.phoneHome}</p>
      )}
      <div className="sim-body">
        {screen.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </section>
  )
}
