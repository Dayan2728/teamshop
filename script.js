document.addEventListener('DOMContentLoaded', () => {
    // ---- VERIFICACIÓN INICIAL ----
    console.log('JavaScript cargado y ejecutándose.'); // Mensaje para verificar si el JS se carga

    // --- Selectores de elementos del DOM ---
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    const contadorCarrito = document.getElementById('contador-carrito');
    const modalCarrito = document.getElementById('modal-carrito');
    const verCarritoBtn = document.getElementById('ver-carrito-btn');
    const closeButton = document.querySelector('.close-button'); 
    const itemsCarritoDiv = document.getElementById('items-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    const realizarPedidoWhatsappBtn = document.getElementById('realizar-pedido-whatsapp');

    // Array para almacenar los productos en el carrito
    let carrito = [];

    // --- Funciones del Carrito ---

    /**
     * Actualiza el número total de ítems en el icono del carrito en el encabezado.
     */
    function actualizarContadorCarrito() {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = totalItems;
    }

    /**
     * Renderiza (dibuja) la lista de productos dentro del modal del carrito y actualiza el total.
     */
    function renderizarCarrito() {
        itemsCarritoDiv.innerHTML = ''; // Limpiar el contenido actual del carrito

        let total = 0; // Inicializa el total del pedido

        if (carrito.length === 0) {
            itemsCarritoDiv.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            carrito.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item-en-carrito'); // Para aplicar estilos CSS si existen
                // Usa toLocaleString('es-CO') para formatear el número como moneda colombiana
                itemDiv.innerHTML = `
                    <p>${item.nombre} x ${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-CO')} COP</p>
                    <button class="btn-eliminar-item" data-id="${item.id}">Eliminar</button>
                `;
                itemsCarritoDiv.appendChild(itemDiv);
                total += item.precio * item.cantidad;
            });
        }
        totalCarritoSpan.textContent = `$${total.toLocaleString('es-CO')} COP`;
    }

    /**
     * Agrega un producto al carrito o incrementa su cantidad si ya existe.
     * @param {Object} producto - El objeto producto a agregar (debe tener id, nombre, precio, cantidad).
     */
    function agregarAlCarrito(producto) {
        const itemExistente = carrito.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += producto.cantidad;
        } else {
            carrito.push(producto);
        }
        actualizarContadorCarrito();
        alert(`Has agregado ${producto.cantidad} de ${producto.nombre} al carrito.`);
    }

    /**
     * Elimina un producto específico del carrito.
     * @param {string} productId - El ID del producto a eliminar.
     */
    function eliminarDelCarrito(productId) {
        carrito = carrito.filter(item => item.id !== productId);
        actualizarContadorCarrito();
        renderizarCarrito();
    }

    // --- Event Listeners (Escuchadores de eventos para interactividad) ---

    // 1. Manejar clics en TODOS los botones "Agregar al Carrito"
    botonesAgregar.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Botón "Agregar al Carrito" clicado.'); // Verificación para este evento
            const productId = event.target.dataset.id;
            const productName = event.target.dataset.nombre;
            const productPrice = parseFloat(event.target.dataset.precio);
            
            // Obtener el input de cantidad. Asumimos que está justo antes del botón.
            // Es importante que no tenga un id duplicado para que previousElementSibling funcione correctamente.
            const cantidadInput = event.target.previousElementSibling;
            let cantidad = 1; // Cantidad por defecto si no se encuentra el input

            if (cantidadInput && cantidadInput.classList.contains('cantidad-producto')) {
                cantidad = parseInt(cantidadInput.value);
            } else {
                console.warn('Input de cantidad no encontrado o no tiene la clase esperada. Usando cantidad por defecto (1).');
            }
            
            if (isNaN(cantidad) || cantidad <= 0) {
                alert('La cantidad debe ser un número válido mayor que 0.');
                return; // Detiene la función si la cantidad no es válida
            }

            agregarAlCarrito({
                id: productId,
                nombre: productName,
                precio: productPrice,
                cantidad: cantidad
            });
        });
    });

    // 2. Abrir el Modal del Carrito al hacer clic en el icono de la bolsa de compras
    verCarritoBtn.addEventListener('click', (event) => {
        event.preventDefault(); 
        renderizarCarrito();
        modalCarrito.classList.add('show');
        console.log('Modal del carrito abierto.'); // Verificación para este evento
    });

    // 3. Cerrar el Modal del Carrito al hacer clic en la 'X' (close-button)
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modalCarrito.classList.remove('show');
            console.log('Modal del carrito cerrado con la "X".'); // Verificación
        });
    }

    // 4. Cerrar el Modal si se hace clic en el fondo oscuro
    window.addEventListener('click', (event) => {
        if (event.target === modalCarrito) {
            modalCarrito.classList.remove('show');
            console.log('Modal del carrito cerrado haciendo clic fuera.'); // Verificación
        }
    });

    // 5. Manejar clics en el botón "Eliminar" dentro del carrito
    itemsCarritoDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar-item')) {
            const productId = event.target.dataset.id;
            eliminarDelCarrito(productId);
            console.log(`Producto ${productId} eliminado del carrito.`); // Verificación
        }
    });

    // --- Funcionalidad de WhatsApp API para realizar pedido ---
    realizarPedidoWhatsappBtn.addEventListener('click', () => {
        console.log('Botón "Realizar Pedido por WhatsApp" clicado.'); // Verificación
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos antes de realizar un pedido.');
            return;
        }

        let mensajeWhatsApp = "¡Hola! Me gustaría hacer un pedido desde tu tienda en línea de The Luxe Boutique Shop. Aquí está mi lista:\n\n";
        let totalPedido = 0;

        carrito.forEach(item => {
            mensajeWhatsApp += `- ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString('es-CO')} COP\n`;
            totalPedido += item.precio * item.cantidad;
        });

        mensajeWhatsApp += `\nTotal a pagar: $${totalPedido.toLocaleString('es-CO')} COP`;
        mensajeWhatsApp += "\n\nPor favor, confírmame el pedido y los detalles de entrega. ¡Gracias!";

        const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);

        // --- ¡AQUÍ DEBES COLOCAR TU NÚMERO DE TELÉFONO DE WHATSAPP! ---
        const numeroWhatsApp = "573052804631"; // <<<<<<< ¡CAMBIA ESTE NÚMERO POR EL TUYO!

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

        window.open(whatsappUrl, '_blank');

        carrito = [];
        actualizarContadorCarrito();
        renderizarCarrito();
        modalCarrito.classList.remove('show');
        alert('Tu pedido ha sido enviado por WhatsApp. ¡Pronto nos pondremos en contacto contigo!');
    });

    // Inicializa el contador del carrito al cargar la página
    actualizarContadorCarrito();
});


