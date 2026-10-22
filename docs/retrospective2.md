# Retrospectiva y Reflexión - Laboratorio S3L2 (Re-ingeniería Intencional)

## 1. Arquitectura Orientada a IA
¿Cómo facilitó la organización de los archivos de contexto (`CLAUDE.md`, `tasks.md`, `requirements.md`) el trabajo del agente de IA al momento de generar, corregir o refactorizar el código?

* **Respuesta:** La estructuración previa de los artefactos y la memoria semántica (`Gemini.md`) permitieron que la IA mantuviera un contexto estricto sobre las reglas de negocio (como el manejo del viaje único activo, la estricta validación del formato de fechas `DD-MM-AAAA` y la ausencia de símbolos de moneda). Esto redujo drásticamente las alucinaciones del modelo y aceleró la refactorización de los componentes sin apartarse del diseño técnico planeado.

## 2. Auditoría de Insumos
¿Qué inconsistencias o vacíos descubriste al revisar y armonizar tu contrato de datos JSON con las especificaciones EARS antes de comenzar a programar?

* **Respuesta:** Durante la armonización se detectaron pequeñas discrepancias en la nomenclatura de los campos calculados (como el saldo diario y los límites de control de comida/transporte). Al unificar los criterios en el contrato de datos y alinearlos con los requerimientos EARS antes de escribir código, se evitó retrabajo lógico en la capa de dominio y en las vistas SPA.

## 3. Mantenibilidad y Unchanged Behavior
¿Qué diferencia notaste al solicitar correcciones bajo la regla de *Unchanged Behavior* frente a las modificaciones a ciegas realizadas en laboratorios anteriores?

* **Respuesta:** Aplicar la regla de *Unchanged Behavior* permitió realizar cambios puntuales y limpios (como la eliminación de símbolos monetarios y la estandarización visual de las fechas) asegurando que la lógica financiera y de persistencia en `localStorage` se mantuviera intacta. Esto demostró ser mucho más eficiente y seguro que modificar el código de forma improvisada.

## 4. Evaluación de Satisfacción y Verificación de Negocio
Presentación y verificación de los tres pilares auditados por el cliente (persistencia tras F5, rechazo de restricciones como montos negativos y recálculo dinámico del límite diario de comida/transporte).

* **Respuesta:** La aplicación superó satisfactoriamente las pruebas de estrés en local, garantizando una experiencia de usuario robusta, fluida y alineada al 100% con los requerimientos de diseño de la interfaz y la estética de bosque nuboso.