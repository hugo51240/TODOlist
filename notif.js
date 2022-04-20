//TEST Notif

// ajouter un bouton dans index.html pour faire la demande de permission

//#region Exemple 
/*
function notifyMe() {
    //Vérifie si le navigateur prend en charge les notifications
    if(!('Notification' in window)) {
        alert('Ce navigateur ne prend pas en charge la notification de bureau')
    }

    //Vérifie si les autorisations de notifications ont déjà été accordés
    else if (Notification.permission === 'granted') {
        // Si tout va bien, création d'une notif
        const notif = new Notification('Salut toi !');
    }

    // Sinon demande de permission à l'utilisateur
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            //Si l'utilisateur accepte, création d'une notification
            if(permission === 'granted') {
                const notif = new Notification('Salut toi !');
            }
        })
    }
    //Si l'utilisateur a refusé, on s'arrête là
}
*/
//#endregion

//#region exemple 2
/*
if (window.Notification && Notification.permission !== "denied") {
	Notification.requestPermission((status) => {
    // status is "granted", if accepted by user
		var n = new Notification('Notification', {
			body: 'Test PWA, bonjour toi !',
			//icon: '/path/to/icon.png' // optional
		});
	});
};

n.close();



//demande de permission d'afficher les notifs
Notification.requestPermission();

const process = (permission) => {
    if(permission === "granted") {
        //ok we can show the permission
    }
}
Notification.requestPermission((permission) => {
    process(permission)
}).then((permission) => {
    process(permission)
})


// création de la notif avec un corps après demande de premission
Notification.requestPermission();
new Notification('Hey', {
    body: 'You should see this!',
    icon: '/icon/favicon-32x32-seochecker-manifest-608.png'
});
*/

//fermer la notif
//const n = new Notification('hey');

//n.close();

// ajout timer
//setTimeout(n.close(),2000);

//#endregion

//#region Exemple : yt Google Chrome developers (Progressive Web App training)
/*


 // Demande de permission à l'utilisateur
Notification.requestPermission(status => {
    console.log('Notification permission status:', status);
}); 


 // Affichage de la notification

function displayNotification() {
    if(Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then( reg => {
            // ajout des caractéristiques de la notif
            const options = {
                body: "Ici, c'est lke corps de la notification.",
                icon: 'icon/favicon-32x32-seochecker-manifest-608.png',
                vibrate: [100,50,100],
                data: {primaryKey: 1}, // identification des notifs
                actions: [
                    {action: 'go', title: 'Aller au site', icon: 'icon/check.png'},
                    {action: 'close', title:'Non merci', icon: 'icon/x.png'},
                ]
            };
            reg.showNotification('Hello World!', options);
        });
    }
}


self.addEventListener('notificationclose', event => {
    const notification = event.notification;
    const primaryKey = notification.data.primaryKey;
    console.log('CLosed notification: ' + primaryKey);
});


 // abonnement au service push
 
navigator.serviceWorker.getRegistration().then(reg => {
    reg.pushManager.subscribe({
        userVisibleOnly: true
    }).then(sub => {
        //send sub.toJson() to server

    })
})


 // check si l'utilisateur est abonné
 

navigator.serviceWorker.ready.then(reg => {
    reg.pushManager.getSubscription().then(sub => {
        if(sub == undefined){
            //ask user to register for push
        } else {
            // you have subscription, update the database
        }
    });
});


 // envoie d'un message depuis le server avec VAPID
 
const webPush = require('web-push');
const payload = 'Here is a payload!';
const options = {
    vapidDetails: {
        subject:'mailto: example-email@example.com',
        publicKey: <Vapid_Public_Key />,
        privateKey: <Vapid_Private_Key/>
    } 
};
webPush.sendNotification(pushSubcription, payload, options);



 // s'abonné avec une clé public VAPID
 
const applicationServerPublicKey = 'BLiZBfTwbWe_TzKT8GHqmcFU';
const applicationServerKey = urlB64ToUint8Array(
    applicationServerPublicKey
);

swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey : applicationServerKey
});
 */
//#endregion

//#region Exemple avec node.js et npm

/**
 * dossier TEST_NOTIF
 * 
 * 
 * npm init -y 
 * npm install web-push express body-parser
 * créer script start: "node index.js"
 * crer le fichier index.js
 * ./node_modules/.bin/web-push generate-vapid-keys (erreur, du à powershell ??)
 * mettre dans les const créer la clé public et prive générer (index.js)
 * 
 * npm start
 * 
 * 
 * WARNING demande de permission non faite et la notif ne s'affiche pas
 * 
 */

//#endregion



