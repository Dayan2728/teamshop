// Carrito de compras - Array global para almacenar productos
let carrito = [];

// Función para agregar productos al carrito
function agregarAlCarrito(boton) {
    const item = boton.parentElement;
    const producto = {
        id: item.dataset.id,
        nombre: item.dataset.nombre,
        precio: parseInt(item.dataset.precio),
        cantidad: 1,
        imagen: item.querySelector('.img-item').src
    };

    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(p => p.id === producto.id);
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push(producto);
    }

    // Actualizar visualización del carrito
    actualizarCarrito();
}

// Función para actualizar la vista del carrito y el total
function actualizarCarrito() {
    const contenedorItems = document.getElementById('carritoItems');
    const contenedorTotal = document.querySelector('.carrito-precio-total');
    
    // Limpiar contenido anterior del carrito
    contenedorItems.innerHTML = '';
    let totalGeneral = 0;

    // Recorrer productos del carrito y crear elementos HTML
    carrito.forEach(producto => {
        const subtotal = producto.precio * producto.cantidad;
        totalGeneral += subtotal;

        const itemCarritoHTML = `
            <div class="carrito-item" data-id="${producto.id}">
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
            </div>
        `;

        contenedorItems.innerHTML += itemCarritoHTML;
    });

    // Actualizar total a pagar
    contenedorTotal.textContent = `$${totalGeneral.toLocaleString()}`;
}

// Función para aumentar o disminuir la cantidad de un producto
function cambiarCantidad(idProducto, accion) {
    const producto = carrito.find(p => p.id === idProducto);
    if (!producto) return;

    if (accion === 'sumar') {
        producto.cantidad++;
    } else if (accion === 'restar' && producto.cantidad > 1) {
        producto.cantidad--;
    }

    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(idProducto) {
    carrito = carrito.filter(p => p.id !== idProducto);
    actualizarCarrito();
}

// Función principal para enviar pedido y generar factura por WhatsApp
function enviarPedidoYFactura() {
    // Obtener datos del formulario
    const nombre = document.getElementById('nombreCliente').value.trim();
    const celular = document.getElementById('celularCliente').value.trim();
    const direccion = document.getElementById('direccionCliente').value.trim();
    const datosFactura = document.getElementById('datosFactura').value.trim();
    const comentarios = document.getElementById('comentariosCliente').value.trim();
    const total = document.querySelector('.carrito-precio-total').textContent;

    // Validación de campos obligatorios
    if (!nombre || !celular || !direccion || !datosFactura || carrito.length === 0) {
        alert('⚠️ Por favor completa TODOS los campos obligatorios (*) y agrega productos al carrito.');
        return;
    }

    // Generar número de pedido único (basado en fecha y hora)
    const fechaActual = new Date();
    const numeroPedido = `PED-${fechaActual.getFullYear()}${(fechaActual.getMonth()+1).toString().padStart(2, '0')}${fechaActual.getDate().toString().padStart(2, '0')}-${fechaActual.getHours().toString().padStart(2, '0')}${fechaActual.getMinutes().toString().padStart(2, '0')}`;

    // Construir mensaje estructurado para WhatsApp
    let mensaje = `*📦 PEDIDO Y FACTURA - VIVA TEAM SHOP*%0A%0A`;
    mensaje += `*🔢 NÚMERO DE PEDIDO:* ${numeroPedido}%0A%0A`;
    
    // Sección 1: Datos del cliente
    mensaje += `*👤 DATOS DEL CLIENTE*%0A`;
    mensaje += `• Nombre: ${nombre}%0A`;
    mensaje += `• Celular: ${celular}%0A`;
    mensaje += `• Dirección de entrega: ${direccion}%0A%0A`;

    // Sección 2: Detalles del pedido
    mensaje += `*🛒 DETALLES DEL PEDIDO*%0A`;
    carrito.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre}%0A`;
        mensaje += `   - Cantidad: ${producto.cantidad} unidad(es)%0A`;
        mensaje += `   - Valor unitario: $${producto.precio.toLocaleString()}%0A`;
        mensaje += `   - Subtotal: $${(producto.precio * producto.cantidad).toLocaleString()}%0A%0A`;
    });
    mensaje += `*💵 TOTAL A PAGAR: ${total}*%0A%0A`;

    // Sección 3: Datos para factura
    mensaje += `*📄 DATOS DE FACTURACIÓN*%0A`;
    mensaje += `• Identificación: ${datosFactura}%0A`;
    mensaje += `• Moneda: Pesos Colombianos (COP)%0A`;
    mensaje += `• Concepto: Venta de joyería%0A`;
    mensaje += `• Fecha de emisión: ${fechaActual.toLocaleDateString('es-CO')}%0A%0A`;

    // Sección 4: Observaciones
    mensaje += `*💬 OBSERVACIONES*%0A`;
    mensaje += comentarios || 'Sin observaciones adicionales.%0A%0A';
    mensaje += `*¡Gracias por tu compra! En breve te confirmaremos la entrega y enviaremos la factura formal al correo o número registrado.*`;

    // Abrir WhatsApp con el mensaje generado
    const numeroWhatsApp = '+573006009881'; // Número configurado
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
}
