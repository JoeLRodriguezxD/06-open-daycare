# SPEC 02 — Niños en /kids y perfil en /kids/[slug] desde plantillas

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-09-14
> **Objective:** Implementar /kids y /kids/[slug] idénticos a ninos.dc.html y perfil-nino.dc.html, con mock tipado, búsqueda funcional y navegación por slug.

## Scope

**In:**

- Página `/kids` con layout del mockup: sidebar 248px sticky a altura completa + columna max-width 880px con padding 34px 40px 80px.
- Header de gestión: eyebrow GESTIÓN, título Niños, botón Agregar niño como href futuro sin crear la ruta.
- Buscador "Buscar niño…" funcional en cliente: filtra por nombre, muestra estado vacío en español si no hay match.
- Sección SALA SOLES + contador 8 niños + grid 2 columnas (1 columna en móvil) con las 8 tarjetas exactas del mockup: avatar inicial con color por niño, nombre, edad y contador de padres, badge o chevron según regla.
- Regla de insignia por niño: si tiene `allergyTag` muestra MANÍ o LACTOSA; si no tiene y tiene 0 padres muestra VINCULAR; si no muestra chevron.
- Click en cada tarjeta navega a `/kids/[slug]` con slug kebab del nombre (ej. `mateo-fernandez`).
- Página `/kids/[slug]` con layout del mockup: link Volver a Niños, ProfileHeader con avatar grande, nombre, edad y sala, botón Editar como href futuro.
- Caja Alergias y notas solo cuando el niño tiene `allergyNotes`; bloque de datos con fecha de nacimiento, sala e ingreso.
- Columna lateral del perfil: botón Resumen del día como href futuro, tarjeta PADRES VINCULADOS con badge ACTIVA o PENDIENTE, link Vincular otro padre como href futuro.
- Datos mock tipados en `lib/kids-mock.ts`: `Kid`, `LinkedParent`, los 8 niños exactos del mockup, Mateo con Lucía Fernández activa y Diego Fernández pendiente exactos, resto de padres inventados coherentes con su contador.
- `generateStaticParams` con los 8 slugs; slug inexistente muestra not-found vía `notFound()`.
- Estructura `app/components/kids/` con un componente por archivo en PascalCase con export nombrado: `KidCard`, `KidsGrid`, `KidSearch`, `ProfileHeader`, `AllergyNotes`, `KidFacts`, `LinkedParents`.
- Reutilización sin duplicar: `shared/Avatar` para avatares, `home/Sidebar` y `home/MobileNav` para la navegación.
- Modificación de `home/Sidebar.tsx`: prop `activeItem: "feed" | "kids"` para marcar Niños activo en estas rutas, cambio de href `/ninos` a `/kids`.
- Extensión de `shared/Avatar.tsx`: props opcionales `background` y `foreground` para los 8 colores pastel por niño vía campos `avatarBg` y `avatarFg` del mock con tokens en `app/globals.css`.
- Estilo luz idéntico: tokens existentes más nuevos tokens pastel de avatar, Fredoka en títulos y Nunito en cuerpo, radios y sombras del mockup.
- Todo el código interno en inglés; solo los textos visibles quedan en español.
- Responsive móvil: sidebar oculto debajo de 768px, drawer con el mismo Sidebar con cierre por X, overlay y Escape, grid de niños a 1 columna.

**Out of scope (for future specs):**

- Agregar niño, Editar, Resumen del día y Vincular padre funcionales.
- Autenticación, roles, sesión y cerrar sesión funcional.
- Base de datos, API o fetch real.
- Resto de rutas: /avisos, /mi-cuenta, /crear-publicacion y demás href futuros.
- Persistencia de la búsqueda entre recargas.
- Toggle light/dark funcional.
- Modo oscuro activo o nuevo lenguaje visual.

## Data model

Esta feature no usa DB. Solo un mock tipado en `lib/kids-mock.ts`. Todo el código interno está en inglés; los textos visibles siguen en español en los campos del mock:

```ts
// lib/kids-mock.ts
type ParentStatus = "ACTIVE" | "PENDING";

type LinkedParent = {
  id: string;
  name: string;
  relation: string;
  status: ParentStatus;
  initial: string;
  avatarBg: string;
  avatarFg: string;
};

type Kid = {
  id: string;
  slug: string;
  fullName: string;
  shortName: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  ageYears: number;
  ageLabel: string;
  classroom: string;
  birthDate: string;
  enrolledAt: string;
  allergyTag?: string;
  allergyNotes?: string;
  linkedParentsCount: number;
  linkedParents: LinkedParent[];
};

const kids: Kid[] = [
  { id: "mateo-fernandez", slug: "mateo-fernandez", fullName: "Mateo Fernández" },
];

function getKidBySlug(slug: string): Kid | undefined {
  return kids.find((kid) => kid.slug === slug);
}
```

Convenciones:

- Código en inglés: tipos, variables, funciones, props, nombres de archivo y slugs usan identificadores como `mateo-fernandez` y `allergyTag`. Prohibidos identificadores en español.
- UI en español: nombres, edades, contadores de padres, badges MANÍ, LACTOSA y VINCULAR, estados ACTIVA y PENDIENTE conservan los textos exactos de los mockups.
- Los 8 niños, sus edades, sus contadores de padres y los datos de Mateo salen de los mockups y viven en `kids`.
- Los colores de avatar salen de `avatarBg` y `avatarFg` con tokens CSS en `app/globals.css`, no hardcodeados por componente.

## Implementation plan

