// =============================================================================
// KONFIGURATIONSBEREICH (HIER DATEN EINTRAGEN)
// =============================================================================

// 1. Allgemeine Infos zur Veranstaltung
#let veranstaltung = "Proseminar: Kryptografie " 

// 2. Referenten (Name und Matrikelnummer)
#let referent1_name = "Adrian Deinert"
#let referent1_matrikel = "6071774"

// Falls du alleine vorträgst, lass die Felder einfach leer: ""
#let referent2_name = "Leon Krasniq" 
#let referent2_matrikel = "6104591"

// 3. Informationen zum Vortrag
#let thema = "Zero-Knowledge-Protokolle"
#let vortrags_datum = "12. März 2026" 

// =============================================================================
// TEMPLATE LOGIK
// =============================================================================

#set page(
  paper: "a4",
  margin: (top: 2cm, bottom: 2.5cm, x: 2cm),
)
#set text(font: "Noto Sans", lang: "de", size: 10pt)
#show math.equation: set text(12pt)
#set par(leading: 0.8em)
#show math.equation.where(block: true): set block(above: 1.2em, below: 1.2em)

// Farbige Variablen für Mathe-Umgebungen: cvar(farbe, inhalt)
#let cvar(color, body) = math.class("normal", text(fill: color, body))
#let cs(body) = cvar(red, body)
#let cr(body) = cvar(red, body)
#let cx(body) = cvar(orange, body)
#let cy(body) = cvar(orange, body)
#let cb(body) = cvar(orange, body)
#let cn(body) = cvar(green, body)
#let cv(body) = cvar(green, body)

#let handout_template(body) = {
  // --- Kopfzeile (Veranstaltung, Dozent, Datum) ---
  grid(
    columns: (1fr, auto, 1fr), 
    align: (left, center, right),
    [#text[#veranstaltung]],
    [#box[#text(weight: "bold", fill: luma(100))[Handout]]], 
    [#vortrags_datum],
  )
  
  v(0.1em)
  line(length: 100%, stroke: 1pt)
  v(1em) // Etwas Luft vor dem Titel

  // --- Titel und Referenten ---
  align(center)[
    #text(size: 1.8em, weight: "bold")[#thema] \
    #v(0.8em)
    
    // Referenten kompakt darstellen
    #text(size: 1.1em)[
      *#referent1_name*  & *#referent2_name* 
    ]
  ]

  v(1em)
  line(length: 100%, stroke: 0.5pt) // Dünnere Trennlinie nach dem Header
  v(1em)

  // --- Überschriften-Formatierung ---
  // Für Handouts ist eine saubere 1.1 Nummerierung am besten lesbar
  set heading(numbering: none)
  
  // Abstand nach Überschriften optimieren
  show heading: it => {
    it
    v(0.5em)
  }

  body
}

#show: doc => handout_template(doc)

// =============================================================================
// INHALTSBEREICH (HIER STARTET DEIN HANDOUT)
// =============================================================================

= Der Farbenbeweis
Angenommen Bob (links) sei farbenblind.\
Alice (rechts) möchte Bob nun beweisen, dass sie Farben sehen kann, ohne Bob irgendwelche anderen Informationen (wie die tatsächliche Farbe der Bälle) preiszugeben.

#grid(
  columns: (1fr, 1fr),
  gutter: 1em,
  figure(image("ColorProof1.png", width: 40%)),
  figure(image("ColorProof2.png", width: 40%)
)
)

Um diesen Beweis durchzuführen, holt Bob sich zwei Bälle: jeweils einen roten und einen blauen Ball.
Bob nimmt nun die Bälle (dessen Farbe er nicht kennt), hinter seinen Rücken und entscheiden ob er die Bälle vertauschen möchte oder nicht.



#grid(
  columns: (1fr, 1fr),
  gutter: 1em,
  figure(image("ColorProof3.png", width: 40%), ),
  figure(image("ColorProof4.png", width: 40%),
  )
)
Wenn Alice nun wirklich Farben sehen kann, dann wird sie Bob immer sagen können, ob die Bälle getauscht worden sind oder nicht.\
Falls Alice jedoch lügen sollte und auch keine Farben sehen kann, dann hat sie eine 50/50 Chance, trotzdem richtig zu raten, ob die Bälle vertauscht worden sind oder nicht.\
Doch auch dafür hat Bob eine Lösung:\ Er wiederholt den Vorgang einfach so oft, bis die Wahrscheinlichkeit dass Alice jedes mal richtig geraten hat, quasi gegen 0 geht.\
Nach nur 25 Wiederholungen ist die Wahrscheinlichkeit im Lotto zu gewinnen zwei mal höher, als jede Runde richtig zu raten.




