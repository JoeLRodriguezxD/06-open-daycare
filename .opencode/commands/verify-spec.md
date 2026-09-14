---
description: Verifica un spec contra sus acceptance criteria, corrige y marca los checks
agent: spec-verifier
subtask: true
---

Verifica el spec indicado en $ARGUMENTS contra su sección de acceptance
criteria (o criterios de aceptación).

- $ARGUMENTS puede ser la ruta (`specs/01-home-feed.md`), el número (`01`)
  o el slug (`01-home-feed`).
- Si $ARGUMENTS está vacío, lista `specs/` y pregunta cuál verificar.
- Corre en este orden: comandos (`lint` → `tsc --noEmit` → `build`),
  revisión de código con Context7 (reglas Next.js 16 vigentes) y
  verificación visual con Playwright sobre `npm run dev` comparando con
  `references/pantallas/` y `references/screenshots/`.
- Corrige el código y el spec cuando un criterio no se cumpla y marca
  `- [x]` solo con evidencia real. Lo que falle queda `- [ ]` explicado
  en el reporte final en tabla criterio → ✅/❌ → evidencia → fix.
