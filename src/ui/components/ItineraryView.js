import { store } from '../../state/store.js';
import { appShell } from './AppShell.js';

export class ItineraryView {
  constructor(containerId) { this.container = document.getElementById(containerId); }

  render() {
    const state = store.getState();
    
    // Viaje activo automático
    let viaje = state.viajes.find(v => v.nombre === state.viajeActivoId);
    if (!viaje && state.viajes.length > 0) {
      viaje = state.viajes[0];
    }

    if (!viaje) {
      this.container.innerHTML = `<h2>Itinerario</h2><p class="alert-warning">Por favor, crea un viaje primero.</p>`;
      return;
    }

    const actividades = state.actividades.filter(a => a.viajeNombre === viaje.nombre);

    this.container.innerHTML = `
      <div class="itinerary-view">
        <h2>Itinerario de Actividades - ${viaje.nombre}</h2>
        <form id="activityForm">
          <div class="form-group"><label>Fecha (DD-MM-AAAA):</label><input type="date" id="aFecha" min="${viaje.fechaInicio}" max="${viaje.fechaFin}" required /></div>
          <div class="form-group"><label>Hora (Opcional):</label><input type="time" id="aHora" /></div>
          <div class="form-group"><label>Descripción de la Actividad:</label><input type="text" id="aDesc" placeholder="Ej: Visita guiada al bosque nuboso" required /></div>
          <button type="submit" class="btn-primary">Agregar Actividad</button>
        </form>

        <hr style="margin:2rem 0;" />
        <h3>Cronograma</h3>
        <div class="activity-list">
          ${actividades.length === 0 ? '<p>No hay actividades registradas.</p>' : `
            <table>
              <thead><tr><th>Fecha</th><th>Hora</th><th>Descripción</th><th>Acciones</th></tr></thead>
              <tbody>
                ${actividades.map((a, i) => `
                  <tr>
                    <td>${a.fecha}</td>
                    <td>${a.hora || '-'}</td>
                    <td><strong>${a.descripcion}</strong></td>
                    <td><button data-idx="${i}" class="btn-sm btn-danger btn-del-act">Eliminar</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;

    document.getElementById('activityForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fecha = document.getElementById('aFecha').value;
      const hora = document.getElementById('aHora').value;
      const descripcion = document.getElementById('aDesc').value.trim();

      if (!descripcion) {
        appShell.mostrarToast("La descripción no puede estar vacía.", 'error');
        return;
      }
      if (fecha < viaje.fechaInicio || fecha > viaje.fechaFin) {
        appShell.mostrarToast("La fecha de la actividad está fuera del rango del viaje.", 'error');
        return;
      }

      const nuevasActividades = [...state.actividades, { viajeNombre: viaje.nombre, fecha, hora, descripcion }];
      store.setState({ actividades: nuevasActividades, viajeActivoId: viaje.nombre });

      appShell.mostrarToast("Actividad agregada con éxito.", 'success');
      this.render();
    });

    document.querySelector('.activity-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-del-act');
      if (!btn) return;
      if (!confirm("¿Eliminar actividad?")) return;
      const idx = Number(btn.dataset.idx);
      const actsViaje = state.actividades.filter(a => a.viajeNombre === viaje.nombre);
      const objetivo = actsViaje[idx];
      store.setState({ actividades: state.actividades.filter(a => a !== objetivo) });
      appShell.mostrarToast("Actividad eliminada.", 'success');
      this.render();
    });
  }
}