Aquí tienes las variables de CSS traducidas al español y el documento completo en formato Markdown:

````markdown
# Guía de Identidad Visual y UI - Sistema Pet Spa & Shop

Este documento define los tokens de diseño y las reglas de implementación para la interfaz del sistema. El objetivo es garantizar la coherencia visual entre el módulo de **Spa** (enfocado en bienestar/limpieza) y el de **Petshop** (enfocado en ventas/energía).

## 1. Tokens de Diseño (Paleta Técnica)

Los siguientes valores hexadecimales deben ser declarados como variables globales en el proyecto (CSS Variables, Tailwind Config, o Theme Provider).

| Token                | Valor Hex | Uso Principal                                                           |
| :------------------- | :-------- | :---------------------------------------------------------------------- |
| `COLOR_PRIMARIO`     | `#20B2AA` | Turquesa: Acciones principales, navegación y branding.                  |
| `COLOR_ACENTO`       | `#FDE047` | Amarillo Suave: Notificaciones, alertas de baja prioridad y destacados. |
| `COLOR_CAPA_1`       | `#E0F2FE` | Celeste Bebé: Fondos de contenedores, secciones y capas.                |
| `COLOR_TEXTO_FUERTE` | `#083344` | Azul Petróleo: Texto de alta jerarquía, títulos y contraste.            |
| `COLOR_SUPERFICIE`   | `#FFFFFF` | Blanco: Fondo base de la aplicación y modales.                          |

---

## 2. Arquitectura de Capas

Para dar profundidad a la interfaz sin usar sombras excesivas, se utiliza la técnica de elevación por color:

