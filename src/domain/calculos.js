export const calculos = {
  calcularTotalDias(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) return 0;
    const diff = new Date(fechaFin) - new Date(fechaInicio);
    const dias = Math.round(diff / (1000 * 60 * 60 * 24));
    return dias >= 0 ? dias : 0;
  },
  aCentavos(m) { return Math.round(Number(m || 0) * 100); },
  aDecimal(c) { return Number((c / 100).toFixed(2)); },

  calcularPresupuestoRestante(presupuestoGlobal, gastos = []) {
    const globalC = this.aCentavos(presupuestoGlobal);
    const totalG = gastos.reduce((acc, g) => acc + this.aCentavos(g.monto), 0);
    return this.aDecimal(globalC - totalG);
  },

  calcularCategoria(categoria, gastosViaje = [], totalDias = 0) {
    const gastosCat = gastosViaje.filter(g => g.categoria === categoria.nombre);
    const gastadoC = gastosCat.reduce((acc, g) => acc + this.aCentavos(g.monto), 0);
    const asignadoC = this.aCentavos(categoria.montoAsignado);
    const restanteC = asignadoC - gastadoC;
    let limiteDiario = 0;
    if (categoria.controlDiario === 'sí' && totalDias > 0) limiteDiario = Math.round(asignadoC / totalDias);
    return { gastado: this.aDecimal(gastadoC), restante: this.aDecimal(restanteC), limiteDiario: this.aDecimal(limiteDiario) };
  },

  calcularResumenDiario(categoria, fechaConsulta, gastosViaje = [], totalDias = 0) {
    if (categoria.controlDiario !== 'sí' || totalDias <= 0) return null;
    const asignadoC = this.aCentavos(categoria.montoAsignado);
    const limiteC = Math.round(asignadoC / totalDias);
    const gastosFecha = gastosViaje.filter(g => g.categoria === categoria.nombre && g.fecha === fechaConsulta);
    const gastadoDiaC = gastosFecha.reduce((acc, g) => acc + this.aCentavos(g.monto), 0);
    const saldoDiaC = limiteC - gastadoDiaC;
    return {
      fecha: fechaConsulta,
      categoria: categoria.nombre,
      limiteDiario: this.aDecimal(limiteC),
      gastadoDelDia: this.aDecimal(gastadoDiaC),
      saldoDelDia: this.aDecimal(saldoDiaC),
      excedeMeta: gastadoDiaC > limiteC ? 'sí' : 'no'
    };
  }
};