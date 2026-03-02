// Datos de productos centralizados
const productos = [
    { id: 1, titulo: "Pulso Oro 18k Lm", precio: 130000, imagen: "img/pulso2.jpg" },
    { id: 2, titulo: "Oso Ingles 18K Lm", precio: 210000, imagen: "img/oso1.jpg" },
    { id: 3, titulo: "Cadena Digen 18K Lm", precio: 180000, imagen: "img/cadena4.jpg" },
    { id: 4, titulo: "Cadena DigeXr 18K Lm", precio: 160000, imagen: "img/cadena6.jpg" },
    { id: 5, titulo: "Pulsera 18K Lm", precio: 85000, imagen: "img/pulso8.jpg" },
    { id: 6, titulo: "Cadena Coz 18K Lm", precio: 110000, imagen: "img/cadena9.jpg" },
    { id: 7, titulo: "Cadena HM 18K Lm", precio: 130000, imagen: "img/cadena10.jpg" },
    { id: 8, titulo: "Cadena Ceuz OR18k", precio: 140000, imagen: "img/cruz5.jpg" },
    { id: 9, titulo: "Pulsera hm 18K", precio: 150000, imagen: "img/pulso11.jpg" }

// Cargar productos en el contenedor
const contenedorProductos = document.getElementById('contenedor-productos');
productos.forEach(producto => {
    const item = document.createElement('div');
    item.className = 'producto-item';
    item.innerHTML = `
        <span class="producto-titulo">${producto.titulo}</span>
        <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen">
        <span class="producto-precio">$${producto.precio.toLocaleString('es-CO')}</span>
        <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
            <i class="fa fa-plus"></i> Agregar al Carrito
        </button>
    `;
    contenedorProductos.appendChild(item);
});

// Variables del carrito
let carrito = [];

// Función agregar al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const itemExistente = carrito.find(i => i.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1 });
    }
    actualizarCarrito();
}

// Actualizar visualización del carrito
function actualizarCarrito() {
    const contenedorItems = document.getElementById('carrito-items');
    contenedorItems.innerHTML = '';
    let subtotal = 0;

    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        subtotal += subtotalItem;

        const itemCarrito = document.createElement('div');
        itemCarrito.className = 'carrito-item';
        itemCarrito.innerHTML = `
            <img src="${item.imagen}" alt="${item.titulo}" class="item-imagen">
            <div class="item-detalles">
                <span>${item.titulo}</span>
                <div class="item-cantidad">
                    <button onclick="cambiarCantidad(${item.id}, -1)"><i class="fa fa-minus"></i></button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id}, 1)"><i class="fa fa-plus"></i></button>
                </div>
                <span class="item-precio">$${subtotalItem.toLocaleString('es-CO')}</span>
            </div>
            <button onclick="eliminarDelCarrito(${item.id})" class="btn-eliminar"><i class="fa fa-trash"></i></button>
        `;
        contenedorItems.appendChild(itemCarrito);
    });

    document.getElementById('carrito-cantidad').textContent = `${carrito.length} productos`;
    document.getElementById('carrito-subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('carrito-total').textContent = `$${subtotal.toLocaleString('es-CO')}`;
}

// Funciones auxiliares del carrito
function cambiarCantidad(idProducto, cambio) {
    const item = carrito.find(i => i.id === idProducto);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad < 1) eliminarDelCarrito(idProducto);
        actualizarCarrito();
    }
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(i => i.id !== idProducto);
    actualizarCarrito();
}
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
];
