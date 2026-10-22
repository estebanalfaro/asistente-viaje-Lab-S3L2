import { store } from '../../state/store.js';
import { validators } from '../../domain/validators.js';
import { calculos } from '../../domain/calculos.js';
import { appShell } from './AppShell.js';

export class ExpenseView {
  constructor(containerId) { this.container = document.getElementById(containerId); }

  render() {
    const state = store.getState();
    
    // Viaje activo automático
    let viaje = state.viajes.find(v => v.nombre === state.viajeActivoId);
    if (!viaje && state.viajes.length > 0) {
      viaje = state.viajes[0];
    }

    if (!viaje) {
      this.container.innerHTML = `<h2>Gastos</h2><p class="alert-warning">Por favor, crea un viaje primero en la sección de viajes.</p>`;
      return;
    }

    const cats = state.categorias.filter(c => c.viajeNombre === viaje.nombre);
    const gastos = state.gastos.filter(g => g.viajeNombre === viaje.nombre);
    const totalDias = calculos.calcularTotalDias(viaje.fechaInicio, viaje.fechaFin);

    this.container.innerHTML = `
      <div class="expense-view">
        <h2>Registro de Gastos - ${viaje.nombre}</h2>
        <form id="expenseForm">
          <div class="form-group"><label>Fecha (DD-MM-AAAA):</label><input type="date" id="gFecha" min="${viaje.fechaInicio}" max="${viaje.fechaFin}" required /></div>
          <div class="form-group"><label>Categoría:</label><select id="gCat" required><option value="">Seleccione</option>${cats.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}</select></div>
          <div class="form-group"><label>Monto:</label><input type="number" step="0.01" min="0.01" id="gMonto" required /></div>
          <div class="form-group"><label>Descripción:</label><input type="text" id="gDesc" /></div>
          <button type="submit" class="btn-primary">Registrar Gasto</button>
        </form>
        <hr style="margin:2rem 0;" />
        <h3>Historial</h3>
        <div class="expense-list">
          ${gastos.length === 0 ? '<p>No hay gastos.</p>' : `
            <table>
              <thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Monto</th><th>Acciones</th></tr></thead>
              <tbody>
                ${gastos.map((g, i) => `<tr><td>${g.fecha}</td><td><strong>${g.categoria}</strong></td><td>${g.descripcion || '-'}</td><td>${Number(g.monto).toFixed(2)}</td><td><button data-idx="${i}" class="btn-sm btn-danger btn-del">Eliminar</button></td></tr>`).join('')}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;

    document.getElementById('expenseForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fecha = document.getElementById('gFecha').value;
      const categoria = document.getElementById('gCat').value;
      const monto = document.getElementById('gMonto').value;
      const descripcion = document.getElementById('gDesc').value.trim();

      const val = validators.validarGasto({ monto, fecha, categoria }, cats);
      if (!val.valido) { appShell.mostrarToast(val.mensaje, 'error'); return; }
      if (fecha < viaje.fechaInicio || fecha > viaje.fechaFin) { appShell.mostrarToast("Fecha fuera del rango del viaje.", 'error'); return; }

      const nuevosGastos = [...state.gastos, { viajeNombre: viaje.nombre, fecha, categoria, monto: Number(monto), descripcion }];
      store.setState({ gastos: nuevosGastos, viajeActivoId: viaje.nombre });

      appShell.mostrarToast("Gasto registrado con éxito.", 'success');
      this.render();
    });

    document.querySelector('.expense-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-del');
      if (!btn) return;
      if (!confirm("¿Eliminar gasto?")) return;
      const idx = Number(btn.dataset.idx);
      const gastosViaje = state.gastos.filter(g => g.viajeNombre === viaje.nombre);
      const objetivo = gastosViaje[idx];
      store.setState({ gastos: state.gastos.filter(g => g !== objetivo) });
      appShell.mostrarToast("Gasto eliminado.", 'success');
      this.render();
    });
  }
}