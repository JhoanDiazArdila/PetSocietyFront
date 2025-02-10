


function getNotifications(){

    fetch(`${BASE_URL}notify/all/${userEmail}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // O  'application/json', 
            "Authorization": localStorage.getItem('authToken')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Notificaciones recibidas:", data);
        // Se asume que data es un arreglo de notificaciones
        let quantityNotifications = data.length;
        console.log("Cantidad de notificaciones:", quantityNotifications);
        
        // Si tienes un elemento en el DOM para mostrar el número de notificaciones, por ejemplo:
        let notifElement = document.querySelector("#notificationCount");
        if (notifElement) {
            notifElement.textContent = quantityNotifications;
        }
    })
    .catch(error => {
        console.error('Error al obtener notificaciones:', error);
    });
}
























