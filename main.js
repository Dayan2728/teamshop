/*https://api.whatsapp.com/send?phone=(codigo pais)(codigo de area)(numero sin el 15)&text=*/
/* Espacio : %20  ``*/


/* Traer los inputs */
/* Crear funcion añadiendo el valor correspondiente a la variable mensaje */




function enviar (){
    mensaje = `https://api.whatsapp.com/send?phone=NUMERO&text=${datoNombre.value}%20${datoMensaje.value} `;
    btnEnviar.href= mensaje;
}
