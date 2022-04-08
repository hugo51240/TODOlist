/**
 * Récupération des todos de l'API et insertion dans la page web
 */
 function getTodos() {

    var networkDataReceived = false;

    startSpinner();
    
    //fetch fresh data
    var networkUpdate = fetch('https://clinquant-truffle-b2689f.netlify.app/').then(function(response){
        return response.json();
    }).then(function(data)
    {
        networkDataReceived = true;
        updatePage(data);
    });
    
    //fetch cached data
    // 'https://clinquant-truffle-b2689f.netlify.app/'
    // 'http://127.0.0.1:5501/'
    caches.match('https://clinquant-truffle-b2689f.netlify.app/').then(function(response)
    {
        if(!response)throw Error("no data");
        return response.json;
    }).then(function(data){
        //sans écraser les données réseau
        if(!networkDataReceived){
            updatePage(data);
        }
    }).catch(function() {
        return networkUpdate;
    }).catch(showErrorMessage).then(stopSpinner);


    clearTodos();

    fetchTodos().then(todos => {
        todos.forEach(todo => appendTodoHtml(todo));
    });

    

}

/**
 * Ajout d'un todo dans l'API contenant le text précisé puis ajout dans la page web
 * @param {string} text 
 */
 function addTodo(text) {
    console.log('Add todo : ', text);

    fetchAddTodo(text)
        .then(data => {
            appendTodoHtml(data);
        });
}

/**
 * Basculement du todo identifié par id d'un état réalisé à un état non réalisé ou inversement dans l'API puis dans la page web
 * @param {number} id identifie le todo
 * @param {boolean} done état initial du todo
 */
    function toggleTodo(id, done) {
    console.log('Toggle todo ' + id + ' request');

    fetchToggleTodo(id, !done)
        .then(data => toggleTodoHtml(id, data.done));
}

/**eleteTodoHtml(document) de suppression
 */
    function deleteTodo(id, event) {
    console.log('Delete todo ' + id + ' request');

    fetchDeleteTodo(id)
        .then(() => deleteTodoHtml(id));
}


/**
 * Supprime de la page les todos existant puis parcourt les nouveaux pour les ajouter a la page web
 */
function updatePage(todos){
    clearTodos();
    todos.forEach(element => {
        addTodo(todo);
    });
}

/**
 * re-tente de télécharger les tâches
 */
function tryDataRequest(todos)
{
    fetchTodos(todos).then( ()=>{
        if(navigator.onLine)
        {            
            setOnLineMode();
            snackbar.close();
        }
        else
        {
            console.log('erreur, veuillez ressayer.');
            snackbar.open();
        }
    }
    )
    
}
