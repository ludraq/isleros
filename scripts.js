const denominaciones = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];
let contadorSurtidores = 0;
function formatCOP(number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
}
const container = document.getElementById('denominaciones_container');
denominaciones.forEach(den => {
  const div = document.createElement('div');
  div.className = 'form-group';
  div.innerHTML = `
                <label>Billetes de ${den.toLocaleString()}:</label>
                <input type="number" class="cantidad" data-denominacion="${den}" onchange="calcularTotales()">
                <input type="number" class="subtotal" readonly>
                <div class="display-value subtotal-display"></div>
            `;
  container.appendChild(div);
});
function agregarSurtidor() {
  contadorSurtidores++;
  const surtidorDiv = document.createElement('div');
  surtidorDiv.className = 'surtidor';
  surtidorDiv.id = `surtidor_${contadorSurtidores}`;
  surtidorDiv.innerHTML = `
        <div class="surtidor-header">
            <h2>Surtidor ${contadorSurtidores}</h2>
            <button class="remove-surtidor-btn" onclick="quitarSurtidor(${contadorSurtidores})">
                Quitar Surtidor
            </button>
        </div>
        <div class="mangueras-grid">
            ${[1, 2, 3, 4].map(n => `
                <button class="manguera-btn" onclick="toggleManguera('surtidor${contadorSurtidores}_manguera${n}')">
                    Manguera ${n}
                </button>
                <div id="surtidor${contadorSurtidores}_manguera${n}" class="manguera-container container">
                    <div class="form-group">
                        <label>Galonaje Inicial:</label>
                        <input type="number" id="galonaje_inicial_${contadorSurtidores}_${n}" 
                            onchange="calcularVentaManguera(${contadorSurtidores}, ${n})" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Galonaje Final:</label>
                        <input type="number" id="galonaje_final_${contadorSurtidores}_${n}" 
                            onchange="calcularVentaManguera(${contadorSurtidores}, ${n})" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Galonaje Vendido:</label>
                        <input type="number" id="galonaje_vendido_${contadorSurtidores}_${n}" readonly>
                        <div class="display-value" id="galonaje_vendido_display_${contadorSurtidores}_${n}"></div>
                    </div>
                    <div class="form-group">
                        <label>Precio por Galón (COP):</label>
                        <input type="number" id="precio_galon_${contadorSurtidores}_${n}" 
                            onchange="calcularVentaManguera(${contadorSurtidores}, ${n})">
                    </div>
                    <div class="form-group">
                        <label>Total Planilla:</label>
                        <input type="number" id="total_planilla_${contadorSurtidores}_${n}" readonly>
                        <div class="display-value" id="total_planilla_display_${contadorSurtidores}_${n}"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
  document.getElementById('surtidores').appendChild(surtidorDiv);
}
function toggleManguera(id) {
  const div = document.getElementById(id);
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
}
function calcularVentaManguera(surtidor, manguera) {
  const galonaje_inicial = parseFloat(document.getElementById(`galonaje_inicial_${surtidor}_${manguera}`).value) || 0;
  const galonaje_final = parseFloat(document.getElementById(`galonaje_final_${surtidor}_${manguera}`).value) || 0;
  const precio_galon = parseFloat(document.getElementById(`precio_galon_${surtidor}_${manguera}`).value) || 0;
  const galonaje_vendido = galonaje_final - galonaje_inicial;
  const total_planilla = galonaje_vendido * precio_galon;
  document.getElementById(`galonaje_vendido_${surtidor}_${manguera}`).value = galonaje_vendido.toFixed(2);
  document.getElementById(`galonaje_vendido_display_${surtidor}_${manguera}`).textContent = galonaje_vendido.toFixed(2);
  document.getElementById(`total_planilla_${surtidor}_${manguera}`).value = total_planilla.toFixed(2);
  document.getElementById(`total_planilla_display_${surtidor}_${manguera}`).textContent = formatCOP(Math.floor(total_planilla));
  calcularTotalGeneral();
}
function calcularTotalGeneral() {
  let total = 0;
  for (let s = 1; s <= contadorSurtidores; s++) {
    for (let m = 1; m <= 4; m++) {
      const totalPlanilla = parseFloat(document.getElementById(`total_planilla_${s}_${m}`)?.value || 0);
      total += totalPlanilla;
    }
  }
  document.getElementById('total_general').value = total.toFixed(2);
  document.getElementById('total_general_display').textContent = formatCOP(Math.floor(total));
  calcularTotales();
}
function calcularTotales() {
  let totalEfectivo = 0;
  document.querySelectorAll('.cantidad').forEach(input => {
    const cantidad = parseFloat(input.value) || 0;
    const denominacion = parseFloat(input.dataset.denominacion);
    const subtotal = cantidad * denominacion;
    const subtotalInput = input.parentElement.querySelector('.subtotal');
    const subtotalDisplay = input.parentElement.querySelector('.subtotal-display');
    subtotalInput.value = subtotal.toFixed(2);
    subtotalDisplay.textContent = formatCOP(Math.floor(subtotal));
    totalEfectivo += subtotal;
  });
  const totalBaucher = parseFloat(document.getElementById('total_baucher').dataset.value) || 0;
  const totalTransferencias = parseFloat(document.getElementById('total_transferencias').dataset.value) || 0;
  const totalBonos = parseFloat(document.getElementById('total_bonos').dataset.value) || 0;
  const totalCreditos = parseFloat(document.getElementById('total_creditos').dataset.value) || 0;
  document.getElementById('total_baucher_display').textContent = formatCOP(Math.floor(totalBaucher));
  document.getElementById('total_transferencias_display').textContent = formatCOP(Math.floor(totalTransferencias));
  document.getElementById('total_bonos_display').textContent = formatCOP(Math.floor(totalBonos));
  document.getElementById('total_creditos_display').textContent = formatCOP(Math.floor(totalCreditos));
  const total = totalEfectivo + totalBaucher + totalTransferencias + totalBonos + totalCreditos;
  document.getElementById('total_denominaciones').value = total.toFixed(2);
  document.getElementById('total_denominaciones_display').textContent = formatCOP(Math.floor(total));
  const total_general = parseFloat(document.getElementById('total_general').value) || 0;
  const diferencia = total - total_general;
  document.getElementById('diferencia').value = diferencia.toFixed(2);
  document.getElementById('diferencia_display').textContent = formatCOP(Math.floor(diferencia));
  if (diferencia === 0 && precioCombustible > 0) {
    alert('¡La planilla quedó cuadrada!');
  }
}
function toggleDenominaciones() {
  const div = document.getElementById('denominaciones');
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
}
function quitarSurtidor(surtidorNum) {
  const surtidor = document.getElementById(`surtidor_${surtidorNum}`);
  if (surtidor) {
    surtidor.remove();
    calcularTotalGeneral();
  }
}
function toggleOtrosPagos() {
  const div = document.getElementById('otros_pagos');
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
}
function procesarPagoInput(input) {
  let value = input.value.replace(/[^\d.]/g, '');
  const numericValue = parseFloat(value.replace(/\./g, '')) || 0;
  input.dataset.value = numericValue;
  input.value = formatCOP(numericValue);
  calcularTotales();
}
agregarSurtidor();