// --- Función para mostrar y actualizar la hora actual ---
function actualizarHora() {
    const elementoHora = document.getElementById('hora-actual');
    if (elementoHora) {
        const fecha = new Date();
        const opcionesFormato = {
            hour: '2-digit',   // Formato de dos dígitos para la hora (ej. 01, 13)
            minute: '2-digit', // Formato de dos dígitos para los minutos (ej. 05, 30)
            second: '2-digit', // Formato de dos dígitos para los segundos (ej. 09, 59)
            hour12: true       // Usar formato AM/PM
        };
        const horaFormateada = fecha.toLocaleTimeString('es-CO', opcionesFormato); // 'es-CO' para el formato colombiano
        elementoHora.textContent = horaFormateada;
    }
}

// Llama a la función una vez al cargar la página
actualizarHora();

// Actualiza la hora cada segundo (1000 milisegundos)
setInterval(actualizarHora, 1000);

// YouTube API Ready
let player; // Variable global para el reproductor de YouTube

// Esta función se llama cuando la API de YouTube está lista
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-bg-player', { // 'youtube-bg-player' es el ID de tu iframe
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo(); // Intentar reproducir (ya estará silenciado por el src)
    // Puedes añadir más lógica aquí si quieres.
}

// Cargar la API de YouTube de forma asíncrona
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Control de volumen (si añades el botón #toggle-music-volume)
const toggleVolumeBtn = document.getElementById('toggle-music-volume');
if (toggleVolumeBtn) {
    toggleVolumeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (player && player.isMuted) { // Si está silenciado
            player.unMute(); // Desilenciar
            toggleVolumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else if (player) { // Si no está silenciado
            player.mute(); // Silenciar
            toggleVolumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}
