const win = `Tak to má být.
Jako obvykle.
Normálka.
Martin je prostě dobrej.
Ha ha ha, suckers.
Well, well, well!
LOL, suckers.
Žádné překvapení.
Dobrá práce, Martine!
Tvoje máma!
Jupínek, všechno je v pořádku.
Největší vítězství všech dob!
Tomu to ale jde!
Go go, Martin-san!
Postrach všech křečků opět zvítězil!
Návrat krále!
Yeah, piece of cake!
Martin přišel vyhrávat a jíst hummus a hummus už došel.
Cool!
You guys suck!`.split('\n');

const mistake = `Existuje 7 paralelních vesmírů, kde Martin nevyhrál. Toto je jeden z nich.
ERROR: Martin prohrál kvůli technické chybě.
Rovnováha světa je narušena, ale Martin to dá brzy do pořádku.
Místnost potemněla.
Nehoráznost.
Vyhrání z kapsy vyhání.
Well, well, well…
That game is RIGGED! SAD!
Cítím velké narušení síly.
Výsměch všem dobrým hrám.
Martinovi někdo cuknul s klávesnicí?
Špatný den trvá jen 24 hodin.
Statistika mluví i o hrách, které Martin prohrál. Ale ne často.
Tough times don’t last. Tough people do.
Martin omylem nevyhrál.
Divné.
WTF?
Hříčka náhody.
Show must go on!
Martin se rozhodl projednou nevyhrát.
WAT?`.split('\n');

function randomMessage(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getMessage(winner, players) {
  const name = /[Mm]ar[t+][i1]n|[fF]rayer/;
  return winner.match(name)
    ? randomMessage(win)
    : players.filter(player => player.name.match(name)).length > 0
      ? randomMessage(mistake)
      : '';
}

module.exports = { getMessage };
