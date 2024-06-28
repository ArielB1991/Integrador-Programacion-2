//Definimos la clase y sus propiedades
class Producto {
  constructor(imagen, titulo, precio, id, cantidad) {
    this.imagen = imagen;
    this.titulo = titulo;
    this.precio = precio;
    this.id = id;
    this.cantidad = cantidad;
  }
}
// Clase propiedad y metodo que pushea hacia productoNuevo
class BaseProductos {
  constructor(productos) {
    this.productos = productos;
  }
  agregar(productoNuevo) {
    this.productos.push(productoNuevo);
  }
}

//Clase carrito con sus propiedades  inicializando en caso de descuentos en 0
class Carrito {
  constructor(productoSeleccionado) {
    this.productoSeleccionado = productoSeleccionado;
    this.descuento = 0;
  }
  //Metodo pushear hacia productoNuevo
  agregar(productoNuevo) {
    this.productoSeleccionado.push(productoNuevo);
  }
  //metodo para aplicar porcentaje y dar el total
  aplicarDescuento(porcentaje) {
    this.descuento = porcentaje; // Establecer el porcentaje de descuento
    this.actualizarTotal();
  }
  //Logica del descuento
  actualizarTotal() {
    const total = this.productoSeleccionado.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
    //Logica del descuento
    const totalConDescuento = total * (1 - this.descuento / 100);
    document.getElementById(
      "total"
    ).innerText = `Total: $${totalConDescuento.toFixed(2)}`;
  }
}

const listaProductos = document.querySelector("#lista-productos");
const contenedorCarrito = document.querySelector("#lista-carrito");
const vaciarCarro = document.querySelector("#vaciar-carrito");

let articulosCarrito = new Carrito([]);
let base = new BaseProductos([]);

// Base de datos simulada
function baseSimulada() {
  let productosSimulados = [
    new Producto(
      "img/Teclado-Gamer-Redragon-K616-Fizz-Rgb-Pro-Negro-Rojo_45905_1.jpeg",
      "Teclado mecanico Dagger",
      4500,
      1,
      0
    ),
    new Producto(
      "img/Redragon-Teclado-mec-diti.jpg_q50-600x600.jpg",
      "Teclado mecanico Strange",
      8000,
      2,
      15
    ),
    new Producto(
      "img/mouseScout.jpeg",
      "Mouse gamer rgb optico Scout",
      5000,
      3,
      40
    ),
    new Producto("img/teclado3.webp", "Teclado membrana Slide", 2000, 4, 0),
    new Producto(
      "img/mouse-gamer-rgb_41112_1.jpeg",
      "Mouse gamer rgb optico Lizard",
      5000,
      5,
      15
    ),
    new Producto(
      "img/mouse-bluetooth-inalambrico_39620_1.jpeg",
      "Mouse inalambrico gamer Dystop",
      11000,
      6,
      30
    ),
    new Producto(
      "img/combo.jpeg",
      "Combo kit Teclado y Mouse Rouge",
      9500,
      6,
      10
    ),
    new Producto(
      "img/Teclado-Gamer-Redragon-K632-Rgb-Mini-Blanco-Switch-Rojo_46793_1.jpeg",
      "Teclado inalambrico 80% Dannes",
      17000,
      6,
      23
    ),
  ];
  productosSimulados.forEach((producto) => base.agregar(producto));
}

function cargarProducto(productos = base.productos) {
  let html = "";
  let card = document.getElementById("cards");

  productos.forEach((producto, indice) => {
    html += `
            <div class="four columns" indice="${indice}">
                <div class="card">
                    <img src="${producto.imagen}" class="imagen-curso u-full-width">
                    <div class="info-card">
                        <h4>${producto.titulo}</h4>
                        <p class="precio">$${producto.precio}</p>
                        <a href="#" onclick="agregarProducto(${producto.id})" class="u-full-width button-primary button input agregar-carrito" data-id="${producto.id}" id="${producto.id}">Agregar Al Carrito</a>
                    </div>
                </div> <!--.card-->
            </div>
        `;
  });
  card.innerHTML = html;
}

function agregarProducto(id) {
  const foundProducto = base.productos.find((producto) => producto.id === id);

  const foundCarrito = articulosCarrito.productoSeleccionado.findIndex(
    (producto) => producto.id === id
  );

  if (foundCarrito !== -1) {
    articulosCarrito.productoSeleccionado[foundCarrito].cantidad++;
  } else {
    const nuevoProducto = { ...foundProducto, cantidad: 1 };
    articulosCarrito.agregar(nuevoProducto);
  }
  carritoHTML();

  // Mostrar alerta de producto agregado
  Swal.fire({
    icon: "success",
    title: "Producto agregado",
    text: `${foundProducto.titulo} ha sido agregado al carrito.`,
    showConfirmButton: false,
    timer: 1500,
  });
}

