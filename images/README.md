# Carpeta de Imágenes

Esta carpeta contiene las imágenes utilizadas en el sitio web de Empírica Legal Lab.

## Imagen del Diploma

### Instrucciones para agregar la imagen de muestra del diploma:

1. **Nombre del archivo**: La imagen debe llamarse exactamente `diploma-muestra.jpg`

2. **Ubicación**: Coloca la imagen en esta carpeta: `/images/`

3. **Formato recomendado**:
   - Formato: JPG o PNG
   - Dimensiones originales: 2020 x 1432 píxeles
   - Para optimización web, se recomienda:
     - Ancho máximo: 1800 píxeles
     - Calidad: 85%
     - Peso del archivo: menos de 500KB

4. **Optimización de la imagen** (recomendado):
   Dado que la imagen es grande (2020x1432 píxeles), se recomienda optimizarla antes de subirla:

   **Opción A - Usando herramientas en línea:**
   - TinyPNG (https://tinypng.com/) - Compresión automática
   - Squoosh (https://squoosh.app/) - Control manual de calidad

   **Opción B - Usando comandos (si tienes ImageMagick instalado):**
   ```bash
   convert diploma-original.jpg -resize 1800x -quality 85 diploma-muestra.jpg
   ```

5. **Cómo agregar la imagen**:

   **Opción A - Directamente en GitHub:**
   - Ve a la carpeta `images` en GitHub
   - Haz clic en "Add file" > "Upload files"
   - Arrastra tu imagen `diploma-muestra.jpg`
   - Haz commit de los cambios

   **Opción B - Usando Git local:**
   ```bash
   # Copia tu imagen a la carpeta images con el nombre correcto
   cp /ruta/a/tu/imagen.jpg images/diploma-muestra.jpg

   # Agrega y haz commit
   git add images/diploma-muestra.jpg
   git commit -m "Agregar imagen de muestra del diploma"
   git push
   ```

6. **Verificación**:
   Una vez subida la imagen, visita:
   - https://jorch01.github.io/cursos-juridicos-empirica.io/diplomas.html
   - Verifica que la imagen del diploma se muestre correctamente en la sección "Ejemplo de Diploma"

## Notas adicionales

- La imagen ya está configurada en `diplomas.html` línea 278
- Los metadatos Open Graph también están actualizados para mostrar esta imagen cuando se comparta la página en redes sociales
- Si cambias el nombre del archivo, deberás actualizar también la referencia en `diplomas.html`
