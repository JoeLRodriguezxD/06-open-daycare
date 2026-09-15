# SPEC 03 — Login en /login y activación en /activate-account desde plantillas

> **Status:** Aprobado
> **Depends on:** SPEC 01
> **Date:** 2026-09-15
> **Objective:** Implementar /login y /activate-account idénticos a login.dc.html y activar-cuenta.dc.html, sin selector Personal/Familia, con validación local en español y sin backend.

## Scope

**In:**

- Ruta `/login` con layout del mockup: panel izquierdo coral con logo OpenDayCare, título El día de cada niño compartido con su familia, subtítulo Publicá momentos y footer Guardería Sala Soles + columna derecha con formulario max-width 392px.
- Formulario `/login` sin bloque INGRESO COMO: solo labels EMAIL y CONTRASEÑA, inputs vacíos, placeholder •••••••• en password, link ¿Olvidaste tu contraseña?, botón Iniciar sesión con gradiente #F4977E→#EE8164 que navega a `/` solo si es válido, footer ¿Te invitó la guardería? Activá tu cuenta → `/activate-account`.
- Ruta `/activate-account` centrada max-width 440px: icono sol, título Bienvenida a OpenDayCare, subtítulo de invitación, tarjeta Te invitaron a seguir a Mateo · Sala Soles con avatar M, campos CÓDIGO DE INVITACIÓN con 7K4P9, EMAIL con lucia.fernandez@gmail.com, CREAR CONTRASEÑA, checkbox de fotos marcado por defecto y editable, botón Activar mi cuenta → `/` solo si es válido, footer ¿Ya tenés cuenta? Iniciar sesión → `/login`.
- Validación local en cliente con mensajes en español bajo cada campo: email con formato válido, contraseña mínimo 6 caracteres, código no vacío en activate, consentimiento de fotos obligatorio para activar.
- Estilo luz idéntico: fondo #FBF4EC, superficies #fff, bordes #EADFD0, texto #3F362E / secundario #94887B / muted #B6A99B, acentos #F2937A / #EE8164 / #D9583C / #C5503A, gradiente panel #F6A98E→#F2937A→#EC7E62, caja consentimiento #FBF1D6/#8A7234 con check #5FB97E, Fredoka en títulos + Nunito en cuerpo.
- Fuentes vía next/font/google con variables ya existentes + nuevos tokens de error e input en app/globals.css, sin `<link>` manual.
- Estructura app/components/auth/ con un componente por archivo en PascalCase con export nombrado: BrandPanel, LoginForm, ActivateForm.
- Helpers puros en lib/auth-validation.ts sin dependencias de React.
- Todo el código interno en inglés; solo los textos visibles quedan en español.
- Responsive móvil: debajo de 768px se oculta el panel coral y queda solo el formulario centrado con padding 40px; activate ya es centrado y solo ajusta padding.
- Link ¿Olvidaste tu contraseña? conservado como href futuro sin crear ruta en este spec.

**Out of scope (for future specs):**

- Autenticación real, sesión, cookies, roles y cerrar sesión funcional.
- Base de datos, API o fetch real.
- Recuperar contraseña funcional.
- Opción Personal/Familia en login.
- Persistencia de sesión o de formularios entre recargas.
- Resto de rutas: /avisos, /mi-cuenta, /crear-publicacion y demás href futuros.
- Toggle light/dark funcional.
- Modo oscuro activo o nuevo lenguaje visual.

## Data model

Esta feature no usa DB. Solo tipos de formulario y helpers puros en `lib/auth-validation.ts` más una constante de invitación exacta del mockup:

```ts
// lib/auth-validation.ts
type LoginValues = { email: string; password: string };
type ActivationValues = { inviteCode: string; email: string; password: string; photoConsent: boolean };
type FormErrors = Partial<Record<"email" | "password" | "inviteCode" | "photoConsent", string>>;

function isValidEmail(email: string): boolean;
function validateLogin(values: LoginValues): FormErrors;
function validateActivation(values: ActivationValues): FormErrors;

// app/activate-account/page.tsx
const invitePreview = { childName: "Mateo", classroom: "Sala Soles", initial: "M" };
```

Convenciones:

- Código en inglés: tipos, variables, funciones, props y archivos usan `inviteCode`, `photoConsent`, `isValidEmail`. Prohibidos identificadores en español.
- UI en español: labels EMAIL, CONTRASEÑA, CÓDIGO DE INVITACIÓN, errores como Ingresá un email válido, La contraseña debe tener al menos 6 caracteres, Ingresá el código de invitación, Tenés que autorizar el uso de fotos para continuar.
- Los valores 7K4P9, lucia.fernandez@gmail.com y Mateo · Sala Soles salen de los mockups y viven como valores iniciales, no como datos de backend.
- Los colores y radios salen de tokens CSS en `app/globals.css`, no hardcodeados por componente.

## Implementation plan

