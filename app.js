/* ==============================================
   DATOS CENTRALIZADOS DE PRODUCTOS
   ============================================== */
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
];


/* ==============================================
   LÓGICA DEL CARRITO DE COMPRAS
   ============================================== */
// Variables globales del carrito
let carrito = JSON.parse(localStorage.getItem('carritoVivaTeam')) || [];

// Inicializar la tienda al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarrito();
    inicializarEmailJS();
});

// Función para cargar productos dinámicamente
function cargarProductos() {
    const contenedorProductos = document.getElementById('contenedor-productos');
    if (!contenedorProductos) return;

    productos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'producto-item';
        item.innerHTML = `
            <span class="producto-titulo">${producto.titulo}</span>
            <img src="${producto.imagen}" alt="${producto.titulo}" class="producto-imagen" loading="lazy">
            <span class="producto-precio">$${producto.precio.toLocaleString('es-CO')}</span>
            <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                <i class="fa fa-plus"></i> Agregar al Carrito
            </button>
        `;
        contenedorProductos.appendChild(item);
    });
}

// Función para agregar producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return;

    const itemExistente = carrito.find(i => i.id === idProducto);
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(`${producto.titulo} agregado al carrito!`);
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const contenedorItems = document.getElementById('carrito-items');
    const spanCantidad = document.getElementById('carrito-cantidad');
    const spanSubtotal = document.getElementById('carrito-subtotal');
    const spanTotal = document.getElementById('carrito-total');

    if (!contenedorItems || !spanCantidad || !spanSubtotal || !spanTotal) return;

    contenedorItems.innerHTML = '';
    let subtotal = 0;

    if (carrito.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; color:#666; padding:20px 0;">El carrito está vacío</p>';
        spanCantidad.textContent = '0 productos';
        spanSubtotal.textContent = '$0';
        spanTotal.textContent = '$0';
        return;
    }

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

    spanCantidad.textContent = `${carrito.reduce((acc, item) => acc + item.cantidad, 0)} unidades`;
    spanSubtotal.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    spanTotal.textContent = `$${subtotal.toLocaleString('es-CO')}`;
}

// Función para cambiar cantidad de un producto
function cambiarCantidad(idProducto, cambio) {
    const item = carrito.find(i => i.id === idProducto);
    if (!item) return;

    item.cantidad += cambio;
    if (item.cantidad < 1) {
        eliminarDelCarrito(idProducto);
        return;
    }

    guardarCarrito();
    actualizarCarrito();
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(idProducto) {
    const producto = carrito.find(i => i.id === idProducto);
    if (!producto) return;

    carrito = carrito.filter(i => i.id !== idProducto);
    guardarCarrito();
    actualizarCarrito();
    mostrarNotificacion(`${producto.titulo} eliminado del carrito!`);
}

// Función para guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carritoVivaTeam', JSON.stringify(carrito));
}

// Función auxiliar de notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.position = 'fixed';
    notificacion.style.top = '20px';
    notificacion.style.left = '50%';
    notificacion.style.transform = 'translateX(-50%)';
    notificacion.style.background = '#333';
    notificacion.style.color = '#fff';
    notificacion.style.padding = '10px 20px';
    notificacion.style.borderRadius = '5px';
    notificacion.style.zIndex = '200';
    notificacion.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transition = 'opacity 0.5s ease';
        setTimeout(() => document.body.removeChild(notificacion), 500);
    }, 3000);
}


/* ==============================================
   LÓGICA DE PEDIDO Y FACTURA (EmailJS + WhatsApp)
   ============================================== */
// Inicializar EmailJS
function inicializarEmailJS() {
    emailjs.init('TU_CLAVE_PUBLICA_EMAILJS'); // REEMPLAZA CON TU CLAVE PÚBLICA
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
        <table border="1" cellpadding="8" cellspacing="0" style="width:100%; margin:15px 0;">
            <thead>
                <tr style="background:#d4af37; color:#fff;">
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>${itemsFactura}</tbody>
            <tfoot>
                <tr style="background:#f0f0f0;">
                    <td colspan="3"><strong>TOTAL</strong></td>
                    <td><strong>$${total.toLocaleString('es-CO')}</strong></td>
                </tr>
            </tfoot>
        </table>
        <p>Gracias por tu compra! 🛍️</p>
    `;

    // Enviar factura por EmailJS
    enviarFacturaPorEmailJS(nombre, correo, contenidoFactura);

    // Notificar al WhatsApp de la tienda
    notificarTiendaPorWhatsApp(nombre, telefono, total, fecha);
}

// Función enviar factura con EmailJS
function enviarFacturaPorEmailJS(nombreCliente, correoCliente, contenido) {
    const templateParams = {
        nombre_cliente: nombreCliente,
        correo_cliente: correoCliente,
        correo_tienda: 'correo_tienda@ejemplo.com', // REEMPLAZA CON TU CORREO
        contenido_factura: contenido
    };

    emailjs.send('TU_SERVICIO_ID', 'TU_PLANTILLA_ID', templateParams) // REEMPLAZA CON TUS DATOS DE EMAILJS
        .then((response) => {
            console.log('Factura enviada por correo:', response.status, response.text);
            mostrarNotificacion('Factura enviada a tu correo!');
        }, (error) => {
            console.error('Error al enviar factura:', error);
            mostrarNotificacion('Error al enviar factura, pero se notificó al WhatsApp.');
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
    `.replace(/\n/g, '%0A');

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+573006009881&text=${mensajeWhatsApp}`; // REEMPLAZA CON TU NÚMERO
    window.open(urlWhatsApp, '_blank');

    // Reiniciar carrito y formulario
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    document.getElementById('formulario-cliente').reset();
}
