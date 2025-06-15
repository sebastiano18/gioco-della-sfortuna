function Card(idCarta, nome, immagine, indice){
    this.idCarta=idCarta;
    this.nome=nome;
    this.immagine=immagine;
    this.indice=indice;
}

function Round(idCarta, nRound, conquistata, idMatch){
    this.idMatch=idMatch;
    this.idCarta=idCarta;
    this.nRound=nRound;
    this.conquistata=conquistata;
}

function Match(idUtente, data, nCarteRaccolte, esito, idsCarteIniziali, round){
    this.idUtente = idUtente;
    this.data = data;
    this.nCarteRaccolte = nCarteRaccolte;
    this.esito = esito;
    this.idsCarteIniziali = idsCarteIniziali;
    this.round = round;
}

export {Card, Round, Match};