1.  **Nivel 0 (Fondo Base):** Se utiliza `COLOR_SUPERFICIE` (#FFFFFF) para el fondo general de la aplicación.
2.  **Nivel 1 (Contenedores):** Se utiliza `COLOR_CAPA_1` (#E0F2FE) para diferenciar áreas de contenido (ej. la tarjeta de perfil de una mascota o el panel lateral de filtros).
3.  **Nivel 2 (Elementos Flotantes):** Los modales, pop-overs o menús desplegables deben volver a `COLOR_SUPERFICIE` para resaltar sobre el fondo celeste.

---

## 3. Lógica de Componentes

### A. Botones y Llamada a la Acción (CTA)

- **Acción Principal (`.btn-primario`):**
  - Fondo: `COLOR_PRIMARIO`.
  - Texto: `COLOR_SUPERFICIE`.
  - Uso: Guardar, Confirmar Cita, Finalizar Venta.
- **Acción de Resaltado (`.btn-acento`):**
  - Fondo: `COLOR_ACENTO`.
  - Texto: `COLOR_TEXTO_FUERTE`.
  - Uso: Ver Ofertas, Aplicar Descuento, Alertas.
  - **IMPORTANTE:** Prohibido usar texto blanco sobre amarillo por falta de contraste accesible.

### B. Etiquetas y Estados (Insignias)

- **Estado Activo/Completado:** Fondo `COLOR_PRIMARIO` (con opacidad 20%) y texto `COLOR_PRIMARIO`.
- **Estado Pendiente/Aviso:** Fondo `COLOR_ACENTO` y texto `COLOR_TEXTO_FUERTE`.
- **Contenedor de Información:** Fondo `COLOR_CAPA_1` y texto `COLOR_TEXTO_FUERTE`.

---

## 4. Tipografía y Legibilidad

- **Títulos (H1, H2, H3):** Utilizar siempre `COLOR_TEXTO_FUERTE`.
- **Cuerpo de Texto:** Utilizar `COLOR_TEXTO_FUERTE` con una opacidad del 85% para reducir la fatiga visual.
- **Contraste:** Al renderizar texto sobre fondos de color (`COLOR_ACENTO` o `COLOR_CAPA_1`), el color de fuente obligatorio es `COLOR_TEXTO_FUERTE`.

---

## Guía Tipográfica

Para este sistema, utilizaremos un enfoque de **fuentes seguras para web y alto rendimiento**, priorizando la legibilidad en tablas de inventario y formularios de registro.

### 1. Familia Principal: Urbanist o Montserrat

- **Tipo:** Sans Serif Geométrica.
- **Por qué:** Tienen formas redondeadas que comunican amabilidad (ideal para mascotas) pero mantienen una estructura moderna y profesional para el software.
- **Importación (Google Fonts):**
  ```css
  @import url("https://fonts.googleapis.com/css2?family=Urbanist:wght@400;600;700&display=swap");
  ```
````

### 2. Jerarquía y Reglas de Estilo

| Elemento            | Peso  | Tamaño | Token de Color                      | Propósito                                        |
| :------------------ | :---- | :----- | :---------------------------------- | :----------------------------------------------- |
| **H1 - Títulos**    | `700` | `32px` | `COLOR_TEXTO_FUERTE`                | Encabezados de sección (ej. "Panel de Control"). |
| **H2 - Subtítulos** | `600` | `24px` | `COLOR_PRIMARIO`                    | Títulos de tarjetas o bloques de datos.          |
| **Cuerpo - Texto**  | `400` | `16px` | `COLOR_TEXTO_FUERTE` (85% opacidad) | Lectura general, descripciones de productos.     |
| **Etiquetas / UI**  | `600` | `14px` | `COLOR_TEXTO_FUERTE`                | Etiquetas de formulario y nombres de columnas.   |
| **Botones**         | `700` | `16px` | Variable                            | Botones de acción.                               |

---

## Notas de UX para el Desarrollador

1.  **Tablas de Inventario:** Para los números y precios en el módulo de Petshop, asegúrate de usar `font-variant-numeric: tabular-nums;`. Esto hará que los números se alineen perfectamente uno debajo del otro, facilitando la lectura de precios.
2.  **Uso de Mayúsculas:** Usa `text-transform: uppercase;` y `letter-spacing: 0.05em;` exclusivamente en las **Etiquetas** de los formularios y en botones pequeños para dar un toque más "App" y menos "Página Web".
3.  **Contraste sobre Amarillo:** En botones amarillos (`COLOR_ACENTO`), el peso de la fuente **debe ser 700** para asegurar que el texto azul oscuro sea perfectamente legible.

---

## Implementación en Angular (Guía Técnica)

### 1. Variables Globales en `styles.scss`

```scss
// src/styles.scss

:root {
  /* Tokens de Paleta */
  --color-primario: #20b2aa;
  --color-acento: #fde047;
  --color-capa-1: #e0f2fe;
  --color-texto-fuerte: #083344;
  --color-superficie: #ffffff;

  /* Tokens de Tipografía */
  --fuente-principal: "Urbanist", sans-serif;
}

body {
  margin: 0;
  font-family: var(--fuente-principal);
  background-color: var(--color-superficie);
  color: var(--color-texto-fuerte);
}
```

### 2. Uso en Componentes

```scss
// Ejemplo: componente de tarjeta de mascota
.tarjeta-mascota {
  background-color: var(--color-capa-1);
  border-radius: 12px;
  padding: 1.5rem;

  .nombre-mascota {
    color: var(--color-primario);
    font-weight: 700;
  }
}
```

---

> ### 🚀 Nota para el Desarrollador Angular
>
> - **Configuración:** Definir los colores en `:root` dentro de `src/styles.scss`.
> - **Botones:** Utilizar clases globales o directivas para los botones principales y de acción rápida (Petshop).
> - **Capas:** Las tarjetas de servicios de Spa deben utilizar el token `--color-capa-1` para el fondo y `--color-primario` para los bordes destacados o indicadores de estado.
> - **Tipografía:** Asegurarse de incluir el enlace de Google Fonts en el `index.html` antes de llamar a las variables en el CSS.
