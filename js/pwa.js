//#region Variables
let deferredPrompt;
let Swregistration = null;

var buttonInstall = document.getElementById("buttonInstall");
var buttonPermissionNotif = document.getElementById("btnPermission");
var buttonPermissionCamera = document.getElementById("btnPermCamera");
var buttonReseau = document.getElementById('butRéseau');
var buttonRefresh = document.getElementById('butRefresh');
//#endregion

/**
 * Lancement de function
 */

 showNotif();
 initialisationSW();

 /**
  * fin lancement de function
  */



window.addEventListener('beforeinstallprompt', (e) =>{
    e.preventDefault();
    deferredPrompt = e;
    showInstallPromotion();
});

//lien vers site pour exemple complet utilisation camera et save image
// https://codes-sources.commentcamarche.net/faq/11265-recuperer-et-sauvegarder-un-cliche-avec-la-webcam-grace-a-l-api-mediadevices
buttonPermissionCamera.addEventListener('click', async() => {
    //vérifie la prise en charge
    if('mediaDevices' in navigator && 'getUserMedia' in  navigator.mediaDevices){
        //demande de permission
        console.log('Media Device accorded');
        ouvrir_camera();
    }
    else{
        console.log('Erreur, media device n\'est pas supporter');
        
    }
    
})

/**
 * demande confimation installation
 */
buttonInstall.addEventListener('click', async() =>{
    hideInstallPromotion();
    deferredPrompt.prompt();
    deferredPrompt = null;
});


/**
 * détecte si le pwa est bien installé
 */
window.addEventListener('appinstalled', (e) =>{
    hideInstallPromotion();
    deferredPrompt = null;
    console.log('PWA est installée');
});
///



window.addEventListener('offline', event => {
    showReseau();
})

buttonReseau.addEventListener('click', async() => {
    hideReseau();
})


//#region functions

/**
 * Fonction qui gère la class hidden
 */
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

function showReseau() {
    buttonReseau.classList.remove("hidden");
}
function hideReseau(){
    buttonReseau.classList.add("hidden");
}

/**
 * Autres fonctions
 */

function showErrorMessage(error){
    error = "Aucune connexion"
    return(error);
}

function refresh(){
    window.location.reload();
}

/**
 * Enregistrement du service worker
 */
function initialisationSW(){
    if ('serviceWorker' in navigator && "PushManager" in window) {
        console.log("Service Worker and Push is supported");

        //enregistrement du service worker
        navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service worker est enregistré', registration);

            Swregistration = registration;
            initalizeUI();
        }).catch(error => {
            console.error('Service worker, Erreur', error);
        });
    } else {
        console.warn('Message Push n\'est pas supporté');
        buttonPermissionNotif.textContent = "Push NOt Supported";
    }
}

/**
 * action click sur le bouton Notif
 */
function initalizeUI(){
    buttonPermissionNotif.addEventListener('click', () => {
        displayNotif();
    });
}

/**
 * Gére l'affichage de la notif
 */
function displayNotif() {
    if(window.Notification && Notification.permission === "granted") {
        notif();
    }
    else if (window.Notification && Notification.permission !== "denied") {
        Notification.requestPermission(status => {
            if(status === "granted") {
                notif();
            }else {
                alert("Vous avez refusé les notifications. Aller dans vos paramètres pour les accpeter.");
            }
        });
    }
}

/**
 * Création de la notif
 */
function notif(){
    const options = {
        body: "Test Notification + test focus 5",
        icon: "/icon/check.png"
    };
    hideNotif();
    Swregistration.showNotification("PWA Notification!", options);
    
}
//#endregion

//#region Caméra

/**
 * Mise en marche de la caméra
 */
function ouvrir_camera(){
    navigator.mediaDevices.getUserMedia({audio:false, video:{width:400,facingMode:{exact:'environment'}}}).then(function(mediaStream) {
        // affichage video dans une balise html <video>
        var video = document.getElementById('sourcevid');
        video.srcObject = mediaStream;
        
        var tracks = mediaStream.getTracks();

        document.getElementById("message").innerHTML="message : "+tracks[0].label+" connecté";
        console.log(tracks[0].label);

        video.onloadedmetadata = function(e) {
            video.play();
        };
    }).catch(function(error) {console.log(error.name + ": "+error.message);
        document.getElementById("message").innerHTML="message: connection refusé"
});
}


/**
 * Prise de photo
 */
function photo(){
    var video = document.getElementById("sourcevid");
    var canvas1 = document.getElementById("cvs");
    var ctx = canvas1.getContext('2d');
    canvas1.height = video.videoHeight;
    canvas1.width = video.videoWidth;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
}

/**
 * Stockage local de l'image
 */
function sauvegarder(){
    if(navigator.msSaveOrOpenBlob){
        var blobObject = document.getElementById("cvs").msBlob();
        window.navigator.msSaveOrOpenBlob(blobObject, "image.png");
    }
    else {
        var canvas = document.getElementById("cvs");
        var element = document.createElement('a');
        element.href = canvas.toDataURL("image/png");
        element.download = "nom.png";
        var event = new MouseEvent("click", {bubbles: true, cancelable: true, view: window});
        element.dispatchEvent(event);
    }
}

/**
 * Stockage serveur de l'image avant envoi
 */
function prepareEnvoi(){
    var canvas = document.getElementById("cvs");
    canvas.toBlob(function(blob){envoi(blob)}, "image/jpeg");
}

function envoi(blob) {
    console.log(blob.type);
    
    var formImage = new FormData();
    formImage.append('image_a',blob, 'image_a.jpg');
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "http://adresse/reception/upload_camera.php",true);
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4 && ajax.status == 200){
            document.getElementById("jaxa").innerHTML+=(ajax.responseText);
        }
    }
    ajax.onerror=function(){
        alert("La requête a échoué")
    }

    ajax.send(formImage);
    console.log("ok");
}


/**
 * Arrêt de la caméra
 */
function fermer(){
    var video = document.getElementById("sourcevid");
    var mediaStream = video.srcObject;
    console.log(mediaStream);
    var tracks = mediaStream.getTracks();
    console.log(tracks[0]);
    tracks.forEach(function(track){
        track.stop();
        document.getElementById("message").innerHTML="message: "+tracks[0].label+" déconnecté";
    });
    video.srcObject = null;
}

//#endregion
 

//test notif animé
const button = document.querySelector('button');
const toast = document.querySelector('#notification');

button.addEventListener("click", () => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  });