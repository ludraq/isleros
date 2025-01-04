const denominaciones = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100, 50];
            
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
    
            function calcularVenta() {
                const galonaje_inicial = parseFloat(document.getElementById('galonaje_inicial').value) || 0;
                const galonaje_final = parseFloat(document.getElementById('galonaje_final').value) || 0;
                const precio_galon = parseFloat(document.getElementById('precio_galon').value) || 0;
    
                const galonaje_vendido = galonaje_inicial - galonaje_final;
                const total_planilla = galonaje_vendido * precio_galon;
    
                document.getElementById('galonaje_vendido').value = galonaje_vendido.toFixed(2);
                document.getElementById('galonaje_vendido_display').textContent = galonaje_vendido.toFixed(2);
                document.getElementById('total_planilla').value = total_planilla.toFixed(2);
                document.getElementById('total_planilla_display').textContent = formatCOP(total_planilla);
                
                calcularTotales();
            }
    
            function calcularTotales() {
                let total = 0;
                document.querySelectorAll('.cantidad').forEach(input => {
                    const cantidad = parseFloat(input.value) || 0;
                    const denominacion = parseFloat(input.dataset.denominacion);
                    const subtotal = cantidad * denominacion;
                    const subtotalInput = input.parentElement.querySelector('.subtotal');
                    const subtotalDisplay = input.parentElement.querySelector('.subtotal-display');
                    
                    subtotalInput.value = subtotal.toFixed(2);
                    subtotalDisplay.textContent = formatCOP(subtotal);
                    total += subtotal;
                });
    
                document.getElementById('total_denominaciones').value = total.toFixed(2);
                document.getElementById('total_denominaciones_display').textContent = formatCOP(total);
                
                const total_planilla = parseFloat(document.getElementById('total_planilla').value) || 0;
                const diferencia = total - total_planilla;
                document.getElementById('diferencia').value = diferencia.toFixed(2);
                document.getElementById('diferencia_display').textContent = formatCOP(diferencia);
            }
    
            function toggleDenominaciones() {
                const div = document.getElementById('denominaciones');
                div.style.display = div.style.display === 'none' ? 'block' : 'none';
            }