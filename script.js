// Globale Variablen für den State
let n, s, v;
let r, x;
let b;
function updateN(){
    if (document.getElementById('inputP').value !='None' && document.getElementById('inputQ').value != 'None'){
        const p = parseInt(document.getElementById('inputP').value);
        const q = parseInt(document.getElementById('inputQ').value);
        const n = q * p;
        document.getElementById('inputN').value = n;
        document.getElementById('outputN').value = n;
    }
    else{
        document.getElementById('inputN').value = "35";
        document.getElementById('outputN').value = "35";
    }
    
}
// Event-Listener für Änderungen an inputP und inputQ
document.getElementById("inputP").addEventListener("change", updateN);
document.getElementById("inputQ").addEventListener("change", updateN);

document.addEventListener('DOMContentLoaded', (event) => {
    updateN();
    updateS();
});
function updateS(){
    const n = parseInt(document.getElementById('inputN').value);
    const s = Math.floor(Math.random()* n)
    document.getElementById('inputS').value = s;
    document.getElementById('outputS').value =s;
}
document.getElementById('randomS').addEventListener("click", updateS)
function updateP(){
    const p = parseInt(document.getElementById('inputP').value);
    document.getElementById('outputP').value = p;
}
document.getElementById("inputP").addEventListener("change", updateP);
function updateQ(){
    const q = parseInt(document.getElementById('inputQ').value);
    document.getElementById('outputQ').value = q;
}
document.getElementById("inputQ").addEventListener("change", updateQ);
function startSetup() {
    n = parseInt(document.getElementById('inputN').value);
    s = parseInt(document.getElementById('inputS').value);

    // Validierung
    if (s >= n) { alert("Das Geheimnis s muss kleiner als der Modulus n sein!"); return; }
    
    // Berechnung des öffentlichen Schlüssels v
    v = (s * s) % n;

    document.getElementById('setupResult').innerHTML = 
        `<strong>Öffentliche Werte:</strong> n = <span class="variable">${n}</span>, v = <span class="variable">${v}</span><br>` +
        `Wobei v = ${s}² mod ${n} =  <span class="variable">${v}</span><br>` +
        `<strong>A's Geheimnis:</strong> s = <span class="variable">${s}</span> (ist Privat, wird also nicht übertragen!)`;
    
    document.getElementById('protocolCard').style.display = 'block';
    showStep(1);
}

function showStep(num) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step' + num).classList.add('active');
}

function runCommitment() {
    // A wählt zufälliges r (zwischen 1 und n-1)
    r = Math.floor(Math.random() * (n - 2)) + 1;
    
    // A berechnet x = r^2 mod n
    x = (r * r) % n;
    document.getElementById('outputR').value = r
    document.getElementById('outputX').value = x
    document.getElementById('resStep1').innerHTML = 
        `A hat gewählt: <span class="math">r = ${r}</span> (geheim).<br>` +
        
        `A sendet <span class="math">x = ${x}</span> an B<br>`+
        `Wobei <span class="math">x = r² mod n</span>.<br>`+
        `Also <span class="math">  x = ${r}² mod ${n} <br>`;
    
    showStep(2);
}

function runChallenge(choice) {
    b = choice;
    document.getElementById('resStep2').innerHTML = 
        `B hat gewählt: <span class="math">b = ${b}</span>`;
    
    runResponseAndVerify();
}

function runResponseAndVerify() {
    showStep(3);
    let y;
    let explanation = "";
    let calcCheck = "";
    let passed = false;

    // As Antwort berechnen
    if (b === 0) {
        // Fall b=0: A sendet r
        y = r;
        explanation = "Da b=0, sendet A einfach ihre Zufallszahl <span class='math'>y = r</span>.";
        
        // Prüfung: y^2 mod n == x
        let ySq = (y * y);
        let check = ySq % n;
        
        calcCheck = `Prüfung: ${y}² mod ${n} = ${ySq} mod ${n} = <strong>${check}</strong>. <br>Erwartet war x = <strong>${x}</strong>.`;
        passed = (check === x);

    } else {
        // Fall b=1: A sendet r * s mod n
        y = (r * s) % n;
        explanation = "Da b=1, sendet A <span class='math'>y = r · s mod n</span>.";
        
        // Prüfung: y^2 mod n == x * v mod n
        let leftSideVal = (y * y) % n; // y^2 mod n
        let rightSideVal = (x * v) % n; // x * v mod n
        
        calcCheck = `Prüfung (y² ≡ x·v):<br>` + 
                    `Links: ${y}² mod ${n} = <strong>${leftSideVal}</strong><br>` +
                    `Rechts: ${x} · ${v} mod ${n} = ${x*v} mod ${n} = <strong>${rightSideVal}</strong>`;
        
        passed = (leftSideVal === rightSideVal);
    }

    let resultText = passed ? 
        `<span class="success">✔ Beweis gültig!</span>` : 
        `<span style="color:red">✘ Beweis fehlgeschlagen!</span>`;

    document.getElementById('verifyLog').innerHTML = 
        `<div class="log-entry">` +
        `<p>${explanation}</p>` +
        `<p>A sendet: <span class="variable">y = ${y}</span></p>` +
        `<p>${calcCheck}</p>` +
        `<h3>Ergebnis: ${resultText}</h3>` +
        `</div>`;
}

function resetProof() {
    document.getElementById('resStep1').innerHTML = "";
    document.getElementById('resStep2').innerHTML = "";
    document.getElementById('verifyLog').innerHTML = "";
    showStep(1);
}
