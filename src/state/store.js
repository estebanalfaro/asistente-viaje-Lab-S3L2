import { storage } from '../infra/storage.js';

class Store {
  constructor() {
    const viajesCargados = storage.obtenerViajes();
    this.state = {
      viajes: viajesCargados,
      categorias: storage.obtenerCategorias(),
      gastos: storage.obtenerGastos(),
      actividades: storage.obtenerActividades(),
      viajeActivoId: viajesCargados.length > 0 ? viajesCargados[0].nombre : null
    };
    this.listeners = new Set();
  }

  getState() { return { ...this.state }; }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    
    // Autoselección automática si hay viajes y no hay activo definido
    if (this.state.viajes && this.state.viajes.length > 0 && !this.state.viajeActivoId) {
      this.state.viajeActivoId = this.state.viajes[0].nombre;
    }

    if (partialState.viajes) storage.guardarViajes(this.state.viajes);
    if (partialState.categorias) storage.guardarCategorias(this.state.categorias);
    if (partialState.gastos) storage.guardarGastos(this.state.gastos);
    if (partialState.actividades) storage.guardarActividades(this.state.actividades);
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

export const store = new Store();