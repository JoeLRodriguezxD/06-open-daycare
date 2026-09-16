# SPEC 06 — Fix del modal Vincular padre recortado y con parpadeo en la lista de niños

> **Status:** Implemented
> **Depends on:** SPEC 02, SPEC 04, SPEC 05
> **Date:** 2026-09-16
> **Objective:** Corregir la apertura del modal Vincular padre desde la lista y el perfil para que abra estable a fullscreen sin navegar ni recortarse, sin cambiar su lógica ni su persistencia.

## Scope

**In:**

- Reestructurar `app/components/kids/KidCard.tsx` para sacar el botón VINCULAR y el modal de dentro del `<Link>` a `/kids/[slug]` (contenedor + Link interno de navegación + botón hermano).
- Renderizar `app/components/kids/LinkParentModal.tsx` en un portal a `document.body` (o fuera de cualquier ancestro con transform/overflow), con overlay fullscreen `fixed inset-0` y tarjeta de 480px idéntica a `references/pantallas/vincular-padre.dc.html`.
- Aplicar el mismo render fuera de ancestros con transform al trigger del perfil (`app/components/kids/LinkedParents.tsx` y su trigger) en `/kids/[slug]`.
- Garantizar que un clic en VINCULAR abre el modal una sola vez y queda estable, sin cambiar la URL.
- Mantener intacta la UX de SPEC 05: validación triple en español al submit, pills Mamá/Papá/Tutor-a sin selección inicial, código de 5 caracteres en mayúsculas con `Vence en 7 días` fijo, envío válido que solo cierra y queda en origen, cierres con X, overlay y Escape.
- Mantener estilo con tokens de `app/globals.css`, Fredoka + Nunito vía `next/font`, y código interno en inglés.

**Out of scope (for future specs):**

- Backend, base de datos, API o envío real de email.
- Persistencia del padre invitado o paso a PENDIENTE real.
- Cambios en los textos, la validación o el formato del código de invitación.
- Ruta `/vincular-padre` como página independiente.
- Activación de cuenta con el código.
- Editar o eliminar padres vinculados.
- Resto de rutas futuras.

## Data model

Esta feature no introduce estructuras de datos nuevas. Reutiliza el modelo de SPEC 05 en `lib/parent-invite-validation.ts`:

```ts
// lib/parent-invite-validation.ts
type ParentRelation = "MOTHER" | "FATHER" | "GUARDIAN";
type InviteValues = { parentName: string; email: string; relation: ParentRelation | "" };
type InviteErrors = Partial<Record<"parentName" | "email" | "relation", string>>;

function generateInviteCode(): string;
function validateParentInvite(values: InviteValues): InviteErrors;
```

Convenciones:

- Sin cambios en `lib/parent-invite-validation.ts`: ni validación, ni formato de código, ni nombres.
- El código generado sigue viviendo solo en el estado del modal; no se persiste.
- Sin HTML inválido: ningún elemento interactivo dentro de otro interactivo.
- Ningún overlay `fixed` bajo un ancestro con transform o overflow que lo recorte.

## Implementation plan

1. Reproducir el bug en `npm run dev`: abrir `/kids`, clic en VINCULAR y registrar recorte del modal y comportamiento de URL/navegación como base del antes/después.
2. Reestructurar `app/components/kids/KidCard.tsx` (botón VINCULAR como hermano del Link, no hijo) y mover el render de `LinkParentModal.tsx` a un portal a `document.body` vía `LinkParentTrigger.tsx`. Manual test: el overlay cubre todo el viewport y el resto de la tarjeta navega a `/kids/[slug]` como antes.
3. Aplicar el mismo patrón al trigger del perfil (`LinkedParents.tsx`) en `/kids/[slug]`, comparando lado a lado con `references/pantallas/vincular-padre.dc.html` desde ambos orígenes.
4. Validar con Playwright (artefactos SOLO en `.playwright-mcp/`) sobre `npm run dev`: snapshot + screenshot desde lista y perfil vs mockup; submit vacío, email inválido y sin parentesco bloquean; envío válido cierra y queda en origen; recarga sin padre nuevo; cierres X/overlay/Escape; resize <768px sin scroll horizontal; 0 errores de consola.

