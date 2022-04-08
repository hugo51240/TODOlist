const APIURL = 'http://localhost:7000/todos/';

/**
 * Requête de récupération de l'ensemble des todos de l'API
 * @returns une promesse contenant le tableau des todos
 */
function fetchTodos() {
    return fetch(APIURL)
        .then(resp => resp.json());
}

/**
 * Requête sur l'API de suppression du todo id
 * @param {number} id 
 * @returns une promesse résolue à la suppression en BD
 */
function fetchDeleteTodo(id) {
    return fetch(APIURL + id, {
        method: 'DELETE'
    });
}

/**
 * Requête sur l'API de basculement de l'état du todo id vers le statut done
 * @param {number} id 
 * @param {*} done état du todo
 * @returns une promesse résolue à la mise à jour du todo contenant les données du todo modifié
 */
function fetchToggleTodo(id, done) {
    return fetch(APIURL + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            id,
            done
        }),
    })
        .then(resp => resp.json());
}

/**
 * Requête d'ajout d'un todo dans la BD avec le text précisé
 * @param {string} text 
 * @returns une promesse résolue à l'ajout du todo dans la BD, contenant les données du todo ajouté
 */
function fetchAddTodo(text) {
    return fetch(APIURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            text: text,
            done: false,
        }),
    })
        .then(resp => resp.json())
}