#pagebreak()

= Das Fiat-Shamir-Protokoll

Angenommen Alice möchte Bob beweisen, dass sie ein Geheimnis #text(fill: red)[s] kennt, ohne jegliche Informationen über ihr #text(fill: red)[s] preiszugeben: \
1. Alice sendet Bob ihr _Commitment_ #text(fill: orange)[x] welches sie aus einer Zufallszahl #text(fill: red)[r] und dem öffentlichen Modul #text(fill: green)[n] berechnet.\
2. Bob antwortet darauf mit einem _Challenge-Bit_ #text(fill: orange)[b] welches 0 oder 1 sein kann.\
3. Je nach dem wie #text(fill: orange)[b] ausfällt ändert sich das #text(fill: orange)[y], welches Alice nun Bob schicken muss.
#set text(size: 10pt)
#place(left)[
  #set text(size: 6pt)
  #text(fill: green)[Öffentlich]\
  #text(fill: orange)[Privat zwischen Alice und Bob]\
  #text(fill: red)[Privat (Alice)]
]
#place(right, dx: -2em, dy: 2em)[
  #align(center)[
    #stack(dir: ttb, spacing: 2pt,
      image("QR-Fiat-Shamir.png", width: 15%),
      text(size: 6pt)[Interaktive Webseite]
    )
  ]
]

#align(center)[
#image("Fiat-Shamir.png", width: 40%)
]

Nach den Schritten 1 - 3 überprüft Bob nun, ob für das von Alice gesendete #text(fill: orange)[y] gilt:\
#align(center)[
$cy(y)² mod cn(n) equiv cx(x) dot cv(v)^cb(b) mod cn(n)$
]

Auch hier kann Alice allerdings lügen, indem sie sich vor ihrem _Commitment_ #text(fill: orange)[x] (Schritt 1) entweder auf #text(fill: orange)[b] = 0 oder #text(fill: orange)[b] = 1 vorbereitet.\
#underline[#strong[1.] Für #text(fill: orange)[b] = 0 prüft B:] $cy(y)² mod cn(n) equiv cx(x) mod cn(n)$\
Also kann Alice einfach ein zufälliges #text(fill: red)[r] schicken für das $cx(x) = cr(r)² mod cn(n)$ gilt.
Falls Bob allerdings die _Challenge_ #text(fill: orange)[b] = 1 sendet, 
kann Alice kein gültiges #text(fill:orange)[y ] senden, da B\
$cy(y) = cr(r) dot cs(s)^cb(b) mod cn(n)$ erwartet und Alice #text(fill: red)[s] nicht kennt!\
#underline[#strong[2.] Für #text(fill: orange)[b] = 1 prüft B:] $cy(y)² mod cn(n) equiv cx(x) dot cv(v) mod cn(n)$\
Also kann Alice ihr _Commitment_ #text(fill: orange)[x] vor dem Senden (Schritt 1) manipulieren indem sie ein zufälliges #text(fill :orange)[y] wählt für das sie dann berechnet:\
$cx(x) = cy(y) dot cv(v)⁻¹ mod cn(n)$\
Da dieses #text(fill: orange)[x] in Abhängikeit der Inversen des öffentlichen Schlüssels #text(fill: green)[v] berechnet wurde, besteht das #text(fill :orange)[y] die Prüfung $cy(y)² mod cn(n) equiv cx(x) dot cv(v)^cb(b) mod cn(n)$.\
Falls es jedoch anders kommt und Bob nach #text(fill: orange)[b] = 1 fragt, wird Alice $cy(y) = cr(r)$ senden müssen und da das _Commitment_ #text(fill:orange)[x] ohne das Wissen über #text(fill:red)[r] berechnet wurde, kennt sie kein gültiges #text(fill:red)[r].

= Eigenschaften 
Sei B ein Verifier und A ein Prover.\
Für ZKP müssen folgende 3 Eigenschaften gelten: \
#strong[Durchführbarkeit (Completeness)]: Wenn die Behauptung "A kennt ein Geheimnis s" richtig ist
und A ein Beweis dafür kennt, kann er B auf jeden Fall von der Richtigkeit der Behauptung überzeugen.\
#strong[Korrektheit (Soundness)]: Wenn die Behauptung nicht richtig ist oder A keinen Beweis für die Richtigkeit kennt,
so lässt sich B nur mit einer sehr geringen Wahrscheinlichkeit überzeugen.\
#strong[Zero-Knowledge-Eigenschaft]: B gewinnt während des Beweises kein Wissen hinzu außer, dass A einen Beweis 
für die Behauptung kennt. B kann außerdem keine Person C davon überzeugen, dass A einen Beweis kennt!