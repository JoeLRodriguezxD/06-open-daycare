# SPEC 04 — Modal de agregar niño desde agregar-nino.dc.html con validación obligatoria

> **Status:** Approved
> **Depends on:** SPEC 02
> **Date:** 2026-09-16
> **Objective:** Mostrar el formulario de agregar-nino.dc.html como modal overlay abierto desde Agregar niño y Editar, que solo cierra con Guardar válido exigiendo nombre, fecha de nacimiento y sala, sin backend.

## Scope

**In:**

- Componente client `app/components/kids/AddKidModal.tsx`: overlay sobre la página actual con la tarjeta exacta del mockup (max-width 520px, header Cancelar / Agregar niño / Guardar, campos NOMBRE COMPLETO, FECHA DE NACIMIENTO, SALA, ALERGIAS, NOTAS MÉDICAS).
- Apertura desde el botón Agregar niño del header de `/kids` mediante trigger client con `useState`, sin cambiar de URL.
- Apertura desde el botón Editar del perfil `/kids/[slug]` con el mismo modal y datos del niño precargados; Guardar válido cierra y queda en el perfil.
- Campo SALA como select con opciones Soles, Lunas, Estrellas; en Agregar arranca sin selección, en Editar precargado.
- Validación local al submit con errores en español bajo cada campo: nombre no vacío, fecha formato dd/mm/aaaa existente y no futura, sala elegida.
- Alergias como texto libre coma-separado y notas como textarea, ambas opcionales sin validación.
- Cierre sin guardar vía Cancelar, X, click en overlay y Escape, volviendo a la página de origen.
- Guardar válido solo cierra el modal y permanece en la página de origen, sin persistencia (al recargar no hay niño nuevo).
- Estilo luz idéntico con tokens existentes de `app/globals.css` (fondo `#FBF4EC`, bordes `#EADFD0`, acento `#D9583C`), Fredoka + Nunito vía `next/font`.
- Todo el código interno en inglés; solo los textos visibles quedan en español.

**Out of scope (for future specs):**

- Backend, base de datos, API o fetch real.
- Persistencia del niño creado entre recargas.
- Edición real que modifique datos del mock.
- Eliminar niño o vincular padres.
- Ruta `/agregar-nino` como página independiente.
- Selector de avatar o foto del niño.
- Resto de rutas futuras.

## Data model

Esta feature no usa DB. Solo tipos de formulario y helpers puros en `lib/kid-form-validation.ts`:

```ts
// lib/kid-form-validation.ts
type Classroom = "SOLES" | "LUNAS" | "ESTRELLAS";
type AddKidValues = { fullName: string; birthDate: string; classroom: Classroom | ""; allergies: string; medicalNotes: string };
type KidFormErrors = Partial<Record<"fullName" | "birthDate" | "classroom", string>>;

const CLASSROOM_LABELS: Record<Classroom, string> = { SOLES: "Soles", LUNAS: "Lunas", ESTRELLAS: "Estrellas" };

function validateKidForm(values: AddKidValues): KidFormErrors;
```

Convenciones:

- Código en inglés: `fullName`, `birthDate`, `classroom`, `validateKidForm`. Prohibidos identificadores en español.
- UI en español: labels del mockup y errores como Ingresá el nombre, Ingresá una fecha válida (dd/mm/aaaa), La fecha no puede ser futura, Elegí una sala.
- `birthDate` se edita como texto con placeholder `dd/mm/aaaa` exacto del mockup; el helper lo parsea y valida.
- Los colores y radios salen de tokens CSS en `app/globals.css`, no hardcodeados por componente.

## Implementation plan

