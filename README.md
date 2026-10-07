# Panka

Prototipo de web app de alfabetización para chicas y chicos de **5 a 8 años**, con una zona para familias.
Es una **demo**: no hay backend, ni cuentas, ni inteligencia artificial real. Todo lo que parece "inteligente" (análisis de lectura, chat, subida de fotos y audios) está simulado, y lo que se hace queda guardado en el navegador.

La mascota es **Lumi**, una luciérnaga cuya colita se ilumina cuando aprende algo nuevo.

## Cómo correrla

Hace falta [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install
npm run dev        # abre la app en http://localhost:5173
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Revisa los tipos y genera la versión final en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` para probarla |
| `npm run build:single` | Además genera `dist/panka-demo.html`, toda la app en un solo archivo |

## Qué incluye

**Zona de chicos** (menú inferior: Inicio, Cuentos, Leer, Crear, Lumi)

- **Bienvenida**: elegir si usa un chico/a o un adulto; nombre, edad (5 a 8), personaje e intereses.
- **Evaluación inicial**: 5 juegos cortos de comprensión, escritura (sílabas) y oralidad, con nivel y recomendaciones.
- **Inicio**: misiones del día, tiempo de uso, accesos y cuentos para seguir leyendo.
- **Cuentos**: biblioteca filtrable por edad y nivel, favoritos, progreso, lector con narración por voz (usa la voz del navegador) y preguntas de comprensión.
- **Leer en voz alta**: grabación simulada que resalta palabra por palabra, análisis de fluidez, pronunciación y comprensión, estrellas y medallas.
- **Crear mi cuento**: trazado real de la primera letra del nombre, personaje, lugar, completar la frase con palabras sugeridas, stickers y vista previa del cuento.
- **Lumi**: chat con respuestas rápidas, audios simulados, adivinanzas e historias inventadas entre los dos.
- **Fuera de la pantalla**: actividades para hacer en casa con "subida" simulada de foto, audio o texto.
- **¿Qué aprendí hoy?**: reflexión diaria escrita o con audio, y un diario.
- **Perfil**: estadísticas, medallas, gráfico semanal y la opción de leer en MAYÚSCULAS o minúsculas.

**Zona familias** (con clave; en la demo es `1234`)

- **Panel**: resumen, tiempo de lectura semanal, resultados de la evaluación, recomendaciones personalizadas, lo que hizo en la app, guía para familias, hábitos y tiempo recomendado.
- **Bienestar digital**: límite diario, uso del día, avisos y consejos. El botón "Simular 5 min de uso" sirve para mostrar el aviso de límite en una presentación.
- **Chat** estilo WhatsApp con el asistente de Panka.
- **Personalización**: datos del chico/a, contexto familiar, ubicación, cultura, intereses y preferencias de lectura.

Para volver a empezar la demo de cero: **Perfil → Reiniciar la demo**.

## Estructura

```
src/
├── App.tsx              Rutas (con # en la URL, para que funcione en cualquier hosting)
├── index.css            Paleta (tomada del logo) y tipografías
├── lib/
│   ├── content.ts       Cuentos, frases, actividades, medallas: todo el contenido de la demo
│   └── store.tsx        Estado de la app, guardado en el navegador
├── components/          Lumi, marco tipo celular, menú, botones y piezas comunes
└── pages/               Una pantalla por archivo (las de familias en pages/familia/)
```

Para sumar cuentos o actividades, alcanza con editar `src/lib/content.ts`.

## Publicar la demo con un link

El repo trae una GitHub Action (`.github/workflows/deploy.yml`) que publica la app en GitHub Pages cada vez que se actualiza `main`. Se activa una sola vez en **Settings → Pages → Source: GitHub Actions**. La demo queda en `https://ezequielferrari.github.io/web-prototype-builder/`.

## Referencias

`referencias/` guarda los dos prototipos originales hechos en Replit (versión 1 y versión 2), que sirvieron de base.
