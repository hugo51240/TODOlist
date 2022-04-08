let deferredPrompt;
var buttonInstall = document.getElementById("buttonInstall");
var buttonPermissionNotif = document.getElementById("btnPermission");
var buttonPermissionCamera = document.getElementById("btnPermCamera");

window.addEventListener('beforeinstallprompt', (e) =>{
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
});

showNotif();
//demande permission notif
buttonPermissionNotif.addEventListener('click', async() => {
    hideNotif();
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

buttonPermissionCamera.addEventListener('click', async() => {
    //vérifie la prise en charge
    if('mediaDevices' in navigator && 'getUserMedia' in  navigator.mediaDevices){
        //demande de permission
        navigator.mediaDevices.getUserMedia({video:true});
        console.log('Media Device accorded');
    }
    console.log('Erreur');
})


//demande confimation installation
buttonInstall.addEventListener('click', async() =>{
    hideInstallPromotion();
    deferredPrompt.prompt();
    deferredPrompt = null;
});


//détecte si le pwa est bien installé
window.addEventListener('appinstalled', (e) =>{
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

function showNotif() {
    buttonPermissionNotif.classList.remove("hidden");
}
function hideNotif(){
    buttonPermissionNotif.classList.add("hidden");

}

function showErrorMessage(error){
    error = "Aucune connexion"
    return(error);
}

