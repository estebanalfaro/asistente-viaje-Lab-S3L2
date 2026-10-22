# Plan de Implementación (`tasks_v2.md`) — Asistente de Viaje Personal

## Fase 1: Configuración Base, Infraestructura y Persistencia (`localStorage`)

- **`TASK-1.1`**: Crear la estructura de directorios del proyecto (`src/` con subcarpetas `domain/`, `state/`, `infra/`, `ui/components/`).
- **`TASK-1.2`**: Implementar el módulo de infraestructura de almacenamiento (`src/infra/storage.js`) para manejar operaciones de lectura y escritura en `localStorage`, asegurando que cumpla con la omisión de campos calculados (`REQ-PER-03`).
- **`TASK-1.3`**: Implementar el gestor de estado centralizado (`src/state/store.js`), asegurando la gestión del Viaje Activo único por sesión, junto con el sistema de suscripción reactiva para la interfaz (`REQ-VA-01`).

---

## Fase 2: Capa de Dominio y Validaciones (Funciones Puras)

- **`TASK-2.1`**: Implementar el módulo de validaciones de borde (`src/domain/validators.js`) cubriendo reglas para Viajes, Categorías, Gastos y Actividades (`REQ-VB-01` al `REQ-VB-12`), adaptando la validación estricta de fechas al formato `DD-MM-AAAA` y retornando mensajes de error exactos.
- **`TASK-2.2`**: Implementar el módulo de cálculos financieros (`src/domain/calculos.js`), incluyendo el recálculo de `presupuestoRestante`, el límite diario de comida/transporte y el saldo diario (`REQ-PG-02`, `REQ-PD-04`, `REQ-UB-02`).
- **`TASK-2.3`**: Configurar el catálogo cerrado de las 5 categorías fijas obligatorias y la asignación estricta de `controlDiario` (`REQ-UB-03`, `REQ-UB-04`, `REQ-UB-05`), confirmando además que la aplicación no define una moneda fija.

---

## Fase 3: Interfaz de Usuario y Componentes (Vistas SPA)

- **`TASK-3.1`**: Implementar el componente contenedor principal (`AppShell`) con la barra de navegación por pestañas (`TabNav`), indicador del viaje activo y soporte para alertas/toasts.
- **`TASK-3.2`**: Desarrollar la vista "**Mi viaje**" (`TripForm`, `TripSelector`) para la creación, edición y eliminación en cascada de viajes, fijando automáticamente el viaje creado como el Viaje Activo y validando fechas en formato `DD-MM-AAAA` (`REQ-PG-01`, `REQ-VB-01`, `REQ-VB-02`, `REQ-VB-13`, `REQ-PER-04`, `REQ-VA-01`).
- **`TASK-3.3`**: Desarrollar la vista "**Presupuesto**" para la gestión y asignación de montos en las categorías permitidas del viaje activo actual.
- **`TASK-3.4`**: Desarrollar la vista principal "**Resumen**" con `TripHeader`, `KpiRow` (4 tarjetas), `DailyAvailableCard` y `CategoryBudgetPanel` reflejando los datos del viaje activo en tiempo real.
- **`TASK-3.5`**: Desarrollar la vista "**Gastos**" (`ExpenseForm`, `ExpenseList`) utilizando automáticamente el viaje activo, con validación estricta de montos positivos y fechas en formato `DD-MM-AAAA`, además de alertas visuales de exceso de límite diario (`REQ-PD-02`, `REQ-VB-07`, `REQ-VB-08`, `REQ-VA-01`).
- **`TASK-3.6`**: Desarrollar la vista "**Itinerario**" (`ActivityForm`, `ActivityTimeline`) asociada al viaje activo, garantizando que sea 100% manual con fechas en `DD-MM-AAAA` y sin recomendaciones automáticas (`REQ-UB-01`, `REQ-VA-01`).

---

## Fase 4: Pruebas de Estrés, Verificación y Refinamiento (Head Chef)

- **`TASK-4.1`**: Realizar la prueba de persistencia (recargar la página con `F5` y confirmar la integridad de los datos restaurados sin pérdida).
- **`TASK-4.2`**: Validar restricciones semánticas e intentar ingresar un gasto con monto negativo o fecha inválida para confirmar su rechazo inmediato con el mensaje correcto.
- **`TASK-4.3`**: Verificar la lógica dinámica del límite diario de comida al registrar y eliminar gastos de forma reactiva bajo el concepto de viaje activo.
- **`TASK-4.4`**: Generar el documento de retrospectiva (`docs/retrospectiva.md`) respondiendo a las preguntas de análisis del laboratorio y asegurando la estructura optimizada del repositorio.