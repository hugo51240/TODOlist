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

// Mise en marche de la caméra
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


// Prise de photo
function photo(){
    var video = document.getElementById("sourcevid");
    var canvas1 = document.getElementById("cvs");
    var ctx = canvas1.getContext('2d');
    canvas1.height = video.videoHeight;
    canvas1.width = video.videoWidth;
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
}

// Stockage local de l'image
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

// Stockage serveur de l'image avant envoi
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


// Arrêt de la caméra
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