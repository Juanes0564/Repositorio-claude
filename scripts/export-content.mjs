// Genera docs/REVISION-CONTENIDO.md: todos los textos de prácticas, guías, ayuda con mensajes
// y talleres, en un documento fácil de leer para que el equipo los revise (sin saber programar).
// Uso: npm run content:export
import { createServer } from 'vite'
import { writeFileSync } from 'node:fs'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const c = await server.ssrLoadModule('/src/content/index.ts')
  const { flows } = await server.ssrLoadModule('/src/content/flows/index.ts')
  const { platforms } = await server.ssrLoadModule('/src/content/platforms.ts')
  const t = (copy) => (typeof copy === 'string' ? copy : copy.text)
  const out = []
  const line = (s = '') => out.push(s)

  line('# Revisión de contenido de Vínculo')
  line()
  line('> Documento generado automáticamente desde la app (`npm run content:export`). No lo edite aquí:')
  line('> anote sus comentarios y el equipo los pasa a los archivos de `src/content/`.')
  line()
  line(`Trato actual: **${c.TREATMENT === 'usted' ? 'usted' : 'tú'}**. Todo este contenido es **borrador** hasta que una persona del equipo lo revise.`)
  line()
  line('Qué revisar: que sea correcto y seguro, que se entienda, que no haya datos ni números reales, y que el tono sea respetuoso.')
  line()
  line('Contenido:')
  line('1. Prácticas del simulador')
  line('2. Ayuda "No entiendo un mensaje" (copiloto)')
  line('3. Guías "para hacerlo en la vida real" (copiloto)')
  line('4. Talleres')
  line()

  line('## 1. Prácticas del simulador')
  for (const f of flows) {
    const p = platforms.find((x) => x.id === f.platform)
    line()
    line(`### ${t(f.title)} — ${p?.name ?? f.platform}`)
    line()
    line(`_${t(f.summary)}_ · ${f.minutes} min · ${f.steps.length} pasos · Revisado: ${f.reviewed ? 'sí' : '**no**'}`)
    line()
    f.steps.forEach((s, i) => {
      line(`**Paso ${i + 1}.** ${t(s.coach)}`)
      line(`- Pista: ${t(s.hint)}`)
      if (s.wrong) line(`- Si se equivoca: ${t(s.wrong)}`)
      if (s.success) line(`- Al acertar: ${t(s.success)}`)
      if (s.explain) line(`- Las señales: ${t(s.explain)}`)
      for (const b of s.screen.blocks) {
        if (b.type === 'sms') line(`- Mensaje de práctica (${t(b.sender)}): "${t(b.body)}"`)
        if (b.type === 'call') line(`- Llamada de práctica (${t(b.caller)}): "${t(b.transcript)}"`)
        if (b.type === 'chat') b.messages.forEach((m) => line(`- Chat (${m.from === 'me' ? 'yo' : t(b.contact)}): "${t(m.text)}"`))
        if (b.type === 'notice') line(`- Aviso en pantalla: ${t(b.text)}`)
        if (b.type === 'decision') line(`- Opciones: ${b.options.map((o) => t(o.label)).join(' / ')}`)
      }
      line()
    })
    line('**Lo que aprendió:**')
    f.finish.learned.forEach((l) => line(`- ${t(l)}`))
    line()
    line(`**Consejo de seguridad:** ${t(f.finish.tip)}`)
  }

  line()
  line('## 2. Ayuda "No entiendo un mensaje" (copiloto)')
  line()
  line(`Revisado: ${c.messageHelp.reviewed ? 'sí' : '**no**'}`)
  line()
  line(`Pregunta: ${c.messageHelp.question}`)
  line()
  for (const o of c.messageHelp.options) line(`- **${o.label}:** ${o.answer}`)
  line()
  line(`Cierre: ${c.messageHelp.remember}`)

  line()
  line('## 3. Guías "para hacerlo en la vida real" (copiloto)')
  for (const g of c.guides) {
    line()
    line(`### ${t(g.title)}`)
    line()
    line(`_${t(g.intro)}_ · Revisado: ${g.reviewed ? 'sí' : '**no**'}`)
    line()
    g.steps.forEach((s, i) => {
      line(`${i + 1}. **${t(s.text)}**`)
      line(`   - Si dice "No entiendo": ${t(s.detail)}`)
    })
  }

  line()
  line('## 4. Talleres')
  for (const w of c.workshops) {
    line()
    line(`### ${t(w.title)}`)
    line()
    line(`_${t(w.summary)}_ · ${w.minutes} min · Revisado: ${w.reviewed ? 'sí' : '**no**'}${w.videoUrl ? ` · Video: ${w.videoUrl}` : ''}`)
    line()
    w.cards.forEach((card, i) => {
      line(`**Tarjeta ${i + 1}. ${t(card.title)}** — ${t(card.body)}`)
      if (card.tip) line(`- Ojo: ${t(card.tip)}`)
      line()
    })
    if (w.quiz?.length) {
      line('**Mini repaso:**')
      w.quiz.forEach((q, i) => {
        line(`${i + 1}. ${t(q.question)}`)
        q.options.forEach((o, j) => line(`   - ${j === q.answer ? '✅' : '◻️'} ${t(o)}`))
        line(`   - Explicación: ${t(q.explanation)}`)
      })
    }
  }
  line()
  writeFileSync('docs/REVISION-CONTENIDO.md', out.join('\n'))
  console.log(`docs/REVISION-CONTENIDO.md (${out.length} líneas)`)
} finally {
  await server.close()
}
