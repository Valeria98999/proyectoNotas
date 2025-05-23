import API_BASE_URL from './config.js';
 // Menú hamburguesa
 document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.getElementById("nav-list");
    const closeMenu = document.getElementById("close-menu");

    menuToggle.addEventListener("click", () => {
        navList.style.display = navList.style.display === "block" ? "none" : "block";
    });

    closeMenu.addEventListener("click", () => {
        navList.style.display = "none";
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    const body = document.body; 

    // Carga los escritos inactivos al cargar la página
    await cargarEscritosInactivos();

    // Función para mostrar la ventana emergente de activación
    function mostrarMensajeActivacion(mensaje) {
        const fondoOscuro = document.createElement('div');
        fondoOscuro.className = 'fondo-oscuro-activar';

        const ventanaEmergente = document.createElement('div');
        ventanaEmergente.className = 'ventana-emergente-activar';
        ventanaEmergente.innerHTML = `<p>${mensaje}</p>`;

        body.appendChild(fondoOscuro);
        body.appendChild(ventanaEmergente);

        // Desaparecer después de 4 segundos
        setTimeout(() => {
            ventanaEmergente.remove();
            fondoOscuro.remove();
        }, 3000);
    }

    // Función principal para cargar los escritos inactivos
    async function cargarEscritosInactivos() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/escritos/inactivos`);
            const escritos = await response.json();
            renderizarTabla(escritos);
        } catch (error) {
            console.error('Error al obtener los escritos:', error);
            alert('No se pudieron cargar los escritos.');
        }
    }

    // Renderiza los datos en la tabla HTML
    function renderizarTabla(escritos) {
        const tablaBody = document.getElementById('tabla-escritos-body');
        tablaBody.innerHTML = '';

        escritos.forEach(escrito => {
            const fila = document.createElement('tr');
            const fechaFormateada = new Date(escrito.fecha).toLocaleDateString();

            fila.innerHTML = `
                <td>${escrito.nombre}</td>
                <td>${fechaFormateada}</td>
                <td>${escrito.nota}</td>
                <td>${escrito.nombreCompleto || 'Desconocido'}</td>
                <td>${escrito.publicado ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn-activar" data-id="${escrito.id}">Activar</button>
                </td>
            `;

            tablaBody.appendChild(fila);
        });

        agregarEventosActivar();
    }

    // Agrega los eventos a los botones de "Activar"
    function agregarEventosActivar() {
        const botonesActivar = document.querySelectorAll('.btn-activar');
        botonesActivar.forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.dataset.id;
                await activarEscrito(id);
            });
        });
    }

    // Realiza la petición PUT para activar un escrito
    async function activarEscrito(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/escritos/activar/${id}`, {
                method: 'PUT',
            });

            if (response.ok) {
                mostrarMensajeActivacion('Escrito activado con éxito');
                await cargarEscritosInactivos(); 
            } else if (response.status === 404) {
                const data = await response.json();
                mostrarMensajeActivacion(data.mensaje); 
            } else {
                console.error('Error al activar el escrito:', response.status);
                mostrarMensajeActivacion('Error al activar el escrito.'); 
            }
        } catch (error) {
            console.error('Error de red al activar el escrito:', error);
            mostrarMensajeActivacion('Error de red al intentar activar el escrito.'); 
        }
    }
});