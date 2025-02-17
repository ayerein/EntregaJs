const contenedorPrincipal = document.getElementById("contenedorPrincipal")


async function obtenerStock(){
    const respuesta = await fetch ('bbdd.json')
    const data = await respuesta.json()
    mostrarProductos(data)
}

function mostrarProductos(stock){
    contenedorPrincipal.innerHTML='';

    for (const producto of stock) {
        console.log("holi")
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
        
        contenedorPrincipal.appendChild(div);

        let btnAgregar = document.getElementById(`botonAgregar${producto.id}`)
        
        btnAgregar.addEventListener('click', ()=>{
            console.log(producto)
        })
    }
}



obtenerStock()