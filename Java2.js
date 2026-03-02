// Función principal para procesar el pedido
function procesarPedido() {
    // Obtener datos del cliente
    const nombre = document.getElementById('cliente-nombre').value;
    const correo = document.getElementById('cliente-correo').value;
    const telefono = document.getElementById('cliente-telefono').value;
    const mensaje = document.getElementById('cliente-mensaje').value;

    // Validar carrito y datos
    if (carrito.length === 0) {
        alert('El carrito está vacío!');
        return;
    }

    // Generar contenido de la factura
    const fecha = new Date().toLocaleString('es-CO');
    let itemsFactura = '';
    let total = 0;

    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        total += subtotalItem;
        itemsFactura += `
            <tr>
                <td>${item.titulo}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio.toLocaleString('es-CO')}</td>
                <td>$${subtotalItem.toLocaleString('es-CO')}</td>
            </tr>
        `;
    });

    const contenidoFactura = `
        <h2>FACTURA - Viva Team Shop</h2>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Mensaje:</strong> ${mensaje || 'Sin mensaje adicional'}</p>
        <table border="1" cellpadding="8" cellspacing="0">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>${itemsFactura}</tbody>
            <tfoot>
                <tr>
                    <td colspan="3"><strong>TOTAL</strong></td>
                    <td><strong>$${total.toLocaleString('es-CO')}</strong></td>
                </tr>
            </tfoot>
        </table>
        <p>Gracias por tu compra!</p>
    `;

    // Enviar factura por EmailJS (a tienda y cliente)
    enviarFacturaPorEmailJS(nombre, correo, contenidoFactura);

    // Notificar al WhatsApp de la tienda
    notificarTiendaPorWhatsApp(nombre, telefono, total, fecha);
}

// Función enviar factura con EmailJS
function enviarFacturaPorEmailJS(nombreCliente, correoCliente, contenido) {
    const templateParams = {
        nombre_cliente: nombreCliente,
        correo_cliente: correoCliente,
        correo_tienda: 'correo_tienda@ejemplo.com', // Reemplaza con correo de la tienda
        contenido_factura: contenido
    };

    emailjs.send('TU_SERVICIO_ID', 'TU_PLANTILLA_ID', templateParams)
        .then((response) => {
            console.log('Factura enviada por correo:', response.status, response.text);
        }, (error) => {
            console.error('Error al enviar factura:', error);
            alert('Hubo un error al enviar la factura por correo, pero se notificó al WhatsApp.');
        });
}

// Función notificar tienda por WhatsApp
function notificarTiendaPorWhatsApp(nombreCliente, telefonoCliente, totalPedido, fechaPedido) {
    const mensajeWhatsApp = `
        📋 NUEVO PEDIDO - Viva Team Shop
        Fecha: ${fechaPedido}
        Cliente: ${nombreCliente}
        Teléfono: ${telefonoCliente}
        Total: $${totalPedido.toLocaleString('es-CO')}
        📩 Factura enviada al correo de la tienda y al cliente.
    `.replace(/\n/g, '%0A'); // Formatear para URL

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+573006009881&text=${mensajeWhatsApp}`;
    window.open(urlWhatsApp, '_blank');

    // Reiniciar carrito y formulario
    carrito = [];
    actualizarCarrito();
    document.getElementById('formulario-cliente').reset();
    alert('Pedido procesado! Se ha notificado al WhatsApp de la tienda y se envió la factura por correo.');
}
