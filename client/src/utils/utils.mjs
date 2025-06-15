function checkIfGuessed(unknownCardId, unknownCardIndex, updatedDeckCardsArray){
    let correct = false;
    
    for(let i=0; i<updatedDeckCardsArray.length; ++i){
        if(updatedDeckCardsArray[i].idCarta === unknownCardId){
            if(i===0){
                if(unknownCardIndex < updatedDeckCardsArray[i+1].indice){
                    correct = true;
                }
            } else if(i !== 0 && i !== updatedDeckCardsArray.length - 1){
                if(unknownCardIndex > updatedDeckCardsArray[i-1].indice && unknownCardIndex < updatedDeckCardsArray[i+1].indice){
                    correct = true;
                }
            } else{
                if(unknownCardIndex > updatedDeckCardsArray[i-1].indice){
                    correct = true;
                }
            }
            break;
        }
    }
    return correct;
}

export {checkIfGuessed};