1. Crear `lib/kids-mock.ts` con `ParentStatus`, `LinkedParent`, `Kid`, los 8 niños exactos de los mockups y `getKidBySlug`. Manual test: importar desde un script y verificar 8 slugs únicos.
2. Extender `app/components/shared/Avatar.tsx` con props opcionales `background` y `foreground`, agregar tokens pastel de avatar en `app/globals.css`. Manual test: `npm run dev` muestra el home sin cambios visuales.
3. Modificar `app/components/home/Sidebar.tsx` con prop `activeItem` con default `feed`, cambiar href de Niños a `/kids`. Pasar la prop desde `MobileNav`. Manual test: home sigue con Feed activo.
4. Crear `app/components/kids/KidCard.tsx` server y `app/components/kids/KidsGrid.tsx` server con la regla de badges. Manual test: render aislado con 3 niños de ejemplo.
5. Crear `app/components/kids/KidSearch.tsx` client con `useState` para filtrar por nombre con estado vacío en español. Manual test: escribir "sof" deja solo a Sofía.
6. Componer `app/kids/page.tsx` con Sidebar + columna 880px + header + buscador + grid, comparando lado a lado con `references/pantallas/ninos.dc.html` abierto en navegador.
7. Crear `app/components/kids/ProfileHeader.tsx`, `AllergyNotes.tsx`, `KidFacts.tsx` y `LinkedParents.tsx` como server components con el JSX del mockup de perfil.
8. Componer `app/kids/[slug]/page.tsx` con `generateStaticParams` para los 8 slugs y `notFound()` si no existe. Manual test: `/kids/mateo-fernandez` muestra el perfil exacto, `/kids/inexistente` muestra not-found.

## Acceptance criteria

- [x] `npm run dev` muestra `/kids` con fondo #F6ECDF, sidebar 248px y columna 880px como el mockup.
- [x] Se ven header GESTIÓN y Niños, buscador, sección SALA SOLES con 8 niños y exactamente las 8 tarjetas con nombres, edades, contadores y badges del mockup.
- [x] Escribir en el buscador filtra por nombre sin recargar; sin match muestra estado vacío en español.
- [x] Click en cada tarjeta navega a su `/kids/[slug]` correspondiente.
- [x] `/kids/mateo-fernandez` muestra nombre, edad, sala, alergia al maní, fecha 12 mar 2022, Soles, feb 2025, Lucía ACTIVA y Diego PENDIENTE exactos del mockup.
- [x] La caja de alergias solo aparece cuando el niño tiene notas; un niño sin notas no la muestra.
- [x] Un slug inexistente muestra not-found.
- [x] El sidebar marca Niños activo en `/kids` y en el perfil; el home sigue con Feed activo.
- [x] En viewport menor a 768px el sidebar está oculto, la hamburguesa abre y cierra el drawer y el grid queda a 1 columna.
- [x] El código usa solo identificadores en inglés; no hay tipos ni variables en español.
- [x] Existe `app/components/kids/` con propios en PascalCase reutilizando `shared/` y `home/` sin duplicar Sidebar ni Avatar.
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] `npm run build` pasa sin errores.

## Decisions

- **Sí:** mock en `lib/kids-mock.ts`. Mismo patrón que SPEC 01, reutilizable sin backend.
- **Sí:** código interno 100% en inglés con UI en español en los campos del mock. Cumple reglas de código limpio sin cambiar lo visual.
- **Sí:** buscador funcional con `useState`. Único estado nuevo, sin persistencia.
- **No:** buscador solo visual. Se descarta porque el filtrado local es barato y verificable.
- **Sí:** slug kebab del nombre con `generateStaticParams` y `notFound()`. URLs legibles y 404 explícito.
- **Sí:** botones Agregar niño, Editar, Resumen del día y Vincular otro padre como href futuros sin crear rutas. Mismo criterio que SPEC 01.
- **No:** implementar crear, editar, resumen o vinculación ahora. Cada uno va en su propio spec.
- **Sí:** una sola carpeta `app/components/kids/` para lista y perfil. Evita dispersión para dos rutas del mismo dominio.
- **Sí:** reutilizar `shared/Avatar` y `home/Sidebar` con `MobileNav`. Evita duplicar navegación y avatares.
- **Sí:** prop `activeItem` en Sidebar con default `feed`. El home no cambia y kids marca Niños activo.
- **Sí:** cambiar href de `/ninos` a `/kids`. La ruta válida de este spec es `/kids`.
- **No:** duplicar sidebar propio en kids. Duplicaría mantenimiento.
- **Sí:** extender Avatar con `background` y `foreground` por niño vía mock y tokens. Replica los 8 colores pastel sin hardcodear.
- **No:** tono child único para todos. Se descarta porque rompe la fidelidad con el mockup.
- **Sí:** padres inventados por niño coherentes con su contador, con Mateo exacto. Da perfiles completos sin inventar un backend.
- **Sí:** definición con aclaración detallada en tres bloques. Se preguntó todo antes de redactar; no hubo atajo.
- **No:** atajo sin preguntas. Se descarta por el costo de un mal spec en código.

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Prop `activeItem` rompe el home | Default `feed`; el home no pasa prop y queda idéntico |
| Colores de avatar hardcodeados en componentes | Viven en el mock como `avatarBg` y `avatarFg` con tokens en `globals.css` |
| Cambio de `/ninos` a `/kids` deja links viejos | Buscar `/ninos` en el repo y actualizar en este spec |
| Padres inventados divergen del futuro backend | Solo mock tipado; el backend los reemplaza sin cambiar componentes |
| Links de href futuros dan 404 al clickear | Aceptado en alcance; documentado como fuera de alcance |

## What is **not** in this spec

- Agregar niño funcional.
- Editar niño funcional.
- Resumen del día funcional.
- Vinculación de padres funcional.
- Autenticación.
- Base de datos.
- Persistencia de la búsqueda.
- Toggle light/dark.
- Modo oscuro activo.

Cada uno de esos, si llega, va en su propio spec.