1. Crear `lib/kid-form-validation.ts` con `Classroom`, `AddKidValues`, `CLASSROOM_LABELS` y `validateKidForm` puros. Manual test: importar desde script y verificar vacío, fecha `31/02/2024`, fecha futura y sala vacía devuelven sus errores.
2. Crear `app/components/kids/AddKidModal.tsx` client con `useState` para valores y errores, overlay + tarjeta 520px del mockup, validación al submit y cierre por Cancelar, X, overlay y Escape. Manual test: render aislado muestra la tarjeta exacta.
3. Crear triggers client con `useState` que abren el modal (Agregar vacío en `/kids`, Editar precargado en perfil), manteniendo `app/kids/page.tsx` y `app/kids/[slug]/page.tsx` como server. Manual test: `npm run dev` muestra `/kids` sin cambios hasta pulsar el botón.
4. Cablear el trigger de Agregar en `app/kids/page.tsx` sustituyendo el `href="/agregar-nino"` y el de Editar en `ProfileHeader.tsx`, comparando lado a lado con `references/pantallas/agregar-nino.dc.html` abierto en navegador.
5. Validar con Playwright (MCP `playwright`, artefactos SOLO en `.playwright-mcp/` gitignored) sobre `npm run dev`: snapshot + screenshot del modal desde ambos botones vs el mockup; submit vacío, fecha inválida, sala vacía, Guardar válido que cierra; cierres Cancelar/X/overlay/Escape; resize <768px sin scroll horizontal.

## Acceptance criteria

- [ ] Click en Agregar niño en `/kids` abre el modal con la tarjeta exacta del mockup sin cambiar de URL.
- [ ] Click en Editar en `/kids/[slug]` abre el mismo modal con nombre, fecha y sala del niño precargados.
- [ ] Submit con los tres campos vacíos muestra un error en español bajo cada uno y no cierra.
- [ ] Fecha con formato distinto de dd/mm/aaaa, inexistente o futura bloquea con su error y no cierra.
- [ ] Sala sin elegir bloquea con error; elegir Soles, Lunas o Estrellas lo supera.
- [ ] Guardar con nombre, fecha válida pasada y sala elegida cierra el modal y deja al usuario en su página de origen.
- [ ] Recargar tras un Guardar válido no muestra ningún niño nuevo en `/kids`.
- [ ] Alergias y notas vacías no bloquean el Guardar.
- [ ] Cancelar, X, click en overlay y Escape cierran sin guardar ni mostrar errores persistentes.
- [ ] En viewport menor a 768px el modal se usa sin scroll horizontal.
- [ ] El código usa solo identificadores en inglés; no hay tipos ni variables en español.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` pasa sin errores.

## Decisions

- **Sí:** modal overlay aunque el mockup dibuja una tarjeta centrada. La tarjeta se reutiliza tal cual dentro del overlay.
- **No:** ruta `/agregar-nino` como página. Se descarta porque pediste modal y los links actuales se reconvierten en triggers.
- **Sí:** ambos botones (Agregar y Editar) abren el mismo modal. Lo pediste explícito.
- **Sí:** Editar precarga los datos del niño. Sin precarga, Editar sería indistinguible de Agregar.
- **Sí:** SALA como select Soles/Lunas/Estrellas con vacío inicial en Agregar. El mockup la muestra fija, pero fija haría imposible que "obligatorio" falle.
- **No:** SALA fija en Soles. Se descarta por lo anterior.
- **Sí:** fecha estricta (formato, existencia, no futura). Solo "no vacía" dejaría pasar `99/99/9999`.
- **Sí:** Guardar válido solo cierra, sin persistencia. Mismo patrón mock sin backend de SPEC 01–03.
- **No:** agregar el niño a la lista en memoria. Finge un backend que no existe y complica el estado.
- **Sí:** triggers client con `useState` manteniendo las pages como server. Evita convertir `/kids` y el perfil a client.
- **Sí:** validación al submit con errores bajo campo, como SPEC 03. Consistencia de UX en formularios.
- **Sí:** definición con preguntas en dos bloques. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| `ProfileHeader` es server y necesita estado para Editar | El trigger client vive en `app/components/kids/` y recibe `kid` por props; el header sigue server |
| El select de SALA diverge del mockup fijo | Solo cambia el control; tarjeta, labels y placeholders quedan idénticos |
| Overlay sin foco accesible | Foco inicial en nombre y cierre por Escape desde el primer paso del plan |

## What is **not** in this spec

- Backend o base de datos.
- Persistencia del niño creado.
- Edición real de datos.
- Eliminar niño.
- Vinculación de padres.
- Ruta `/agregar-nino` independiente.
- Foto o avatar del niño.

Cada uno de esos, si llega, va en su propio spec.
