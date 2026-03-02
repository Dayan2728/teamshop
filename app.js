// Carrito de compras - Array global para almacenar productos
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    // Convertimos el ID a string para evitar problemas de tipo
    const productoId = id.toString();
    const productoPrecio = parseInt(precio);

    // Buscamos si el producto ya existe en el carrito
    const productoExistente = carrito.find(p => p.id === productoId);

    if (productoExistente) {
        // Si existe, aumentamos la cantidad
        productoExistente.cantidad += 1;
        alert(`✅ +1 unidad de ${nombre} | Total: ${productoExistente.cantidad}`);
    } else {
        // Si no existe, lo agregamos
        const nuevoProducto = {
            id: productoId,
            nombre: nombre,
            precio: productoPrecio,
            cantidad: 1,
            imagen: imagen
        };
        carrito.push(nuevoProducto);
        alert(`✅ ${nombre} agregado al carrito!`);
    }

    // Forzamos la actualización del carrito
    actualizarCarrito();
}

// Función para actualizar la vista del carrito y el total
function actualizarCarrito() {
    const contenedorItems = document.getElementById('carritoItems');
    const contenedorTotal = document.querySelector('.carrito-precio-total');
    
    // Limpiamos el contenido anterior
    contenedorItems.innerHTML = '';
    let totalGeneral = 0;

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedorItems.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--color-gris-oscuro);">El carrito está vacío</p>`;
        contenedorTotal.textContent = '$0';
        return;
    }

    // Recorremos cada producto del carrito
    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;

        // Creamos el elemento HTML del producto en el carrito
        const itemHTML = document.createElement('div');
        itemHTML.className = 'carrito-item';
        itemHTML.dataset.id = producto.id;

        itemHTML.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="detalles-item">
                <span class="carrito-item-titulo">${producto.nombre}</span>
                <div class="selector-cantidad">
                    <i class="fa fa-minus" onclick="cambiarCantidad('${producto.id}', 'restar')"></i>
                    <input type="text" class="carrito-item-cantidad" value="${producto.cantidad}" readonly>
                    <i class="fa fa-plus" onclick="cambiarCantidad('${producto.id}', 'sumar')"></i>
                </div>
                <span class="carrito-item-precio">$${subtotal.toLocaleString()}</span>
            </div>
            <button class="btn-eliminar" onclick="eliminarProducto('${producto.id}')">
                <i class="fa fa-trash"></i>
            </button>
        `;

        // Agregamos el elemento al contenedor
        contenedorItems.appendChild(itemHTML);
    });

    // Actualizamos el total
    contenedorTotal.textContent = `$${totalGeneral.toLocaleString()}`;
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(idProducto, accion) {
    const producto = carrito.find(p => p.id === idProducto);
    if (!producto) return;

    // Modificamos la cantidad según la acción
    if (accion === 'sumar') {
        producto.cantidad += 1;
    } else if (accion === 'restar' && producto.cantidad > 1) {
        producto.cantidad -= 1;
    } else if (accion === 'restar' && producto.cantidad === 1) {
        // Si la cantidad es 1 y se resta, eliminamos el producto
        eliminarProducto(idProducto);
        return;
    }

    // Actualizamos el carrito
    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(idProducto) {
    const productoIndex = carrito.findIndex(p => p.id === idProducto);
    if (productoIndex === -1) return;

    const nombreProducto = carrito[productoIndex].nombre;
    carrito.splice(productoIndex, 1);
    alert(`❌ ${nombreProducto} eliminado del carrito!`);

    // Actualizamos el carrito
    actualizarCarrito();
}

// Función para enviar pedido y factura
function enviarPedidoYFactura() {
    const nombre = document.getElementById('nombreCliente').value.trim();
    const celular = document.getElementById('celularCliente').value.trim();
    const direccion = document.getElementById('direccionCliente').value.trim();
    const datosFactura = document.getElementById('datosFactura').value.trim();
    const total = document.querySelector('.carrito-precio-total').textContent;

    if (!nombre || !celular || !direccion || !datosFactura || carrito.length === 0) {
        alert('⚠️ Completa todos los campos y agrega productos al carrito');
        return;
    }

    const fechaActual = new Date();
    const numeroPedido = `PED-${fechaActual.getFullYear()}${(fechaActual.getMonth()+1).toString().padStart(2, '0')}${fechaActual.getDate().toString().padStart(2, '0')}-${fechaActual.getHours().toString().padStart(2, '0')}${fechaActual.getMinutes().toString().padStart(2, '0')}`;

    let mensaje = `*📦 PEDIDO Y FACTURA - VIVA TEAM SHOP*%0A%0A`;
    mensaje += `*🔢 NÚMERO DE PEDIDO:* ${numeroPedido}%0A%0A`;
    mensaje += `*👤 DATOS DEL CLIENTE*%0A`;
    mensaje += `• Nombre: ${nombre}%0A`;
    mensaje += `• Celular: ${celular}%0A`;
    mensaje += `• Dirección: ${direccion}%0A%0A`;
    mensaje += `*🛒 DETALLES DEL PEDIDO*%0A`;

    carrito.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre}%0A`;
        mensaje += `   - Cantidad: ${producto.cantidad}%0A`;
        mensaje += `   - Unitario: $${producto.precio.toLocaleString()}%0A`;
        mensaje += `   - Subtotal: $${(producto.precio * producto.cantidad).toLocaleString()}%0A%0A`;
    });

    mensaje += `*💵 TOTAL: ${total}*%0A%0A`;
    mensaje += `*📄 FACTURACIÓN*%0A`;
    mensaje += `• Datos: ${datosFactura}%0A`;
    mensaje += `• Fecha: ${fechaActual.toLocaleDateString('es-CO')}%0A%0A`;
    mensaje += `*¡Gracias por tu compra!*`;

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+573006009881&text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
}

// Inicializamos el carrito al cargar la página
window.onload = function() {
    actualizarCarrito();
};
