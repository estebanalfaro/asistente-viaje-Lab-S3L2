export const validators = {
  validarViaje(viaje, viajesExistentes = []) {
    if (!viaje.nombre || viaje.nombre.trim() === "") {
      return { valido: false, mensaje: "El nombre del viaje no puede estar vacío." };
    }
    if (viaje.fechaFin < viaje.fechaInicio) {
      return { valido: false, mensaje: "La fecha de fin no puede ser anterior a la fecha de inicio." };
    }
    if (Number(viaje.presupuestoGlobal) < 0 || isNaN(viaje.presupuestoGlobal)) {
      return { valido: false, mensaje: "El presupuesto global debe ser un número mayor o igual a cero." };
    }
    return { valido: true };
  },

  validarGasto(gasto, categoriasViaje) {
    const montoNum = Number(gasto.monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      return { valido: false, mensaje: "El monto debe ser mayor que cero y tener máximo dos decimales." };
    }
    // Validación básica de formato de fecha DD-MM-AAAA o estructura válida
    if (!gasto.fecha) {
      return { valido: false, mensaje: "La fecha del gasto es obligatoria y debe tener el formato DD-MM-AAAA." };
    }
    const categoriaExiste = categoriasViaje.some(c => c.nombre === gasto.categoria);
    if (!categoriaExiste) {
      return { valido: false, mensaje: "La categoría seleccionada no existe en este viaje." };
    }
    return { valido: true };
  }
};