1. Crear `lib/auth-validation.ts` con `isValidEmail`, `validateLogin` y `validateActivation` puros. Manual test: importar desde script y verificar email inválido, pass <6 y consent false devuelven errores.
2. Agregar tokens de auth en `app/globals.css`: borde input, color error, fondo consentimiento. Manual test: `npm run dev` muestra home y kids sin cambios visuales.
3. Crear `app/components/auth/BrandPanel.tsx` server con el panel coral del mockup de login. Manual test: render aislado en desktop muestra título y footer exactos.
4. Crear `app/components/auth/LoginForm.tsx` client con `useState` para valores y errores, validación al submit y navegación a `/` con router solo si es válido. Manual test: submit vacío muestra dos errores, email válido + pass 6 navega a `/`.
5. Componer `app/login/page.tsx` con BrandPanel + columna de formulario sin selector de rol, comparando lado a lado con `references/pantallas/login.dc.html` abierto en navegador.
6. Crear `app/components/auth/ActivateForm.tsx` client con `useState` con valores iniciales del mockup, checkbox editable y validación completa. Manual test: desmarcar consentimiento bloquea con error, completar válido navega a `/`.
7. Componer `app/activate-account/page.tsx` centrado con icono, tarjeta de invitación y ActivateForm, comparando lado a lado con `references/pantallas/activar-cuenta.dc.html` abierto en navegador.
8. Validar cambios con Playwright (MCP `playwright`, artefactos SOLO en `.playwright-mcp/` gitignored) sobre `npm run dev`: snapshot + screenshot de `/login` y `/activate-account` vs `references/pantallas/login.dc.html` y `activar-cuenta.dc.html`; clicks de submit vacío, email inválido, login válido → `/`, consent desmarcado, activación válida → `/` y cross-links; resize a <768px para verificar que el panel coral se oculta sin scroll horizontal.

## Acceptance criteria

- [ ] `npm run dev` muestra `/login` con panel coral y formulario como el mockup, sin ningún botón Personal o Familia ni label INGRESO COMO.
- [ ] `/login` arranca con email y contraseña vacíos; submit vacío muestra errores en español bajo cada campo y no navega.
- [ ] `/login` con email válido y pass ≥6 navega a `/`; con email inválido o pass <6 muestra el error correspondiente y no navega.
- [ ] `npm run dev` muestra `/activate-account` centrado con tarjeta Mateo · Sala Soles, código 7K4P9, email lucia.fernandez@gmail.com y checkbox marcado como el mockup.
- [ ] Desmarcar el consentimiento bloquea Activar mi cuenta con error en español; con código vacío, email inválido o pass <6 también bloquea con su error.
- [ ] Activación válida navega a `/`; link Iniciar sesión navega a `/login` y link Activá tu cuenta en login navega a `/activate-account`.
- [ ] En viewport menor a 768px el panel coral de `/login` está oculto y el formulario queda centrado sin scroll horizontal.
- [ ] El código usa solo identificadores en inglés; no hay tipos ni variables en español.
- [ ] Existe `app/components/auth/` con componentes en PascalCase y `lib/auth-validation.ts` con helpers puros.
- [ ] Tipografías Fredoka y Nunito vía next/font, sin `<link>` Google Fonts manual.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` pasa sin errores.

## Decisions

- **Sí:** rutas `/login` y `/activate-account` en inglés. Consistente con `/kids` y reglas de código en inglés.
- **No:** `/activar-cuenta` en español. Se descarta aunque coincida con el nombre del mockup.
- **Sí:** eliminar por completo el selector Personal/Familia y su estado `role`. Lo pediste explícito; no queda ni visual ni lógica residual.
- **No:** mantener email pre-rellenado `caro@opendaycare.com` en login. Se descarta por irreal; arranca vacío.
- **Sí:** solo UI + validación local sin backend. Mismo patrón que SPEC 01/02, verificable sin sesión.
- **No:** sesión mock en localStorage. Sobrecarga sin backend y abre falsa sensación de auth.
- **Sí:** email formato + pass ≥6 con errores bajo campo. Balance mínimo útil en español.
- **No:** solo required o solo botón deshabilitado. Menos claro que el mensaje explícito.
- **Sí:** prefill de activate como el mockup con checkbox editable y obligatorio. Fidelidad visual + consentimiento explícito.
- **No:** checkbox opcional o campos vacíos en activate. Rompe el mockup y el sentido de invitación.
- **Sí:** navegación a `/` con router solo si válido. Da flujo completo sin backend.
- **No:** href siempre activo sin validar. Permitiría entrar con datos inválidos.
- **Sí:** `¿Olvidaste tu contraseña?` como href futuro sin ruta. Mismo criterio que SPEC 01/02.
- **No:** crear recuperar-password en este spec. Va en su propio spec.
- **Sí:** carpeta `app/components/auth/` + `lib/auth-validation.ts`. Respeta convención shared + dominio y helpers testeables.
- **Sí:** validación final con Playwright en el plan. Exigencia permanente para evidencia visual y de comportamiento vs mockups.
- **Sí:** definición con preguntas en dos bloques. No hubo atajo.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Validación local sin backend da falsa sensación de seguridad | Documentado como mock visual; el backend la reemplaza sin cambiar componentes |
| Prefill 7K4P9 y email de Lucía se confunden con datos reales | Son valores iniciales del mockup; el backend los reemplaza por invitación real |
| Cambio de `/activar-cuenta` a `/activate-account` deja links viejos | Buscar `activar-cuenta` en el repo y actualizar en este spec |
| Panel coral diverge en móvil | Se oculta debajo de 768px, misma regla que el sidebar |

## What is **not** in this spec

- Autenticación real.
- Sesión y roles.
- Base de datos.
- Recuperar contraseña funcional.
- Opción Personal/Familia.
- Persistencia de sesión o formularios.
- Toggle light/dark.
- Modo oscuro activo.

Cada uno de esos, si llega, va en su propio spec.