function incrementarCantidad(id) {
  const foundCarrito = articulosCarrito.productoSeleccionado.findIndex(
    (producto) => producto.id === id
  );
  if (foundCarrito !== -1) {
    articulosCarrito.productoSeleccionado[foundCarrito].cantidad++;
  }
  carritoHTML();
}

function decrementarCantidad(id) {
  const foundCarrito = articulosCarrito.productoSeleccionado.findIndex(
    (producto) => producto.id === id
  );
  if (
    foundCarrito !== -1 &&
    articulosCarrito.productoSeleccionado[foundCarrito].cantidad > 1
  ) {
    articulosCarrito.productoSeleccionado[foundCarrito].cantidad--;
  } else {
    eliminarProducto(id); // Eliminar el producto si la cantidad llega a 0
  }
  carritoHTML();
}

function carritoHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }

  articulosCarrito.productoSeleccionado.forEach((producto) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><img src="${producto.imagen}" width=100></td>
            <td>${producto.titulo}</td>
            <td>$${producto.precio}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="decrementarCantidad(${producto.id})">-</button>
                ${producto.cantidad}
                <button class="btn btn-sm btn-secondary" onclick="incrementarCantidad(${producto.id})">+</button>
            </td>
            <td>
                <a href="#" onclick="eliminarProducto(${producto.id})" class="borrar-producto" data-id="${producto.id}" id="${producto.id}">X</a>
            </td>
        `;
    contenedorCarrito.appendChild(row);
  });

  articulosCarrito.actualizarTotal();
}

function vaciarCarrito() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
  articulosCarrito.productoSeleccionado = [];
  articulosCarrito.descuento = 0; // Reiniciar el descuento al vaciar el carrito
  carritoHTML();
}

function eliminarProducto(id) {
  articulosCarrito.productoSeleccionado =
    articulosCarrito.productoSeleccionado.filter(
      (producto) => producto.id !== id
    );
  carritoHTML();
}

document.addEventListener("DOMContentLoaded", () => {
  baseSimulada();
  cargarProducto();

  // Obtener referencia al campo de entrada
  const filtroInput = document.getElementById("filtro");

  // Escuchar cambios en el campo de entrada para filtrar productos
  filtroInput.addEventListener("input", () => {
    const filtro = filtroInput.value.toLowerCase().trim();

    // Filtrar productos
    const productosFiltrados = base.productos.filter((producto) =>
      producto.titulo.toLowerCase().includes(filtro)
    );

    // Mostrar productos filtrados
    cargarProducto(productosFiltrados);
  });
});

vaciarCarro.addEventListener("click", vaciarCarrito);

function aplicarDescuento() {
  const codigoPromocional = document
    .getElementById("codigo-promo")
    .value.trim();

  // Simular la validación del código promocional // codigos json
  const validos = {
    DESCUENTO5: 5,
    DESCUENTO10: 10,
    DESCUENTO20: 20,
  };

  if (validos[codigoPromocional] !== undefined) {
    const porcentajeDescuento = validos[codigoPromocional];
    articulosCarrito.aplicarDescuento(porcentajeDescuento);

    Swal.fire({
      icon: "success",
      title: "Descuento aplicado!!",
      text: `Se ha aplicado un ${porcentajeDescuento}% de descuento a su carrito.`,
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Código inválido",
      text: "Codigo invalido.",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
document
  .getElementById("finalizar-compra")
  .addEventListener("click", finalizarCompra);

function finalizarCompra() {
  if (articulosCarrito.productoSeleccionado.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Carrito vacío",
      text: "No hay productos en el carrito para finalizar la compra.",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  let resumen = `<h3>Resumen del Pedido</h3>`;
  articulosCarrito.productoSeleccionado.forEach((producto) => {
    resumen += `<p>Producto: ${producto.titulo}<br>Cantidad: ${
      producto.cantidad
    }<br>Precio unitario: $${producto.precio.toFixed(2)}</p>`;
  });

  const total = articulosCarrito.productoSeleccionado.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const totalConDescuento = total * (1 - articulosCarrito.descuento / 100);
  resumen += `<p><strong>Total: $${totalConDescuento.toFixed(2)}</strong></p>`;

  Swal.fire({
    icon: "success",
    title: "Compra Finalizada",
    html: resumen,
    showConfirmButton: true,
    confirmButtonText: "Aceptar",
  }).then(() => {
    vaciarCarrito(); // Vaciar el carrito después de confirmar la compra
  });
}