## Acceptance criteria

- [x] Clic en VINCULAR en `/kids` abre el modal a fullscreen sin cambiar la URL ni navegar al perfil.
- [x] El modal cubre todo el viewport (no recortado a la tarjeta) e idéntico a `references/pantallas/vincular-padre.dc.html`.
- [x] Un solo clic abre el modal una sola vez y queda estable, sin parpadeo ni cierre o navegación espontánea.
- [x] Clic en el resto de la tarjeta navega a `/kids/[slug]`.
- [x] Clic en Vincular otro padre en `/kids/[slug]` abre el mismo modal fullscreen sin cambiar la URL.
- [x] Submit vacío muestra error en español bajo nombre, email y parentesco y no cierra.
- [x] Email con formato inválido o parentesco sin elegir bloquea con su error y no cierra.
- [x] Envío con nombre, email válido y parentesco cierra y deja en origen.
- [x] Recargar tras un envío válido no muestra ningún padre nuevo.
- [x] X, overlay y Escape cierran sin guardar ni errores persistentes.
- [x] En viewport menor a 768px el modal se usa sin scroll horizontal.
- [x] Sin elemento interactivo anidado dentro de otro interactivo.
- [x] Ningún overlay `fixed` bajo ancestro con transform que lo recorte.
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] `npm run build` pasa sin errores.

## Decisions

- **Sí:** alcance lista + perfil. Ambos usan el mismo modal y trigger; arreglar solo la lista dejaría el mismo defecto en el perfil.
- **Sí:** overlay fullscreen según `references/pantallas/vincular-padre.dc.html`. Es la referencia visual vigente de SPEC 05.
- **Sí:** reestructurar `KidCard` + portal a `body` como fix de raíz. Causa triple confirmada en código: modal anidado dentro del `<Link>`, botón interactivo dentro de anchor interactivo, y `fixed` bajo ancestro con `hover:-translate-y-0.5` que crea containing block y recorta el overlay.
- **No:** fix solo con CSS/z-index. No elimina el HTML inválido ni garantiza frenar la navegación del anchor.
- **No:** fix solo de navegación. No elimina el recorte por transform.
- **Sí:** VINCULAR nunca navega; el resto de la tarjeta sí. Es el comportamiento definido en SPEC 05.
- **Sí:** lógica intacta (validación, código, sin persistencia). El bug es estructural, no de reglas de negocio.
- **Sí:** matriz de verificación completa estilo SPEC 04/05. El pedido explícito fue "Realiza bien la Verificación del modal".
- **Sí:** criterio de apertura estable como definición operativa del fin del parpadeo.
- **Sí:** definición con preguntas en dos bloques. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Reestructurar `KidCard` rompe la navegación de la tarjeta al perfil | Link interno intacto + criterio "resto de la tarjeta navega" verificado con Playwright |
| Portal y SSR/hidratación en Next.js App Router | Render del portal solo en cliente tras mount; modal sigue siendo client con `useState` |
| Regresión visual respecto al mockup | Comparación lado a lado con `vincular-padre.dc.html` desde lista y perfil |
| Foco y accesibilidad del modal tras moverlo en el DOM | Mantener foco inicial, cierre por Escape y `aria-modal` de SPEC 05 |

## What is **not** in this spec

- Backend o envío real de email.
- Persistencia del invitado o paso a PENDIENTE.
- Cambios de textos, validación o formato del código.
- Ruta `/vincular-padre` independiente.
- Activación de cuenta con el código.
- Editar o eliminar padres.

Cada uno de esos, si llega, va en su propio spec.
