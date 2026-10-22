const STORAGE_KEYS = {
  VIAJES: 'asistente_viaje_viajes',
  CATEGORIAS: 'asistente_viaje_categorias',
  GASTOS: 'asistente_viaje_gastos',
  ACTIVIDADES: 'asistente_viaje_actividades'
};

const CAMPOS_CALCULADOS = [
  'presupuestoRestante', 'totalDias', 'gastado', 'restante',
  'limiteDiario', 'gastadoDelDia', 'saldoDelDia', 'excedeMeta'
];

function limpiarCamposCalculados(data) {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(item => limpiarObjeto(item));
  return limpiarObjeto(data);
}

function limpiarObjeto(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const limpio = { ...obj };
  CAMPOS_CALCULADOS.forEach(campo => delete limpio[campo]);
  return limpio;
}

export const storage = {
  guardarViajes(viajes) { localStorage.setItem(STORAGE_KEYS.VIAJES, JSON.stringify(limpiarCamposCalculados(viajes))); },
  obtenerViajes() { const d = localStorage.getItem(STORAGE_KEYS.VIAJES); return d ? JSON.parse(d) : []; },

  guardarCategorias(categorias) { localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(limpiarCamposCalculados(categorias))); },
  obtenerCategorias() { const d = localStorage.getItem(STORAGE_KEYS.CATEGORIAS); return d ? JSON.parse(d) : []; },

  guardarGastos(gastos) { localStorage.setItem(STORAGE_KEYS.GASTOS, JSON.stringify(limpiarCamposCalculados(gastos))); },
  obtenerGastos() { const d = localStorage.getItem(STORAGE_KEYS.GASTOS); return d ? JSON.parse(d) : []; },

  guardarActividades(actividades) { localStorage.setItem(STORAGE_KEYS.ACTIVIDADES, JSON.stringify(limpiarCamposCalculados(actividades))); },
  obtenerActividades() { const d = localStorage.getItem(STORAGE_KEYS.ACTIVIDADES); return d ? JSON.parse(d) : []; },

  limpiarTodo() { Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k)); }
};