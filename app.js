const contenedorCards = document.getElementById("contenedorCards")
const btnFinalizar = document.getElementById("btnFinalizarCompra")

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
                                <button id="botonAgregar${producto.id}" class="btnComprar" >Comprar</button>
                            </div>  
                        </div>
        `
        
        contenedorCards.appendChild(div);

        let btnAgregar = document.getElementById(`botonAgregar${producto.id}`)
        
        btnAgregar.addEventListener('click', ()=>{
            agregarAlCarrito(producto)
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
    tituloCarrito.innerText = 'Productos que agregaste al carrito:'

    let divCarrito = document.createElement('div')
    divCarrito.className = 'carrito'
    divCarrito.id = 'carritoModal'
    divCarrito.innerHTML += `   <p>${producto.nombre}</p>                                  
                                <p id=cantidad${producto.id}>Cantidad: ${producto.cantidad}</p>
                                <p>Precio: $${producto.precio}</p>
                                <button id=botonEliminar${producto.id} class="botonEliminar">Eliminar</i></button>
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
    })
}



btnModal.addEventListener('click', ()=>{/* 
    obtenerStock() */
    modalFinalizarCompra.style.display = ("grid")
    contenedorPrincipal.style.display = ("none")
    btnModal.style.display = ("none")
})
btnCerrarModal.addEventListener('click', ()=>{
    modalFinalizarCompra.style.display = ("none")
    contenedorPrincipal.style.display = ("")
    btnModal.style.display = ("")
})
btnFinalizar.addEventListener('click', ()=>{
    const email = document.getElementById('email')
    const nombre = document.getElementById('nombre')
    const direccion = document.getElementById('direccion')
    if (email.value === "" || nombre.value === "" || direccion.value === ""){
        alert("Debes completar todos los campos para finalizar la compra")
    }else {
        alert("Gracias por tu compra!")
        function cerrar(){
            localStorage.clear()
            contenedorCards.innerHTML='';
            modalFinalizarCompra.style.display = ("none")
            contenedorPrincipal.style.display = ("")
            btnModal.style.display = ("")
            document.getElementById('contenedorCarrito').innerHTML = ''
            carrito = []
            actualizarCarrito()
            nombre.value = ''
            email.value = ''
            direccion.value = ''
        }
        setTimeout(cerrar, 1000);
    }
})


obtenerStock()