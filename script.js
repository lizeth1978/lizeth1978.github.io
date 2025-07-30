 const galeria = document.getElementById('galeria');
const input = document.getElementById('busqueda');
const cargarMasBtn = document.getElementById('cargarMas');

let resultados = [];           // IDs de obras encontradas
let cantidadMostrada = 0;      // Cuántas ya mostramos
const cantidadPorPagina = 20;  // Cuántas mostrar por carga

// Evento al escribir en el buscador
input.addEventListener('input', async () => {
  const query = input.value.trim();
  galeria.innerHTML = '';
  cantidadMostrada = 0;

  if (query.length < 3) {
    cargarMasBtn.classList.add('hidden');
    return;
  }

  try {
    const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}`);
    const data = await res.json();
    resultados = data.objectIDs || [];

    if (resultados.length === 0) {
      galeria.innerHTML = "<p>No se encontraron resultados.</p>";
      cargarMasBtn.classList.add('hidden');
      return;
    }

    mostrarResultados(); // Mostrar los primeros resultados
    cargarMasBtn.classList.remove('hidden');
  } catch (error) {
    galeria.innerHTML = "<p>Hubo un error al buscar. Intenta nuevamente.</p>";
    console.error('Error en búsqueda:', error);
  }
});

// Función para mostrar resultados en bloques
async function mostrarResultados() {
  const idsParaMostrar = resultados.slice(cantidadMostrada, cantidadMostrada + cantidadPorPagina);

  for (const id of idsParaMostrar) {
    try {
      const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
      const obra = await res.json();

      if (obra.primaryImageSmall) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${obra.primaryImageSmall}" alt="${obra.title}">
          <h3>${obra.title}</h3>
          <p><strong>${obra.artistDisplayName || 'Artista desconocido'}</strong></p>
        `;

        // Mostrar modal al hacer clic en la tarjeta
        card.addEventListener('click', () => {
          document.getElementById('modal-img').src = obra.primaryImage;
          document.getElementById('modal-title').textContent = obra.title;
          document.getElementById('modal-artist').textContent = `Artista: ${obra.artistDisplayName || 'Desconocido'}`;
          document.getElementById('modal-date').textContent = `Fecha: ${obra.objectDate}`;
          document.getElementById('modal-desc').textContent = `Técnica: ${obra.medium}`;
          document.getElementById('modal').classList.remove('hidden');
        });

        galeria.appendChild(card);
      }
    } catch (error) {
      console.error('Error al cargar obra:', error);
    }
  }

  cantidadMostrada += cantidadPorPagina;

  if (cantidadMostrada >= resultados.length) {
    cargarMasBtn.classList.add('hidden');
  }
}

// Evento para el botón "Cargar más"
cargarMasBtn.addEventListener('click', mostrarResultados);

// Cerrar modal al hacer clic en la "X"
document.getElementById('cerrar').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// Cerrar modal al hacer clic fuera del contenido
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').classList.add('hidden');
  }
});
// === CATALOGO INICIAL ===
const catalogoInicial = [436121, 437853, 459097, 436839, 437329, 436503, 437665, 438815];

async function mostrarCatalogoInicial() {
  for (const id of catalogoInicial) {
    try {
      const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
      const obra = await res.json();

      if (obra.primaryImageSmall) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${obra.primaryImageSmall}" alt="${obra.title}">
          <h3>${obra.title}</h3>
          <p><strong>${obra.artistDisplayName || 'Artista desconocido'}</strong></p>
        `;

        card.addEventListener('click', () => {
          document.getElementById('modal-img').src = obra.primaryImage;
          document.getElementById('modal-title').textContent = obra.title;
          document.getElementById('modal-artist').textContent = `Artista: ${obra.artistDisplayName || 'Desconocido'}`;
          document.getElementById('modal-date').textContent = `Fecha: ${obra.objectDate}`;
          document.getElementById('modal-desc').textContent = `Técnica: ${obra.medium}`;
          document.getElementById('modal').classList.remove('hidden');
        });

        galeria.appendChild(card);
      }
    } catch (error) {
      console.error('Error al cargar obra del catálogo inicial:', error);
    }
  }
}

// Mostrar catálogo cuando se abre la página
window.addEventListener('DOMContentLoaded', mostrarCatalogoInicial);
