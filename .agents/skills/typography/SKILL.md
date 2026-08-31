---
name: typography
description: Audita y mejora la tipografía en interfaces web al implementar, revisar o corregir estilos de texto, jerarquía tipográfica, tamaños, line-height, wrapping, tipografía responsive, carga de fuentes, legibilidad o accesibilidad tipográfica. Úsala cuando una tarea implique decisiones o problemas específicos de tipografía. No la actives para trabajos generales de layout, color o diseño visual cuando la tipografía no sea parte directa del problema.
---

---

# Typography

Usa esta skill para **identificar y solucionar problemas tipográficos con el cambio mínimo necesario**.

No rediseñes un sistema tipográfico existente salvo que la tarea lo requiera explícitamente.

Si no existe un problema tipográfico claro, conserva la implementación actual.

## 1. Jerarquía

Usa estas propiedades para establecer jerarquía:

- `font-size`
- `font-weight`
- `line-height`
- `letter-spacing`
- espaciado entre elementos de texto

Mantén el sistema simple y evita fuentes, tamaños y pesos innecesarios.

Como regla general, rara vez se necesitan más de tres familias tipográficas en una interfaz. Combina fuentes buscando un contraste intencional, no diferencias mínimas.

Para textos menores de `18px`, prefiere pesos de `400` o superiores. Considera los pesos inferiores a `300` como orientados a display y, en general, úsalos a partir de `28px`.

Una escala tipográfica puede ayudar a mantener relaciones consistentes entre tamaños. Úsala cuando el proyecto se beneficie de ella, pero no reconstruyas una escala existente sin una razón clara.

El color también puede contribuir a la jerarquía, pero esta skill no debe rediseñar el sistema de color del proyecto. Cuando el texto secundario esté intencionalmente atenuado, mantén al menos un **ratio de contraste de 4.5:1** contra el fondo para texto de tamaño normal.

## 2. Tamaño y unidades

Define `font-size` según el rol del texto, la fuente, la jerarquía y la legibilidad.

Prefiere `rem` para tipografía escalable porque respeta la preferencia de tamaño de fuente definida por el usuario en el navegador.

Usa `px` cuando el componente o el comportamiento del navegador requiera específicamente un tamaño fijo.

No reemplaces valores existentes de `px` por `rem` automáticamente. Hazlo cuando accesibilidad, escalabilidad o consistencia aporten un beneficio claro.

En inputs de texto móviles, `16px` puede ayudar a evitar el zoom automático no deseado en algunos navegadores. Aplícalo específicamente donde sea necesario, no globalmente.

## 3. Tamaño fluido

Usa `clamp()` cuando un tamaño de texto deba escalar fluidamente entre un mínimo y un máximo.

```css
font-size: clamp(2rem, 1.2rem + 2vw, 4rem);
```

Define siempre un mínimo y un máximo explícitos.

No introduzcas `clamp()` cuando un valor fijo ya funciona correctamente.

## 4. Line height

Ajusta `line-height` cuando el texto esté demasiado comprimido o demasiado separado.

Prefiere valores unitless para texto escalable:

```css
line-height: 1.5;
```

Los headings grandes pueden necesitar valores más ajustados.

Para controles compactos como **icon buttons**, badges o labels con un área controlada, `line-height: 1` puede facilitar el alineamiento vertical.

No uses necesariamente el mismo `line-height` para todos los roles de texto.

## 5. Letter spacing

Usa `letter-spacing` según el tamaño y el rol del texto:

- Headings grandes: un tracking ligeramente negativo puede mejorar su apariencia.
- Labels pequeños en mayúsculas: un tracking ligeramente positivo puede mejorar la legibilidad.
- Body text: normalmente necesita poco o ningún ajuste.

No uses tracking negativo simplemente para conseguir que un texto entre en una línea.

## 6. Text wrapping

### Headings

Prefiere:

```css
text-wrap: balance;
```

para headings cuando la distribución de las líneas sea desigual.

Evita añadir `<br>` manualmente cuando el único objetivo sea controlar el wrapping natural.

### Body text

Considera:

```css
text-wrap: pretty;
```

para párrafos y textos largos cuando mejore la distribución de las líneas.

No apliques estas propiedades indiscriminadamente.

## 7. Medida del texto

En textos largos, considera:

```css
max-width: 70ch;
```

