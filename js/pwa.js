let deferredPrompt;
var buttonInstall = document.getElementById("buttonInstall");
var buttonPermissionNotif = document.getElementById("btnPermission");

//demande permission notif
buttonPermissionNotif.addEventListener('click', async() => {
    hideInstallPromotion();
    if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission((status) => {
        // status is "granted", if accepted by user
            var n = new Notification('Notification', {
                body: 'Merci, d\'accepter les notifications',
                //icon: '/path/to/icon.png' // optional
            });
        });
    };
});


window.addEventListener('beforeinstallprompt', (e) =>{
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
});


//demande confimation installation
buttonInstall.addEventListener('click', async() =>{
    hideInstallPromotion();
    deferredPrompt.prompt();
    deferredPrompt = null;
});


//détecte si le pwa est bien installé
window.addEventListener('appinstalled', () =>{
    hideInstallPromotion();
    deferredPrompt = null;
    console.log('PWA est installée');
});



function showInstallPromotion()
{
    buttonInstall.classList.remove("hidden");
}

function hideInstallPromotion()
{
    buttonInstall.classList.add("hidden");
}

function showErrorMessage(error){
    error = "Aucune connexion"
    return(error);
}

