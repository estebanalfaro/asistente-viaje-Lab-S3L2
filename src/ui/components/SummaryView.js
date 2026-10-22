import { store } from '../../state/store.js';
import { calculos } from '../../domain/calculos.js';

export class SummaryView {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.fechaConsultaSeleccionada = null;
  }

  formatearFechaVisual(fechaStr) {
    if (!fechaStr) return '';
    const partes = fechaStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return fechaStr;
  }

  render() {
    const state = store.getState();
    
    let viaje = state.viajes.find(v => v.nombre === state.viajeActivoId);
    if (!viaje && state.viajes.length > 0) {
      viaje = state.viajes[0];
    }

    if (!viaje) {
      this.container.innerHTML = `<h2>Resumen</h2><p class="alert-warning">No hay un viaje activo seleccionado.</p>`;
      return;
    }

    const gastosViaje = state.gastos.filter(g => g.viajeNombre === viaje.nombre);
    const categoriasViaje = state.categorias.filter(c => c.viajeNombre === viaje.nombre);
    const totalGastado = gastosViaje.reduce((acc, g) => acc + Number(g.monto), 0);
    const presupuestoGlobal = Number(viaje.presupuestoGlobal || 0);
    const presupuestoRestante = presupuestoGlobal - totalGastado;
    const totalDias = calculos.calcularTotalDias(viaje.fechaInicio, viaje.fechaFin);

    const fechaInicioFmt = this.formatearFechaVisual(viaje.fechaInicio);
    const fechaFinFmt = this.formatearFechaVisual(viaje.fechaFin);

    // Inicializar fecha de consulta con la fecha de inicio del viaje si no hay otra seleccionada
    if (!this.fechaConsultaSeleccionada || this.fechaConsultaSeleccionada < viaje.fechaInicio || this.fechaConsultaSeleccionada > viaje.fechaFin) {
      this.fechaConsultaSeleccionada = viaje.fechaInicio;
    }

    // Filtrar categorías con control diario (Comida, Transporte)
    const catsControlDiario = categoriasViaje.filter(c => c.controlDiario === 'sí');

    this.container.innerHTML = `
      <div class="summary-view">
        <h2>${viaje.nombre}</h2>
        <p class="date-range">📅 Del: ${fechaInicioFmt} al ${fechaFinFmt} (${totalDias} días totales)</p>
        
        <div class="kpi-row">
          <div class="kpi-card">
            <h4>Presupuesto Global</h4>
            <div class="kpi-value">${presupuestoGlobal.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <h4>Total Gastado</h4>
            <div class="kpi-value text-danger">${totalGastado.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <h4>Presupuesto Restante</h4>
            <div class="kpi-value text-success">${presupuestoRestante.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <h4>Días Totales</h4>
            <div class="kpi-value">${totalDias}</div>
          </div>
        </div>

        <hr style="margin:2rem 0;" />

        <h3>Control Diario de Comida y Transporte</h3>
        <div class="form-group" style="max-width:300px; margin-bottom:1.5rem;">
          <label>Fecha de Consulta:</label>
          <input type="date" id="fechaConsulta" value="${this.fechaConsultaSeleccionada}" min="${viaje.fechaInicio}" max="${viaje.fechaFin}" />
        </div>

        <div class="daily-cards-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:2rem;">
          ${catsControlDiario.length === 0 ? '<p>No hay categorías con control diario configuradas en este viaje.</p>' : 
            catsControlDiario.map(cat => {
              const montoAsignado = Number(cat.montoAsignado || 0);
              const limiteDiario = totalDias > 0 ? montoAsignado / totalDias : 0;
              
              const gastadoDelDia = gastosViaje
                .filter(g => g.categoria === cat.nombre && g.fecha === this.fechaConsultaSeleccionada)
                .reduce((acc, g) => acc + Number(g.monto), 0);

              const saldoDelDia = limiteDiario - gastadoDelDia;
              const excede = gastadoDelDia > limiteDiario;

              return `
                <div class="kpi-card" style="border-left: 4px solid ${excede ? '#e74c3c' : '#2ecc71'};">
                  <h4>${cat.nombre} (Diario)</h4>
                  <p><strong>Límite Diario:</strong> ${limiteDiario.toFixed(2)}</p>
                  <p><strong>Gastado hoy:</strong> ${gastadoDelDia.toFixed(2)}</p>
                  <p><strong>Saldo del día:</strong> <span class="${saldoDelDia < 0 ? 'text-danger' : 'text-success'}">${saldoDelDia.toFixed(2)}</span></p>
                  ${excede ? '<p style="color:#e74c3c; font-size:0.85rem; margin-top:0.5rem;">⚠️ Excede la meta diaria</p>' : ''}
                </div>
              `;
            }).join('')}
        </div>

        <h3>Desglose por Categoría</h3>
        <table>
          <thead>
            <tr><th>Categoría</th><th>Monto Asignado</th><th>Gastado Acumulado</th><th>Restante</th><th>Control Diario</th></tr>
          </thead>
          <tbody>
            ${categoriasViaje.length === 0 ? '<tr><td colspan="5">No hay categorías registradas.</td></tr>' :
              categoriasViaje.map(cat => {
                const gastadoCat = gastosViaje
                  .filter(g => g.categoria === cat.nombre)
                  .reduce((acc, g) => acc + Number(g.monto), 0);
                const restanteCat = Number(cat.montoAsignado) - gastadoCat;
                return `
                  <tr>
                    <td><strong>${cat.nombre}</strong></td>
                    <td>${Number(cat.montoAsignado).toFixed(2)}</td>
                    <td>${gastadoCat.toFixed(2)}</td>
                    <td class="${restanteCat < 0 ? 'text-danger' : ''}">${restanteCat.toFixed(2)}</td>
                    <td>${cat.controlDiario}</td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </div>
    `;

    const inputFechaConsulta = document.getElementById('fechaConsulta');
    if (inputFechaConsulta) {
      inputFechaConsulta.addEventListener('change', (e) => {
        this.fechaConsultaSeleccionada = e.target.value;
        this.render();
      });
    }
  }
}