cuando las líneas sean demasiado largas y dificulten la lectura.

No limites innecesariamente textos cortos de UI, botones, labels o navegación.

## 8. Overflow

Cuando un texto desborde:

1. Comprueba el wrapping.
2. Comprueba el ancho del contenedor.
3. No reduzcas `font-size` como primera solución.
4. Para strings largos sin espacios, prefiere:

```css
overflow-wrap: break-word;
```

5. Usa `overflow-wrap: anywhere` solo cuando `break-word` no sea suficiente.

Conserva el wrapping normal para texto convencional.

## 9. Texto numérico

Usa:

```css
font-variant-numeric: tabular-nums;
```

cuando los números que cambian deban mantenerse alineados.

Es especialmente útil para:

- precios
- estadísticas
- dashboards
- tablas
- timers
- contadores

No uses figuras tabulares en texto normal cuando la alineación no sea importante.

## 10. Fuentes web

Prefiere `.woff2` para fuentes web por su compresión Brotli y amplio soporte.

`.woff` puede utilizarse cuando sea necesario mantener compatibilidad con navegadores muy antiguos.

`.ttf` y `.otf` son principalmente formatos de escritorio y, en general, son menos apropiados como formato principal para la web.

La estrategia de carga de fuentes es responsabilidad del proyecto, salvo que la carga de fuentes sea específicamente el problema.

Cuando modifiques la carga de fuentes, evita bloquear innecesariamente el renderizado del texto. Usa una estrategia `font-display` apropiada, normalmente `font-display: swap`, cuando encaje con los requisitos de carga del proyecto.

No cambies la estrategia de carga únicamente por cambiarla.

## 11. Idioma

Define correctamente el idioma del documento:

```html
<html lang="es"></html>
```

Usa el valor correspondiente al idioma real del contenido.

## 12. Validación

Después de modificar la tipografía, verifica el componente afectado con:

- contenido corto
- contenido largo
- contenido realista
- diferentes situaciones de wrapping
- los estados responsive existentes

Comprueba que el cambio no introduzca:

- overflow
- wrapping inesperado
- problemas de jerarquía
- layout shifts
- texto difícil de leer

No introduzcas nuevos breakpoints únicamente para solucionar un problema tipográfico localizado.

## 13. Frameworks y utilidades

Cuando el proyecto utiliza un framework de utilidades como Tailwind CSS, prefiere las clases existentes cuando expresen directamente el comportamiento necesario.

Por ejemplo:

```text
text-balance
tabular-nums
max-w-prose
tracking-tight
```

No escribas CSS personalizado cuando una utilidad existente del proyecto ya resuelva el problema.

Respeta las convenciones existentes del código.

## Proceso de decisión

Para cada cambio tipográfico:

1. Identifica el problema visible o funcional.
2. Determina si realmente es un problema de tipografía.
3. Prefiere el cambio más pequeño que lo solucione.
4. Comprueba el resultado con contenido realista.
5. Conserva el sistema existente cuando ya funcione correctamente.

### Ejemplo

Problema:

```css
.hero-title {
  font-size: 48px;
  max-width: 500px;
}
```

El heading deja una única palabra corta en la última línea.

Diagnóstico:

- El tamaño de fuente puede ser correcto.
- El ancho del contenedor puede ser intencional.
- El problema es la distribución de las líneas, no la jerarquía.

Fix mínimo:

```css
.hero-title {
  font-size: 48px;
  max-width: 500px;
  text-wrap: balance;
}
```

No hagas inmediatamente:

- reducir el tamaño de fuente
- añadir un breakpoint
- añadir un `<br>` manual
- cambiar la escala tipográfica
- crear un nuevo tamaño para headings

Haz cambios más amplios solo si la solución mínima no resuelve el problema real.

## Regla principal

**No cambies la tipografía porque puedas mejorarla. Cámbiala cuando exista un problema claro, un requisito o un beneficio concreto.**

Prioriza:

- cambios específicos sobre refactorizaciones globales
- convenciones existentes sobre nuevas abstracciones
- `rem` para tipografía escalable
- `clamp()` cuando el tamaño fluido aporte un beneficio real
- `text-wrap: balance` para headings problemáticos
- `text-wrap: pretty` para textos largos cuando sea útil
- sistemas tipográficos simples sobre variaciones excesivas
- contenido real sobre ejemplos ideales
