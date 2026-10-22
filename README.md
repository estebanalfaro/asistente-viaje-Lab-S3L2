# ✈️ Asistente de Viaje Personal

## 📝 Descripción del Proyecto
Asistente de Viaje Personal es una aplicación web sencilla diseñada para ayudarte a planificar y controlar tus viajes. Con esta herramienta puedes organizar tu itinerario diario, gestionar un presupuesto general y llevar el registro de tus gastos diarios (especialmente en comida y transporte) para saber en todo momento cuánto dinero te queda disponible.

La aplicación opera bajo el principio de Viaje Activo y Único, asegurando que todas las vistas y formularios operen sobre el viaje actual en curso sin requerir una selección repetida de viaje en cada transacción.

El proyecto está diseñado bajo la metodología SDD (Spec Driven Development), funcionando 100% en el navegador (sin servidor) y guardando tus datos directamente en tu dispositivo.

## ✨ Características Principales
* **Gestión de Viaje Activo:** Administración simplificada enfocada en un único viaje activo por sesión.
* **Presupuesto por Categorías:** Define tu presupuesto global repartido en Hospedaje, Tiquetes, Transporte, Actividades y Comida.
* **Formatos Estándar:** Fechas normalizadas al formato DD-MM-AAAA sin restricciones de moneda fija.
* **Control Diario de Gastos:** Calcula automáticamente tu meta y saldo del día para Comida y Transporte.
* **Alertas Visuales:** Te avisa si te estás excediendo del límite diario configurado.
* **Itinerario Manual:** Guarda las actividades y eventos de tu viaje organizados por fecha (DD-MM-AAAA) y hora.
* **Privacidad y Persistencia:** Todos tus datos se guardan de forma local en tu navegador (localStorage), omitiendo campos calculados.

## 🛠️ Tecnologías Utilizadas
* **HTML5 & CSS3:** Estructura e interfaz limpia.
* **JavaScript (ES Modules):** Lógica del sistema, validaciones y estado local centralizado.
* **Almacenamiento Local (localStorage):** Persistencia de datos en el cliente.

## 📁 Estructura del Repositorio
```text
/  
├── CLAUDE.md                   # Memoria Semántica: Reglas del negocio e invariantes  
├── docs/  
│   ├── requirements.md         # Especificaciones formales en sintaxis EARS
│   ├── data-contract.json      # Contrato de datos y esquema del modelo
│   ├── wireframe.png           # Bocetos y diseño de interfaz gráfica  
│   └── retrospectiva.md        # Documento individual de análisis y reflexiones  
├── tasks.md                    # Plan de implementación paso a paso generado con IA  
├── src/                        # Código fuente de la aplicación  
│   ├── domain/                 # Validaciones y cálculos financieros  
│   ├── state/                  # Gestor de estado y Viaje Activo  
│   ├── infra/                  # Persistencia en localStorage  
│   └── ui/                     # Componentes y vistas SPA  
└── README.md                   # Resumen del proyecto y estructura