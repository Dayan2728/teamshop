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
