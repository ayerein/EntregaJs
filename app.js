const contenedorCards = document.getElementById("contenedorCards")
const btnFinalizar = document.getElementById("btnFinalizarCompra")
const nav = document.getElementById("nav")
const tituloCarrito = document.getElementById("tituloCarrito")

let carrito = []

function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
    if (recuperarLS){
        recuperarLS.forEach(producto => (
            agregarAlCarrito(producto)
        ))
    }
}

function actualizarCarrito(){
    precioFinal.innerText = carrito.reduce((acc,el) => acc + (el.precio * el.cantidad), 0)
}

async function obtenerStock(){
    const respuesta = await fetch ('bbdd.json')
    const data = await respuesta.json()
    mostrarProductos(data)
    recuperar()
}

function mostrarProductos(stock){
    contenedorCards.innerHTML='';

    for (const producto of stock) {
        let div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML += `
                        <div class="card">
                            <div class="imagen">
                                <img src="${producto.img}" alt="">
                            </div>
                            <div class="descripcion">
                                <h4>${producto.nombre}</h4>
                                <p>$${producto.precio}</p>
                                <button id="botonAgregar${producto.id}" class="btn-comprar" >Comprar</button>
                            </div>  
                        </div>
        `
        
        contenedorCards.appendChild(div);

        let btnAgregar = document.getElementById(`botonAgregar${producto.id}`)
        
        btnAgregar.addEventListener('click', ()=>{
            agregarAlCarrito(producto)
            Swal.fire({
                html: '<p>Producto agregado al carrito</p>',
                toast: true,
                width: '25vw',
                position: 'bottom-end',
                timer: 1500,
                showConfirmButton: false,
                background: 'rgb(180, 180, 180, 0.9)'
            })
        })
    }
}

function agregarAlCarrito(producto){
    let repetido = carrito.find(item => item.id == producto.id)
    if (repetido){
        repetido.cantidad = repetido.cantidad + 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id=cantidad${repetido.id}>Cantidad: ${repetido.cantidad}</p>`
        actualizarCarrito()
    }  else {
        carrito.push(producto)
        actualizarCarrito()
        crearCarrito(producto)
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    
}

function crearCarrito(producto){
    let divCarrito = document.createElement('div')
    divCarrito.className = 'carrito'
    divCarrito.id = 'carrito-modal'
    divCarrito.innerHTML += `   <p>${producto.nombre}</p>                                  
    <p id=cantidad${producto.id}>Cantidad: ${producto.cantidad}</p>
    <p>Precio: $${producto.precio}</p>
    <button id=botonEliminar${producto.id} class="boton-eliminar">Eliminar</i></button>
    `
    contenedorCarrito.appendChild(divCarrito)
    let btnEliminar = document.getElementById(`botonEliminar${producto.id}`)
    btnEliminar.addEventListener('click', ()=>{
        producto.cantidad = producto.cantidad - 1
        document.getElementById(`cantidad${producto.id}`).innerHTML = `<p id=cantidad${producto.id}>Cantidad: ${producto.cantidad}</p>`
        actualizarCarrito()
        if (producto.cantidad <=0){
            btnEliminar.parentElement.remove()
            carrito = carrito.filter(elemento => elemento.id != producto.id)
            if (carrito == ""){
                tituloCarrito.innerText = 'Tu carrito esta vacio'
            }
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito))
        Swal.fire({
            html: '<p>Producto eliminado</p>',
            toast: true,
            width: '25vw',
            position: 'bottom-end',
            timer: 1500,
            showConfirmButton: false,
                background: 'rgb(180, 180, 180, 0.9)'
        })
        
    })
}



btnModal.addEventListener('click', ()=>{
    modalFinalizarCompra.style.display = ("grid")
    contenedorPrincipal.style.display = ("none")
    btnModal.style.display = ("none")
    nav.style.display = ("none")
})
btnCerrarModal.addEventListener('click', ()=>{
    modalFinalizarCompra.style.display = ("none")
    contenedorPrincipal.style.display = ("")
    btnModal.style.display = ("")
    nav.style.display = ("flex")
})
btnFinalizar.addEventListener('click', ()=>{
    const email = document.getElementById('email')
    const nombre = document.getElementById('nombre')
    const direccion = document.getElementById('direccion')
    if (email.value === "" || nombre.value === "" || direccion.value === ""){
        Swal.fire({
            icon: 'error',
            html:  '<p>Debes rellenar los datos para el envio</p>',
            background: 'rgb(0, 0, 0, 0.8)',
            confirmButtonColor: 'rgb(134, 134, 134, 0.2)'
        })
    }else {
        Swal.fire({
            icon: 'success',
            html:  '<p>Gracias por tu compra</p>',
            background: 'rgb(0, 0, 0, 0.8)',
            showConfirmButton: false,
            confirmButtonColor: 'rgb(134, 134, 134, 0.2)',
            timer: 2000,
        })
        function cerrar(){
            localStorage.clear()
            contenedorCards.innerHTML='';
            modalFinalizarCompra.style.display = ("none")
            contenedorPrincipal.style.display = ("")
            btnModal.style.display = ("")
            document.getElementById('contenedorCarrito').innerHTML = ''
            nav.style.display = ("flex")
            carrito = []
            actualizarCarrito()
            nombre.value = ''
            email.value = ''
            direccion.value = ''
            obtenerStock()
        }
        setTimeout(cerrar, 2000);
    }
})


obtenerStock()