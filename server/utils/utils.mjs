import dayjs from "dayjs";

export function groupAndOrderPartite(rows) {
  const partiteMap = {};

  for (const row of rows) {
    if (!partiteMap[row.idPartita]) {
      partiteMap[row.idPartita] = {
        idPartita: row.idPartita,
        data: row.data,
        nCarteRaccolte: row.nCarteRaccolte,
        esito: row.esito,
        carteIniziali: [],
        carteRound: []
      };
    }

    if (row.nRound === null && row.conquistata === null) {
      partiteMap[row.idPartita].carteIniziali.push({ nome: row.nome });
    } else {
      partiteMap[row.idPartita].carteRound.push({
        nome: row.nome,
        nRound: row.nRound,
        conquistata: row.conquistata
      });
    }
  }

  const partiteArray = Object.values(partiteMap);
  const orderedPartiteArray = partiteArray.sort(
    (a, b) => dayjs(a.data).valueOf() - dayjs(b.data).valueOf()
    );

  return orderedPartiteArray;
}