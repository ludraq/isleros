let surtidorCount = 0;
function formatNumber(number) {
  return new Intl.NumberFormat('es-CO').format(number);
}
function unformatNumber(formattedNumber) {
  return parseFloat(formattedNumber.replace(/\./g, '')) || 0;
}
function createMangueraButton(surtidorId, mangueraNum) {
  return `
        <div>
            <button class="manguera-btn" onclick="handleManguera(${surtidorId}, ${mangueraNum})">
                Manguera ${mangueraNum}
            </button>
            <div id="manguera-${surtidorId}-${mangueraNum}-details" class="manguera-details">
                <div class="input-group">
                    <label>Galonaje Inicial:</label>
                    <input type="text" 
                           id="inicial-${surtidorId}-${mangueraNum}"
                           onchange="calcularGalonaje(${surtidorId}, ${mangueraNum})"
                           required>
                </div>
                <div class="input-group">
                    <label>Galonaje Final:</label>
                    <input type="text" 
                           id="final-${surtidorId}-${mangueraNum}"
                           onchange="calcularGalonaje(${surtidorId}, ${mangueraNum})"
                           required>
                </div>
                <div class="input-group">
                    <label>Galonaje Vendido:</label>
                    <input type="number" 
                           id="vendido-${surtidorId}-${mangueraNum}"
                           disabled>
                </div>
                <div class="input-group">
                    <label>Galonaje en Créditos:</label>
                    <input type="number" 
                           id="creditos-${surtidorId}-${mangueraNum}"
                           onchange="calcularTotal(${surtidorId}, ${mangueraNum})"
                           value="0">
                </div>
                <div class="input-group">
                    <label>Galonaje Neto:</label>
                    <input type="number" 
                           id="neto-${surtidorId}-${mangueraNum}"
                           disabled>
                </div>
                <div class="input-group">
                    <label>Precio Combustible:</label>
                    <input type="text" 
                           id="precio-${surtidorId}-${mangueraNum}"
                           onchange="formatearPrecio(${surtidorId}, ${mangueraNum})">
                </div>
                <div class="input-group">
                    <label>Total Manguera:</label>
                    <input type="text" 
                           id="total-${surtidorId}-${mangueraNum}"
                           disabled>
                </div>
            </div>
        </div>
    `;
}
function createSurtidor(id) {
  const surtidorHtml = `
        <div class="surtidor" id="surtidor-${id}">
            <div class="surtidor-header">
                <h2 class="surtidor-title">Surtidor ${id}</h2>
                <button class="delete-surtidor" onclick="deleteSurtidor(${id})">Eliminar</button>
            </div>
            <div class="mangueras-container">
                ${createMangueraButton(id, 1)}
                ${createMangueraButton(id, 2)}
                ${createMangueraButton(id, 3)}
                ${createMangueraButton(id, 4)}
            </div>
        </div>
    `;
  return surtidorHtml;
}
function addSurtidor() {
  surtidorCount++;
  const mainContainer = document.getElementById('main-container');
  mainContainer.insertAdjacentHTML('beforeend', createSurtidor(surtidorCount));
}
function deleteSurtidor(id) {
  const surtidor = document.getElementById(`surtidor-${id}`);
  if (surtidor) {
    surtidor.remove();
    calcularTotalPlanilla();
  }
}
function handleManguera(surtidorId, mangueraNum) {
  const detailsDiv = document.getElementById(`manguera-${surtidorId}-${mangueraNum}-details`);
  const button = event.currentTarget;
  if (detailsDiv.style.display === 'none' || !detailsDiv.style.display) {
    detailsDiv.style.display = 'block';
    button.classList.add('manguera-active');
  } else {
    detailsDiv.style.display = 'none';
    button.classList.remove('manguera-active');
  }
}
function calcularGalonaje(surtidorId, mangueraNum) {
  const inicial = document.getElementById(`inicial-${surtidorId}-${mangueraNum}`).value;
  const final = document.getElementById(`final-${surtidorId}-${mangueraNum}`).value;
  if (inicial && final) {
    const vendido = parseFloat(final) - parseFloat(inicial);
    document.getElementById(`vendido-${surtidorId}-${mangueraNum}`).value = vendido;
    calcularTotal(surtidorId, mangueraNum);
    calcularTotalPlanilla();
  }
}
function formatearPrecio(surtidorId, mangueraNum) {
  const precioInput = document.getElementById(`precio-${surtidorId}-${mangueraNum}`);
  const precio = unformatNumber(precioInput.value);
  precioInput.value = formatNumber(precio);
  calcularTotal(surtidorId, mangueraNum);
  calcularTotalPlanilla();
}
function calcularTotal(surtidorId, mangueraNum) {
  const vendido = parseFloat(document.getElementById(`vendido-${surtidorId}-${mangueraNum}`).value) || 0;
  const creditos = parseFloat(document.getElementById(`creditos-${surtidorId}-${mangueraNum}`).value) || 0;
  const neto = vendido - creditos;
  document.getElementById(`neto-${surtidorId}-${mangueraNum}`).value = neto;
  const precioStr = document.getElementById(`precio-${surtidorId}-${mangueraNum}`).value;
  const precio = unformatNumber(precioStr);
  const total = neto * precio;
  document.getElementById(`total-${surtidorId}-${mangueraNum}`).value = formatNumber(total);
  calcularTotalPlanilla();
}
const denominaciones = {
  billetes: [100000, 50000, 20000, 10000, 5000, 2000],
  monedas: [1000, 500, 200, 100, 50]
};
const otrosMedios = ['Contratos', 'Váuchers', 'Transferencias', 'Bonos'];
function inicializarCuentas() {
  const efectivoContent = document.getElementById('efectivo-content');
  const otrosMediosContent = document.getElementById('otros-medios-content');
  let efectivoHtml = '<h3>Billetes</h3>';
  denominaciones.billetes.forEach(valor => {
    efectivoHtml += createDenominacionInput('billete', valor);
  });
  efectivoHtml += '<h3>Monedas</h3>';
  denominaciones.monedas.forEach(valor => {
    efectivoHtml += createDenominacionInput('moneda', valor);
  });
  efectivoHtml += '<div class="total-efectivo">Total Efectivo: <span id="total-efectivo">COP 0</span></div>';
  efectivoContent.innerHTML = efectivoHtml;
  let otrosMediosHtml = '';
  otrosMedios.forEach(medio => {
    otrosMediosHtml += createOtroMedioInput(medio);
  });
  otrosMediosContent.innerHTML = otrosMediosHtml;
}
function createDenominacionInput(tipo, valor) {
  return `
        <div class="denominacion-container">
            <div class="input-group">
                <label>${formatNumber(valor)}</label>
                <input type="number" 
                       id="${tipo}-${valor}-cantidad" 
                       onchange="calcularDenominacion('${tipo}', ${valor})"
                       min="0">
            </div>
            <div class="input-group">
                <label>Total</label>
                <input type="text" 
                       id="${tipo}-${valor}-total" 
                       disabled>
            </div>
        </div>
    `;
}
function createOtroMedioInput(medio) {
  return `
        <div class="input-group">
            <label>${medio}</label>
            <input type="text" 
                   id="otro-${medio.toLowerCase()}"
                   onchange="formatearOtroMedio('${medio.toLowerCase()}')"
                   placeholder="0">
        </div>
    `;
}
function toggleSection(id) {
  const section = document.getElementById(id);
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}
function calcularDenominacion(tipo, valor) {
  const cantidad = parseInt(document.getElementById(`${tipo}-${valor}-cantidad`).value) || 0;
  const total = cantidad * valor;
  document.getElementById(`${tipo}-${valor}-total`).value = `COP ${formatNumber(total)}`;
  actualizarTotalEfectivo();
}
function formatearOtroMedio(medio) {
  const input = document.getElementById(`otro-${medio}`);
  const valor = unformatNumber(input.value);
  input.value = formatNumber(valor);
  actualizarTotalOtrosMedios();
}
function actualizarTotalEfectivo() {
  let total = 0;
  denominaciones.billetes.forEach(valor => {
    const cantidad = parseInt(document.getElementById(`billete-${valor}-cantidad`).value) || 0;
    total += cantidad * valor;
  });
  denominaciones.monedas.forEach(valor => {
    const cantidad = parseInt(document.getElementById(`moneda-${valor}-cantidad`).value) || 0;
    total += cantidad * valor;
  });
  document.getElementById('total-efectivo').textContent = `COP ${formatNumber(total)}`;
  actualizarDineroTotal();
}
function calcularTotalPlanilla() {
  let total = 0;
  for (let s = 1; s <= surtidorCount; s++) {
    const surtidor = document.getElementById(`surtidor-${s}`);
    if (surtidor) {
      for (let m = 1; m <= 4; m++) {
        const totalInput = document.getElementById(`total-${s}-${m}`);
        if (totalInput && totalInput.value) {
          total += unformatNumber(totalInput.value);
        }
      }
    }
  }
  document.getElementById('total-planilla').value = formatNumber(total);
  actualizarDiferencia();
}
function actualizarTotalOtrosMedios() {
  let total = 0;
  otrosMedios.forEach(medio => {
    const valor = unformatNumber(document.getElementById(`otro-${medio.toLowerCase()}`).value);
    total += valor;
  });
  document.getElementById('total-otros-medios').value = formatNumber(total);
  actualizarDineroTotal();
}
function actualizarDineroTotal() {
  const totalEfectivo = unformatNumber(document.getElementById('total-efectivo').textContent.replace('COP ', ''));
  const totalOtrosMedios = unformatNumber(document.getElementById('total-otros-medios').value);
  const dineroTotal = totalEfectivo + totalOtrosMedios;
  document.getElementById('dinero-total').value = formatNumber(dineroTotal);
  actualizarDiferencia();
}
function actualizarDiferencia() {
  const dineroTotal = unformatNumber(document.getElementById('dinero-total').value);
  const totalPlanilla = unformatNumber(document.getElementById('total-planilla').value);
  const diferencia = dineroTotal - totalPlanilla;
  document.getElementById('diferencia-total').value = formatNumber(diferencia);
  if (diferencia === 0) {
    let hasPrice = false;
    for (let s = 1; s <= surtidorCount; s++) {
      const surtidor = document.getElementById(`surtidor-${s}`);
      if (surtidor) {
        for (let m = 1; m <= 4; m++) {
          const precioInput = document.getElementById(`precio-${s}-${m}`);
          if (precioInput && unformatNumber(precioInput.value) > 0) {
            hasPrice = true;
            break;
          }
        }
      }
      if (hasPrice) break;
    }
    if (hasPrice) {
      showPopup('popup');
    }
  } else if (dineroTotal > totalPlanilla) {
    showPopup('warning-popup');
  }
}
function showPopup(popupId) {
  const popup = document.getElementById(popupId);
  const overlay = document.getElementById('popup-overlay');
  popup.style.display = 'block';
  overlay.style.display = 'block';
  setTimeout(() => {
    closePopup(popupId);
  }, 3000);
}
function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  const overlay = document.getElementById('popup-overlay');
  popup.style.display = 'none';
  overlay.style.display = 'none';
}
document.getElementById('popup-overlay').addEventListener('click', () => {
  closePopup('popup');
  closePopup('warning-popup');
});
addSurtidor();
inicializarCuentas();
