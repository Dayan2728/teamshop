//Variable que mantiene el estado visible del carrito
var carritoVisible = false;

//Esperamos que todos los elementos de la página cargen para ejecutar el script
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

function ready(){
    //Agregamos funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(var i=0;i<botonesEliminarItem.length; i++){
        var button = botonesEliminarItem[i];
        button.addEventListener('click',eliminarItemCarrito);
    }

    //Agrego funcionalidad al boton sumar cantidad
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for(var i=0;i<botonesSumarCantidad.length; i++){
        var button = botonesSumarCantidad[i];
        button.addEventListener('click',sumarCantidad);
    }

    //Agrego funcionalidad al boton restar cantidad
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for(var i=0;i<botonesRestarCantidad.length; i++){
        var button = botonesRestarCantidad[i];
        button.addEventListener('click',restarCantidad);
    }

    //Agregamos funcionalidad al boton Agregar al carrito
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for(var i=0; i<botonesAgregarAlCarrito.length;i++){
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    //Agregamos funcionalidad al botón pagar/enviar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click',pagarClicked)
}

// Datos de WhatsApp (REEMPLAZA POR TU NÚMERO)
const NUMERO_WHATSAPP = "+573006009881";
const btnEnviar = document.querySelector('#btnEnviar');
var datoNombre = document.getElementById('datoNombre');
var datoMensaje = document.getElementById('datoMensaje');


//Eliminamos todos los elementos del carrito y enviamos por WhatsApp
function pagarClicked(){
    // Validaciones
    if(!datoNombre.value.trim()){
        alert("Por favor ingresa tu nombre");
        return;
    }

    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount === 0){
        alert("El carrito está vacío");
        return;
    }

    // Construir mensaje completo
    let mensaje = `*📦 PEDIDO - VIVA TEAM SHOP*%0A%0A`;
    mensaje += `*Cliente:* ${datoNombre.value.trim()}%0A%0A`;
    mensaje += `*Productos:*%0A`;

    // Agregar productos del carrito
    var items = document.getElementsByClassName('carrito-item');
    for(var i=0; i<items.length; i++){
        var titulo = items[i].getElementsByClassName('carrito-item-titulo')[0].innerText;
        var precio = items[i].getElementsByClassName('carrito-item-precio')[0].innerText;
        var cantidad = items[i].getElementsByClassName('carrito-item-cantidad')[0].value;
        mensaje += `${i+1}. ${titulo} - ${precio} x${cantidad}%0A`;
    }

    // Agregar total y mensaje adicional
    var total = document.getElementsByClassName('carrito-precio-total')[0].innerText;
    mensaje += `%0A*Total del pedido:* ${total}%0A`;
    if(datoMensaje.value.trim()){
        mensaje += `%0A*Detalles adicionales:* ${datoMensaje.value.trim()}`;
    }

    // Generar URL de WhatsApp (según la API que menciona tu documento)
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP}&text=${mensaje}`;
    btnEnviar.href = urlWhatsApp;

    // Limpiar carrito
    while (carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild)
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

//Función que controla el boton clickeado de agregar al carrito
function agregarAlCarritoClicked(event){
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarItemAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

//Función que hace visible el carrito
function hacerVisibleCarrito(){
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

//Función que agrega un item al carrito
function agregarItemAlCarrito(titulo, precio, imagenSrc){
    var item = document.createElement('div');
    item.classList.add('item'); // Corrección aquí
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //Controlamos que el item no se encuentre en el carrito
    var nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for(var i=0;i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText == titulo){
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    var itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //Agregamos funcionalidades al nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);
    item.getElementsByClassName('restar-cantidad')[0].addEventListener('click', restarCantidad);
    item.getElementsByClassName('sumar-cantidad')[0].addEventListener('click', sumarCantidad);

    //Actualizamos total
    actualizarTotalCarrito();
}

//Aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement; // Corrección aquí
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}

//Resto en uno la cantidad del elemento seleccionado
function restarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = parseInt(selector.getElementsByClassName('carrito-item-cantidad')[0].value);
    cantidadActual--;
    if(cantidadActual >= 1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

//Elimino el item seleccionado del carrito
function eliminarItemCarrito(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    actualizarTotalCarrito();
    ocultarCarrito();
}

//Función que oculta el carrito si no hay elementos
function ocultarCarrito(){
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount == 0){
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;
    
        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

//Actualizamos el total de Carrito
function actualizarTotalCarrito(){
    var carritoItems = document.getElementsByClassName('carrito-item');
    var total = 0;
    for(var i=0; i< carritoItems.length;i++){
        var item = carritoItems[i];
        var precio = parseFloat(item.getElementsByClassName('carrito-item-precio')[0].innerText.replace('$','').replace('.',''));
        var cantidad = parseInt(item.getElementsByClassName('carrito-item-cantidad')[0].value);
        total += (precio * cantidad);
    }
    total = Math.round(total * 100)/100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";
}
