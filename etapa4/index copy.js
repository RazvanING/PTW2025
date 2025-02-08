import express from 'express';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static('public'));

console.log("Folder index.js este", import.meta.url);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", import.meta.url);

const obGlobal = { 
    obErori: null
 };

app.use("/resources" , express.static(path.join(process.cwd(), "resources"))
);


app.get(['/', '/index', '/home'], (_req, res) => {
    res.render("pagini/index");
});

//TODO: adauga rute pentru paginile: despre, contact, produse
app.get("/despre", (_req, res) => {
    res.render("pagini/despre");
}
);

app.get("/contact", (_req, res) => {
    res.render("pagini/contact");
}
);

app.get("/produse", (_req, res) => {
    res.render("pagini/produse");
}
);

app.get("/produs/:id", (req, res) => {
    res.render("pagini/produs", { id: req.params.id });
}
);

app.get("/*", (_req, res) => {
    res.render("pagini"+_req.url, function(err, rezRandare){
        if(err){
            afisareEroare(res, 404)
        }
        else{
            res.send(rezRandare);
        }
    }
    );
}
);

function initErori() {
    let continut = readFileSync(path.join(process.cwd(), "resources/json/erori.json")).toString("utf-8");
   
    obGlobal.obErori = JSON.parse(continut);
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);
  
    for (let eroare of obGlobal.obErori.info_erori) {
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine);
    }
    console.log("Erori:", obGlobal.obErori);
}

initErori();

function afisareEroare(res, identificator){
   let eroare = obGlobal.obErori.info_erori.find(function(elem){
        return elem.identificator==identificator;
     });
     if(eroare){
        res.render("pagini/eroare", {
            titlu: eroare.titlu,
            text: eroare.text,
            imagine: eroare.imagine
        });
     }
     else{
        res.send(rezRandare);
     }
}


app.listen(8080);