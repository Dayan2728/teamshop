// DATOS DE PRODUCTOS (AJUSTA LAS RUTAS DE IMÁGENES)
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

// CARRITO
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// CARGAR PRODUCTOS CUANDO CARGUE LA PÁGINA
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarrito();
});

// FUNCIÓN PARA CARGAR PRODUCTOS
function cargarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'item';
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}" class="img-item">
            <span class="titulo-item">${producto.titulo}</span>
            <span class="precio-item">$${producto.precio.toLocaleString('es-CO')}</span>
            <button class="boton-item" onclick="agregarAlCarrito(${producto.id})">
                <i class="fa-solid fa-plus"></i> Agregar
            </button>
        `;
        contenedor.appendChild(item);
    });
}

// AGREGAR AL CARRITO
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    alert(`${producto.titulo} agregado al carrito!`);
}

// ACTUALIZAR CARRITO
function actualizarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const subtotal = document.getElementById('subtotal');
    const total = document.getElementById('total');
    let suma = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; padding:20px;">El carrito está vacío</p>';
        subtotal.textContent = '$0';
        total.textContent = '$0';
        return;
    }

    contenedor.innerHTML = '';
    carrito.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'carrito-item';
        item.style.position = 'relative';

        const precioTotal = producto.precio * producto.cantidad;
        suma += precioTotal;

        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <div>
                <span class="carrito-item-titulo">${producto.titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus" onclick="cambiarCantidad(${producto.id}, -1)"></i>
                    <input
