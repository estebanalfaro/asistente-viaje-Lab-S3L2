export const CATEGORIAS_PREDEFINIDAS = [
  { nombre: 'Hospedaje', controlDiario: 'no', montoAsignado: 0 },
  { nombre: 'Tiquetes', controlDiario: 'no', montoAsignado: 0 },
  { nombre: 'Transporte', controlDiario: 'sí', montoAsignado: 0 },
  { nombre: 'Actividades', controlDiario: 'no', montoAsignado: 0 },
  { nombre: 'Comida', controlDiario: 'sí', montoAsignado: 0 }
];

export const catalogo = {
  obtenerCategoriasPorDefecto() { return CATEGORIAS_PREDEFINIDAS.map(c => ({ ...c })); },
  esCategoriaValida(n) { return CATEGORIAS_PREDEFINIDAS.some(c => c.nombre === n); },
  obtenerControlDiario(n) { const c = CATEGORIAS_PREDEFINIDAS.find(x => x.nombre === n); return c ? c.controlDiario : null; }
};