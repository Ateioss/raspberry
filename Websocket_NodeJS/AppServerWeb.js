const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3500;




let clientFront = null;
let appCapteurs = null;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
let coordonnees = '';

io.on('connection', (socket) => {
console.log('Un client est connecté')
    // l’application capteurs doit se connecter en premier ensuite l’application web
    socket.on('client', (data) => {
        
        if(data === 'AppCapteur'){
            console.log('je suis intercepté');
            appCapteurs = true;
           console.log(`Valeur de appCapteur => ${appCapteurs}`);
        }


    });
    // Ne serait-ce pas plus simple de faire la discrimination, le choix entre appCapteur et client à partir des noms de déclencheurs ???
    // C'est rapport avec le cours ?
    if (appCapteurs != null) {
        appCapteurs = io;
    }

    if (clientFront != null) {
        clientFront = io;
    }

    socket.on('mesures', (data) => {
        console.log(`mesures reçues du programme de lecture des capteurs`);
        // Mettre ton code ici

        //Socket.io est à l'écoute d'un objet {texte, donnees}, il est ici pré-supposé quel'envoyeur devra utilisera les valeurs ax, ay etc..
        //à remplacer par ce qui sera reçu du PI
        let axeX = data.ax;
        let axeY = data.ay;
        let axeZ = data.az;
        

        // Les trois valeurs reçues sont ajoutées dans une ligne sous forme de texte -> décommenter ligne dessous
        // this.coordonees =`x: ${axeX}, y: ${axeY}, z: ${axeZ}`;

        this.coordonnees = {
            x: `${axeX}`,
            y: `${axeY}`,
            z: `${axeZ}`,
            temp: `${data.temp}`
        };

        console.log(this.coordonnees);
        //On envoie le texte qui comprends les trois coordonnees vers le code responsable de l'affichage de la page
        
        // socket.emit('mesures', this.coordonees);
        // Ici c'est IO qui utilise la méthode init -> Renvoi vers TOUS les clients
        // Si cela avait été socket.emit alors seul le client (dans ce cas raspberry ) aurait reçu les données
        io.emit('captation', this.coordonnees);

    });
    socket.on('ledButton', function (data) {
        // refaire ici en utilisant le même pricnipe pour gestion evenementielle à la suite de l'appui sur le bouton
       
    });
    socket.on('disconnect', ()=>{
        console.log('Bye')
    })
    
});
http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});
