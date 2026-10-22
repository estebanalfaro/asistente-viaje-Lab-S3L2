import { store } from '../../state/store.js';
import { validators } from '../../domain/validators.js';
import { catalogo } from '../../domain/catalogo.js';
import { appShell } from './AppShell.js';

export class TripView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.editandoNombre = null;
  }

  render() {
    const state = store.getState();
    const viajes = state.viajes;

    this.container.innerHTML = `
      <div class="trip-view">
        <h2>Gestión de Viajes</h2>
        <form id="tripForm" class="trip-form">
          <h3>${this.editandoNombre ? 'Editar Viaje' : 'Crear Nuevo Viaje'}</h3>
          <div class="form-group"><label>Nombre:</label><input type="text" id="tripNombre" value="${this.editandoNombre || ''}" ${this.editandoNombre ? 'readonly' : ''} required /></div>
          <div class="form-group"><label>Fecha Inicio:</label><input type="date" id="tripFechaInicio" required /></div>
          <div class="form-group"><label>Fecha Fin:</label><input type="date" id="tripFechaFin" required /></div>
          <div class="form-group"><label>Presupuesto Global ($):</label><input type="number" id="tripPresupuesto" step="0.01" min="0" required /></div>
          <button type="submit" class="btn-primary">${this.editandoNombre ? 'Actualizar' : 'Guardar'}</button>
          ${this.editandoNombre ? '<button type="button" id="btnCancelarEdit" class="btn-secondary">Cancelar</button>' : ''}
        </form>
        <hr style="margin: 2rem 0;" />
        <h3>Mis Viajes</h3>
        <div class="trip-list">
          ${viajes.length === 0 ? '<p>No hay viajes.</p>' : viajes.map(v => `
            <div class="trip-card" style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid #e2e8f0;">
              <div><strong>${v.nombre}</strong> (${v.fechaInicio} al ${v.fechaFin}) -$${v.presupuestoGlobal}</div>
              <div>
                <button data-action="seleccionar" data-nombre="${v.nombre}" class="btn-sm">Seleccionar</button>
                <button data-action="eliminar" data-nombre="${v.nombre}" class="btn-sm btn-danger">Eliminar</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    if (this.editandoNombre) {
      const v = viajes.find(item => item.nombre === this.editandoNombre);
      if (v) {
        document.getElementById('tripFechaInicio').value = v.fechaInicio;
        document.getElementById('tripFechaFin').value = v.fechaFin;
        document.getElementById('tripPresupuesto').value = v.presupuestoGlobal;
      }
    }

    document.getElementById('tripForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('tripNombre').value.trim();
      const fechaInicio = document.getElementById('tripFechaInicio').value;
      const fechaFin = document.getElementById('tripFechaFin').value;
      const presupuestoGlobal = document.getElementById('tripPresupuesto').value;

      const val = validators.validarViaje({ nombre, fechaInicio, fechaFin, presupuestoGlobal });
      if (!val.valido) { appShell.mostrarToast(val.mensaje, 'error'); return; }

      const viajesActuales = [...state.viajes];
      if (viajesActuales.some(v => v.nombre === nombre) && !this.editandoNombre) {
        appShell.mostrarToast("Ya existe un viaje con ese nombre.", 'error'); return;
      }

      if (this.editandoNombre) {
        const idx = viajesActuales.findIndex(v => v.nombre === this.editandoNombre);
        viajesActuales[idx] = { ...viajesActuales[idx], fechaInicio, fechaFin, presupuestoGlobal: Number(presupuestoGlobal) };
        store.setState({ viajes: viajesActuales });
        appShell.mostrarToast("Viaje actualizado.", 'success');
        this.editandoNombre = null;
      } else {
        const nuevo = { nombre, fechaInicio, fechaFin, presupuestoGlobal: Number(presupuestoGlobal) };
        const nuevasCats = catalogo.obtenerCategoriasPorDefecto().map(c => ({ ...c, viajeNombre: nombre }));
        store.setState({ viajes: [...viajesActuales, nuevo], categorias: [...state.categorias, ...nuevasCats], viajeActivoId: state.viajeActivoId || nombre });
        appShell.mostrarToast("Viaje creado.", 'success');
      }
      this.render();
    });

    document.getElementById('btnCancelarEdit')?.addEventListener('click', () => { this.editandoNombre = null; this.render(); });

    document.querySelector('.trip-list').addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const { action, nombre } = btn.dataset;
      if (action === 'seleccionar') {
        store.setState({ viajeActivoId: nombre });
        appShell.mostrarToast(`Viaje "${nombre}" activo.`, 'success');
        this.render();
      } else if (action === 'eliminar') {
        if (!confirm(`¿Eliminar viaje "${nombre}" y sus datos en cascada?`)) return;
        store.setState({
          viajes: state.viajes.filter(v => v.nombre !== nombre),
          categorias: state.categorias.filter(c => c.viajeNombre !== nombre),
          gastos: state.gastos.filter(g => g.viajeNombre !== nombre),
          actividades: state.actividades.filter(a => a.viajeNombre !== nombre),
          viajeActivoId: state.viajeActivoId === nombre ? null : state.viajeActivoId
        });
        appShell.mostrarToast("Viaje eliminado en cascada.", 'success');
        this.render();
      }
    });
  }
}