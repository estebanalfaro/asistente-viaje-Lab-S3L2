import { store } from '../../state/store.js';
import { appShell } from './AppShell.js';

export class BudgetView {
  constructor(containerId) { this.container = document.getElementById(containerId); }

  render() {
    const state = store.getState();
    
    // Viaje activo automático
    let viaje = state.viajes.find(v => v.nombre === state.viajeActivoId);
    if (!viaje && state.viajes.length > 0) {
      viaje = state.viajes[0];
    }

    if (!viaje) {
      this.container.innerHTML = `<h2>Presupuesto</h2><p class="alert-warning">Por favor, crea un viaje primero.</p>`;
      return;
    }

    const cats = state.categorias.filter(c => c.viajeNombre === viaje.nombre);

    this.container.innerHTML = `
      <div class="budget-view">
        <h2>Presupuesto Global y Categorías - ${viaje.nombre}</h2>
        <div class="kpi-row">
          <div class="kpi-card">
            <h4>Presupuesto Total</h4>
            <div class="kpi-value">${Number(viaje.presupuestoGlobal || 0).toFixed(2)}</div>
          </div>
        </div>

        <hr style="margin:1.5rem 0;" />
        <h3>Asignar Monto a Categorías</h3>
        <form id="budgetForm">
          <div class="form-group">
            <label>Categoría (Fija):</label>
            <select id="bCatName" required>
              <option value="">Seleccione</option>
              <option value="Hospedaje">Hospedaje</option>
              <option value="Tiquetes">Tiquetes</option>
              <option value="Transporte">Transporte (Control diario)</option>
              <option value="Actividades">Actividades</option>
              <option value="Comida">Comida (Control diario)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Monto Asignado:</label>
            <input type="number" step="0.01" min="0" id="bMonto" required />
          </div>
          <button type="submit" class="btn-primary">Guardar Categoría</button>
        </form>

        <h3 style="margin-top:2rem;">Categorías Registradas</h3>
        <table>
          <thead><tr><th>Categoría</th><th>Monto Asignado</th><th>Control Diario</th><th>Acciones</th></tr></thead>
          <tbody>
            ${cats.length === 0 ? '<tr><td colspan="4">No hay categorías asignadas.</td></tr>' : 
              cats.map((c, i) => `
                <tr>
                  <td><strong>${c.nombre}</strong></td>
                  <td>${Number(c.montoAsignado).toFixed(2)}</td>
                  <td><span class="badge ${c.controlDiario === 'sí' ? 'badge-info' : ''}">${c.controlDiario}</span></td>
                  <td><button data-idx="${i}" class="btn-sm btn-danger btn-del-cat">Eliminar</button></td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    `;

    document.getElementById('budgetForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('bCatName').value;
      const montoAsignado = Number(document.getElementById('bMonto').value);

      if (montoAsignado < 0 || isNaN(montoAsignado)) {
        appShell.mostrarToast("El monto debe ser mayor o igual a cero.", 'error');
        return;
      }

      const existe = cats.some(c => c.nombre === nombre);
      if (existe) {
        appShell.mostrarToast("Ya existe una categoría con ese nombre en este viaje.", 'error');
        return;
      }

      // Definir control diario automáticamente según requerimiento
      const controlDiario = (nombre === 'Comida' || nombre === 'Transporte') ? 'sí' : 'no';

      const nuevasCategorias = [...state.categorias, { viajeNombre: viaje.nombre, nombre, montoAsignado, controlDiario }];
      store.setState({ categorias: nuevasCategorias, viajeActivoId: viaje.nombre });

      appShell.mostrarToast("Categoría guardada con éxito.", 'success');
      this.render();
    });

    document.querySelector('.budget-view')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-del-cat');
      if (!btn) return;
      if (!confirm("¿Eliminar categoría?")) return;
      const idx = Number(btn.dataset.idx);
      const categoriasViaje = state.categorias.filter(c => c.viajeNombre === viaje.nombre);
      const objetivo = categoriasViaje[idx];
      store.setState({ categorias: state.categorias.filter(c => c !== objetivo) });
      appShell.mostrarToast("Categoría eliminada.", 'success');
      this.render();
    });
  }
}