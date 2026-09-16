# SPEC 05 — Modal de vincular padre desde vincular-padre.dc.html con invitación local

> **Status:** Approved
> **Depends on:** SPEC 02, SPEC 04
> **Date:** 2026-09-16
> **Objective:** Mostrar el formulario de vincular-padre.dc.html como modal overlay desde el perfil y la lista de niños, que solo envía con nombre, email válido y parentesco elegidos, genera un código local y cierra sin persistencia.

## Scope

**In:**

- Componente client `app/components/kids/LinkParentModal.tsx`: overlay con tarjeta exacta del mockup (max-width 480px, header Vincular padre / a {nombre} + X, caja azul informativa, campos NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO, caja CÓDIGO DE INVITACIÓN, botón Enviar invitación).
- Apertura desde `Vincular otro padre` en `/kids/[slug]` sin cambiar URL, con título dinámico del kid real.
- Apertura desde el badge VINCULAR de `KidCard` en `/kids` sin navegar, con título dinámico de ese kid; resto de la tarjeta sigue navegando al perfil.
- PARENTESCO como 3 pills (Mamá/Papá/Tutor-a) sin selección inicial, obligatorio.
- Código de 5 caracteres alfanuméricos en mayúsculas estilo 7K4P9, generado local en cada apertura; texto `Vence en 7 días` fijo.
- Validación local al submit con errores en español bajo cada campo: nombre no vacío, email formato válido, parentesco elegido.
- Envío válido solo cierra el modal y queda en origen, sin persistencia ni backend.
- Cierres sin guardar vía X, click en overlay y Escape, sin errores persistentes.
- Estilo luz idéntico con tokens en `app/globals.css`, Fredoka + Nunito vía `next/font`.
- Código interno en inglés; solo textos visibles en español.

**Out of scope (for future specs):**

- Backend, base de datos, API, envío real de email.
- Persistencia del padre invitado o paso a PENDIENTE real.
- Ruta `/vincular-padre` como página independiente.
- Activación de cuenta con ese código.
- Editar/eliminar padres vinculados.
- Resto de rutas futuras.

## Data model

Esta feature no usa DB. Solo tipos y helpers puros en `lib/parent-invite-validation.ts`:

```ts
// lib/parent-invite-validation.ts
type ParentRelation = "MOTHER" | "FATHER" | "GUARDIAN";
type InviteValues = { parentName: string; email: string; relation: ParentRelation | "" };
type InviteErrors = Partial<Record<"parentName" | "email" | "relation", string>>;

function generateInviteCode(): string;
function validateParentInvite(values: InviteValues): InviteErrors;
```

Convenciones:

- Código en inglés: `parentName`, `relation`, `validateParentInvite`. Prohibidos identificadores en español.
- UI en español: labels del mockup y errores como Ingresá el nombre, Ingresá un email válido, Elegí un parentesco.
- El código generado vive solo en estado del modal; no se guarda.
- Colores y radios desde tokens CSS en `app/globals.css`.

## Implementation plan

1. Crear `lib/parent-invite-validation.ts` con `ParentRelation`, `generateInviteCode` y `validateParentInvite` puros. Manual test: vacío, email inválido, sin relation devuelven sus errores; código respeta 5 chars mayúsculas.
2. Crear `app/components/kids/LinkParentModal.tsx` client con `useState`, overlay + tarjeta 480px del mockup, pills, caja de código, validación al submit y cierres X/overlay/Escape. Manual test: render aislado idéntico al mockup.
3. Crear trigger client reutilizable que recibe `kid` y abre el modal con `a {kid.fullName}` y código nuevo, manteniendo pages como server. Manual test: `/kids` sin cambios hasta pulsar.
4. Cablear en `LinkedParents.tsx` sustituyendo `href="/vincular-padre"` y en `KidCard.tsx` haciendo el badge VINCULAR botón con `stopPropagation` sin romper la navegación de la tarjeta. Comparar lado a lado con `references/pantallas/vincular-padre.dc.html`.
5. Validar con Playwright (artefactos SOLO en `.playwright-mcp/`) sobre `npm run dev`: snapshot + screenshot desde perfil y desde lista vs mockup; submit vacío/inválido/sin parentesco bloquean; envío válido cierra y queda en origen; recarga sin padre nuevo; cierres X/overlay/Escape; resize <768px sin scroll horizontal.

## Acceptance criteria

- [ ] Click en Vincular otro padre en `/kids/[slug]` abre el modal con `a {nombre}` sin cambiar URL.
- [ ] Click en el badge VINCULAR en `/kids` abre el modal de ese niño sin navegar; click en el resto de la tarjeta navega al perfil.
- [ ] Submit vacío muestra error en español bajo nombre, email y parentesco y no cierra.
- [ ] Email con formato inválido o parentesco sin elegir bloquea con su error y no cierra.
- [ ] Cada apertura genera un código distinto de 5 chars mayúsculas con `Vence en 7 días` fijo.
- [ ] Envío con nombre, email válido y parentesco cierra y deja en origen.
- [ ] Recargar tras un envío válido no muestra ningún padre nuevo.
- [ ] X, overlay y Escape cierran sin guardar ni errores persistentes.
- [ ] En viewport menor a 768px el modal se usa sin scroll horizontal.
- [ ] Código solo con identificadores en inglés.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` pasa sin errores.

## Decisions

- **Sí:** modal overlay como SPEC 04 aunque el mockup dibuja tarjeta centrada.
- **No:** ruta `/vincular-padre` como página. Pediste modal.
- **Sí:** doble trigger perfil + lista. Lo pediste explícito.
- **Sí:** badge VINCULAR como botón con stopPropagation. La tarjeta entera es un Link y sin esto es imposible abrir directo desde la lista.
- **Sí:** parentesco sin selección inicial y obligatorio. Lo pediste; Mamá fija impediría que falle.
- **No:** Mamá preseleccionada del mockup. Se descarta por lo anterior.
- **Sí:** código generado local 5 chars. Lo pediste; fijo impediría distinguir invitaciones.
- **No:** código fijo 7K4P9 para todos. Solo queda como ejemplo de formato.
- **Sí:** envío solo cierra sin persistencia. Patrón mock SPEC 01–04.
- **No:** agregar padre PENDIENTE en memoria. Finge backend inexistente.
- **Sí:** validación triple al submit con errores bajo campo. Consistencia SPEC 03–04.
- **Sí:** definición con preguntas en dos bloques. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Botón dentro de `KidCard` que ya es `Link` rompe HTML/navegación | Badge como `button` con `stopPropagation` + `preventDefault`; resto de la tarjeta intacto |
| `LinkedParents` es server y necesita estado | Trigger client recibe `kid` por props; tarjeta sigue server |
| Código aleatorio flaky en tests | Validar solo formato `[A-Z0-9]{5}`, no valor exacto |

## What is **not** in this spec

- Backend o envío real de email.
- Persistencia del invitado.
- Ruta `/vincular-padre` independiente.
- Activación de cuenta con el código.
- Editar o eliminar padres.
- Foto o avatar del padre.

Cada uno de esos, si llega, va en su propio spec.
