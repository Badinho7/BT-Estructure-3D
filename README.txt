BT-Estructure WebXR Demo — Proyecto completo (Versión avanzada "completita +")

Contenido del paquete:
- index.html        -> Página principal (A-Frame) lista para abrir en Quest Browser
- scene.js          -> Script que genera la estructura, geodésicas, animaciones y tour
- narration.wav     -> Archivo de audio silencioso (placeholder). Puedes reemplazarlo por un MP3/OGG narrado.
- README.txt        -> Instrucciones

Instrucciones rápidas para publicar (recomendado: GitHub Pages):
1) Crea un repositorio en GitHub y sube los archivos (index.html, scene.js, narration.wav, README.txt).
2) En Settings -> Pages, selecciona la rama main (root) y publica. La URL será https://<tu-usuario>.github.io/<repo>/
3) En Meta Quest 3: abre el navegador, visita la URL y pulsa "Enter VR".

Prueba local (si no tienes hosting):
1) Desde un ordenador en la misma red que tu Quest, abre terminal en la carpeta y ejecuta:
   python3 -m http.server 8000
2) Obtén la IP local del ordenador (p.ej. 192.168.1.34) y en Quest Browser abre: http://192.168.1.34:8000
3) Pulsa "Enter VR".

Sugerencias para mejorar:
- Reemplaza narration.wav por un archivo .ogg o .mp3 con tu narración (voz explicativa).
- Si quieres texturas o modelos glTF reales, puedo generarlos y añadir.
- Para versión estereoscópica prepararé cámaras separadas y renderizado dual (puede reducir rendimiento).
