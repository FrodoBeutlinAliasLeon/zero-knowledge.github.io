// Farbcodierung-Helfer: privat = rot, öffentlich = grün
const P = (name) => `<span class="vp">${name}</span>`;  // privat: s, r, p, q
const O = (name) => `<span class="vo">${name}</span>`;  // öffentlich: n, v, x, b, y

// Globale Variablen für den State
let n, s, v;
let r, x;
let b;
let honest = true;
let guessedB = null;
let preparedY = null;

function updateN(){
    if (document.getElementById('inputP').value !='None' && document.getElementById('inputQ').value != 'None'){
        const p = parseInt(document.getElementById('inputP').value);
        const q = parseInt(document.getElementById('inputQ').value);
        const n = q * p;
        document.getElementById('inputN').value = n;
    }
    else{
        document.getElementById('inputN').value = "35";
    }
}

document.getElementById("inputP").addEventListener("change", updateN);
document.getElementById("inputQ").addEventListener("change", updateN);

document.addEventListener('DOMContentLoaded', (event) => {
    updateN();
    updateS();
    // Werte-Kasten leer starten
    document.getElementById('outputP').value = '';
    document.getElementById('outputQ').value = '';
    document.getElementById('outputN').value = '';
    document.getElementById('outputS').value = '';
    document.getElementById('outputV').value = '';
    document.getElementById('outputR').value = '';
    document.getElementById('outputX').value = '';
});

function updateS(){
    const n = parseInt(document.getElementById('inputN').value);
    if(!n) return;
    const s = Math.floor(Math.random()* n)
    document.getElementById('inputS').value = s;
}
document.getElementById('randomS').addEventListener("click", updateS)

function updateP(){
    const p = parseInt(document.getElementById('inputP').value);
}
document.getElementById("inputP").addEventListener("change", updateP);

function updateQ(){
    const q = parseInt(document.getElementById('inputQ').value);
}
document.getElementById("inputQ").addEventListener("change", updateQ);

function chooseMode(isHonest) {
    honest = isHonest;
    document.getElementById('modeResult').innerHTML = honest
        ? `<span class="success">Modus: A sagt die Wahrheit (kennt ${P('s')})</span>`
        : `<span style="color:red;font-weight:bold;">Modus: A lügt (kennt ${P('s')} nicht, muss raten!)</span>`;
    const aSrc = honest ? 'A.png' : 'A-lügt.png';
    document.getElementById('side-image2').src = aSrc;
    document.querySelector('#commitmentCard .step-image').src = aSrc;
    document.getElementById('setupCard').style.display = 'block';
}

function gcd(a, b) {
    while (b) { [a, b] = [b, a % b]; }
    return a;
}

function modInverse(a, m) {
    // Extended Euclidean Algorithm
    a = ((a % m) + m) % m;
    let [old_r, r_val] = [a, m];
    let [old_s, s_val] = [1, 0];
    while (r_val !== 0) {
        const q = Math.floor(old_r / r_val);
        [old_r, r_val] = [r_val, old_r - q * r_val];
        [old_s, s_val] = [s_val, old_s - q * s_val];
    }
    if (old_r !== 1) return null; // no inverse
    return ((old_s % m) + m) % m;
}

function startSetup() {
    n = parseInt(document.getElementById('inputN').value);
    s = parseInt(document.getElementById('inputS').value);

    if (s >= n) { alert("Das Geheimnis s muss kleiner als der Modulus n sein!"); return; }
    if (gcd(s, n) !== 1) { alert("s muss teilerfremd zu n sein! Wähle ein s, das kein Vielfaches von p oder q ist."); return; }

    v = (s * s) % n;

    // Werte-Kasten rechts befüllen
    document.getElementById('outputP').value = parseInt(document.getElementById('inputP').value);
    document.getElementById('outputQ').value = parseInt(document.getElementById('inputQ').value);
    document.getElementById('outputN').value = n;
    document.getElementById('outputS').value = honest ? s : '? (unberechenbar)';
    document.getElementById('outputV').value = v;

    let sSq = s * s;
    if (honest) {
        document.getElementById('setupResult').innerHTML =
            `<strong>Öffentliche Werte:</strong> ${O('n')} = ${n}, ${O('v')} = ${v}<br>` +
            `Wobei ${O('v')} = ${P('s')}² mod ${O('n')}<br>` +
            `${O('v')} = ${P(s)}² mod ${O(n)} = ${sSq} mod ${O(n)} = ${O(v)}<br>` +
            `<strong>A's Geheimnis:</strong> ${P('s')} = ${P(s)} (ist Privat, wird also nicht übertragen!)`;
        document.getElementById('commitmentHonest').style.display = 'block';
        document.getElementById('commitmentLying').style.display = 'none';
    } else {
        document.getElementById('setupResult').innerHTML =
            `<strong>Öffentliche Werte:</strong> ${O('n')} = ${n}, ${O('v')} = ${v}<br>` +
            `Wobei ${O('v')} = ${P('s')}² mod ${O('n')}<br>` +
            `${O('v')} = ${P(s)}² mod ${O(n)} = ${sSq} mod ${O(n)} = ${O(v)}<br>` +
            `<span style="color:red;font-weight:bold;">A kennt ${P('s')} nicht! A muss im nächsten Schritt raten.</span>`;
        document.getElementById('commitmentHonest').style.display = 'none';
        document.getElementById('commitmentLying').style.display = 'block';
    }

    document.getElementById('commitmentCard').style.display = 'block';
}

function showStep(num) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    let stepEl = document.getElementById('step' + num);
    if(stepEl) stepEl.classList.add('active');
}

function runCommitment() {
    if(!n) n = parseInt(document.getElementById('inputN').value);
    r = Math.floor(Math.random() * (n - 2)) + 1;

    x = (r * r) % n;
    document.getElementById('outputR').value = r;
    document.getElementById('outputX').value = x;
    document.getElementById('resStep1').innerHTML =
        `A hat gewählt: <span class="math">${P('r')} = ${P(r)}</span> (geheim).<br>` +
        `A sendet <span class="math">${O('x')} = ${O(x)}</span> an B<br>` +
        `Wobei <span class="math">${O('x')} = ${P('r')}² mod ${O('n')}</span>.<br>` +
        `Also <span class="math">${O('x')} = ${P(r)}² mod ${O(n)}</span>`;

    document.getElementById('challengeHonest').style.display = 'block';
    document.getElementById('challengeLying').style.display = 'none';
    document.getElementById('challengeCard').style.display = 'block';
}

function runLyingCommitment(guess) {
    guessedB = guess;
    if(!n) n = parseInt(document.getElementById('inputN').value);

    if (guess === 0) {
        // Normal: x = r² mod n, kann nur b=0 beantworten
        r = Math.floor(Math.random() * (n - 2)) + 1;
        x = (r * r) % n;
        preparedY = null;
        document.getElementById('outputR').value = r;
        document.getElementById('outputX').value = x;
        document.getElementById('resStep1').innerHTML =
            `<span style="color:red;font-weight:bold;">[A lügt, erwartet ${O('b')} = 0]</span><br><br>` +
            `<strong>Strategie:</strong> Wenn ${O('b')}=0, muss A ein ${O('y')} liefern, sodass <span class="math">${O('y')}² ≡ ${O('x')} (mod ${O('n')})</span>.<br>` +
            `Das ist einfach, wenn A ein echtes ${P('r')} kennt, denn dann ist ${O('y')} = ${P('r')} und es gilt <span class="math">${P('r')}² = ${O('x')}</span>.<br>` +
            `Deshalb berechnet A das Commitment ganz normal:<br><br>` +
            `A wählt zufällig: ${P('r')} = <span class="math">${P(r)}</span><br>` +
            `A berechnet: <span class="math">${O('x')} = ${P('r')}² mod ${O('n')} = ${P(r)}² mod ${O(n)} = ${O(x)}</span><br>` +
            `A sendet ${O('x')} = <span class="math">${O(x)}</span> an B.<br><br>` +
            `<strong>Problem:</strong> Falls B stattdessen ${O('b')}=1 wählt, bräuchte A <span class="math">${O('y')} = ${P('r')} · ${P('s')}</span> — aber A kennt ${P('s')} nicht!`;
    } else {
        // Vorbereitet: y zufällig, x = y² · v⁻¹ mod n, kann nur b=1 beantworten
        let y_val = Math.floor(Math.random() * (n - 2)) + 1;
        let vInv = modInverse(v, n);
        if (vInv === null) {
            document.getElementById('resStep1').innerHTML =
                `<span style="color:red;">Fehler: ${O('v')} hat kein modulares Inverses mod ${O('n')}. Wähle andere Parameter.</span>`;
            return;
        }
        x = (y_val * y_val % n * vInv) % n;
        preparedY = y_val;
        r = null;
        document.getElementById('outputR').value = '? (unberechenbar)';
        document.getElementById('outputX').value = x;
        let ySq = y_val * y_val;
        let ySqModN = ySq % n;
        let step3 = (ySqModN * vInv) % n;
        document.getElementById('resStep1').innerHTML =
            `<span style="color:red;font-weight:bold;">[A lügt, erwartet ${O('b')} = 1]</span><br><br>` +
            `<strong>Strategie:</strong> Wenn ${O('b')}=1, muss A ein ${O('y')} liefern, sodass <span class="math">${O('y')}² ≡ ${O('x')} · ${O('v')} (mod ${O('n')})</span>.<br>` +
            `A berechnet: <span class="math">${O('x')} = ${O('y')}² · ${O('v')}⁻¹ mod ${O('n')}</span><br><br>` +
            `<strong>1.</strong> Wähle ${O('y')} zufällig: ${O('y')} = <span class="math">${O(y_val)}</span><br>` +
            `<strong>2.</strong> ${O('y')} einsetzen: <span class="math">${O('y')}² = ${O(y_val)}² = ${ySq}</span> → <span class="math">${ySq} mod ${O(n)} = ${ySqModN}</span><br>` +
            `<strong>3.</strong> Berechne Inverses von ${O('v')}: <span class="math">${O('v')}⁻¹ mod ${O(n)} = ${O(v)}⁻¹ mod ${O(n)} = ${vInv}</span><br>` +
            `<strong>4.</strong> Berechne ${O('x')}: <span class="math">${O('x')} = ${ySqModN} · ${vInv} mod ${O(n)} = ${O(step3)}</span><br>` +
            `<strong>5.</strong> Sende ${O('x')} = <span class="math">${O(x)}</span> an B.<br><br>` +
            `<strong>Problem:</strong> Falls B stattdessen ${O('b')}=0 wählt, muss A ${O('y')} = ${P('r')} schicken! ` +
            `Allerdings ist die Berechnung von ${P('r')} aus <span class="math">${O('x')} = ${P('r')}² mod ${O('n')}</span> quasi unmöglich (Faktorisierungsproblem)!`;
    }

    // Im Lügner-Modus: Challenge + Verify direkt für beide b-Werte anzeigen
    document.getElementById('challengeHonest').style.display = 'none';
    document.getElementById('challengeLying').style.display = 'block';
    document.getElementById('challengeCard').style.display = 'block';

    document.getElementById('verifyHonest').style.display = 'none';
    document.getElementById('verifyLying').style.display = 'block';
    document.getElementById('verifyCard').style.display = 'block';

    runLyingVerifyBoth();
}

function runChallenge(choice) {
    b = choice;
    document.getElementById('resStep2').innerHTML =
        `B hat gewählt: <span class="math">${O('b')} = ${b}</span>`;

    runResponseAndVerify();
}

function runResponseAndVerify() {
    document.getElementById('verifyHonest').style.display = 'block';
    document.getElementById('verifyLying').style.display = 'none';
    document.getElementById('verifyCard').style.display = 'block';
    let y;
    let explanation = "";
    let calcCheck = "";
    let passed = false;

    if (b === 0) {
        y = r;
        explanation = `Da ${O('b')}=0, sendet A einfach ihre Zufallszahl <span class="math">${O('y')} = ${P('r')}</span>.`;
        let ySq = (y * y);
        let check = ySq % n;
        calcCheck = `Prüfung: ${O(y)}² mod ${O(n)} = ${ySq} mod ${O(n)} = <strong>${check}</strong>. <br>Erwartet war ${O('x')} = <strong>${O(x)}</strong>.`;
        passed = (check === x);
    } else {
        y = (r * s) % n;
        explanation = `Da ${O('b')}=1, sendet A <span class="math">${O('y')} = ${P('r')} · ${P('s')} mod ${O('n')}</span>.`;
        let leftSideVal = (y * y) % n;
        let rightSideVal = (x * v) % n;
        calcCheck = `Prüfung (${O('y')}² ≡ ${O('x')}·${O('v')}):<br>` +
                    `Links: ${O(y)}² mod ${O(n)} = <strong>${leftSideVal}</strong><br>` +
                    `Rechts: ${O(x)} · ${O(v)} mod ${O(n)} = ${x*v} mod ${O(n)} = <strong>${rightSideVal}</strong>`;
        passed = (leftSideVal === rightSideVal);
    }

    let resultText = passed ?
        `<span class="success">✔ Beweis gültig!</span>` :
        `<span style="color:red">✘ Beweis fehlgeschlagen!</span>`;

    document.getElementById('verifyLog').innerHTML =
        `<div class="log-entry">` +
        `<p>${explanation}</p>` +
        `<p>A sendet: ${O('y')} = <span class="math">${O(y)}</span></p>` +
        `<p>${calcCheck}</p>` +
        `<h3>Ergebnis: ${resultText}</h3>` +
        `</div>`;
}

function runLyingVerifyBoth() {
    // Berechne beide Fälle und zeige sie nebeneinander
    let resultB0 = computeLyingCase(0);
    let resultB1 = computeLyingCase(1);

    let colB0 = document.getElementById('verifyColB0');
    let colB1 = document.getElementById('verifyColB1');

    colB0.className = 'side-col ' + (resultB0.passed ? 'col-success' : 'col-fail');
    colB1.className = 'side-col ' + (resultB1.passed ? 'col-success' : 'col-fail');

    let matchB0 = (guessedB === 0) ? ' ← A hat das erwartet' : '';
    let matchB1 = (guessedB === 1) ? ' ← A hat das erwartet' : '';

    colB0.innerHTML = `<h3>Fall: ${O('b')} = 0${matchB0}</h3>` + formatVerifyResult(resultB0);
    colB1.innerHTML = `<h3>Fall: ${O('b')} = 1${matchB1}</h3>` + formatVerifyResult(resultB1);
}

function computeLyingCase(bVal) {
    let y, explanation, calcCheck, passed;

    if (guessedB === 0) {
        // A hat x = r² mod n berechnet (normal)
        if (bVal === 0) {
            y = r;
            explanation = `B fragt nach ${P('r')}. A kennt ${P('r')} und sendet <span class="math">${O('y')} = ${P('r')} = ${P(r)}</span>.`;
            let check = (y * y) % n;
            calcCheck = `Prüfung: ${O('y')}² mod ${O('n')} = ${O(y)}² mod ${O(n)} = <strong>${check}</strong>.<br>Erwartet: ${O('x')} = <strong>${O(x)}</strong>.`;
            passed = (check === x);
        } else {
            y = r; // A hat kein s, sendet r als Verzweiflungsversuch
            explanation = `B fragt nach ${O('y')} = ${P('r')}·${P('s')}. A kennt ${P('s')} nicht! Sendet <span class="math">${O('y')} = ${P('r')} = ${P(r)}</span> als Verzweiflungsversuch.`;
            let leftSideVal = (y * y) % n;
            let rightSideVal = (x * v) % n;
            calcCheck = `Prüfung (${O('y')}² ≡ ${O('x')}·${O('v')}):<br>` +
                        `Links: ${O(y)}² mod ${O(n)} = <strong>${leftSideVal}</strong><br>` +
                        `Rechts: ${O(x)} · ${O(v)} mod ${O(n)} = <strong>${rightSideVal}</strong>`;
            passed = (leftSideVal === rightSideVal);
        }
    } else {
        // A hat x = y²·v⁻¹ mod n berechnet (vorbereitet für b=1)
        if (bVal === 1) {
            y = preparedY;
            explanation = `B fragt nach ${O('y')} = ${P('r')}·${P('s')}. A hat ${O('y')} vorbereitet und sendet <span class="math">${O('y')} = ${O(y)}</span>.`;
            let leftSideVal = (y * y) % n;
            let rightSideVal = (x * v) % n;
            calcCheck = `Prüfung (${O('y')}² ≡ ${O('x')}·${O('v')}):<br>` +
                        `Links: ${O(y)}² mod ${O(n)} = <strong>${leftSideVal}</strong><br>` +
                        `Rechts: ${O(x)} · ${O(v)} mod ${O(n)} = <strong>${rightSideVal}</strong>`;
            passed = (leftSideVal === rightSideVal);
        } else {
            y = preparedY; // A hat kein r, sendet preparedY als Verzweiflungsversuch
            explanation = `B fragt nach ${P('r')}. A hat kein gültiges ${P('r')}! Sendet <span class="math">${O('y')} = ${O(y)}</span> als Verzweiflungsversuch.`;
            let check = (y * y) % n;
            calcCheck = `Prüfung: ${O('y')}² mod ${O('n')} = ${O(y)}² mod ${O(n)} = <strong>${check}</strong>.<br>Erwartet: ${O('x')} = <strong>${O(x)}</strong>.`;
            passed = (check === x);
        }
    }

    return { y, explanation, calcCheck, passed };
}

function formatVerifyResult(result) {
    let resultText = result.passed
        ? `<span class="success">✔ Beweis gültig!</span>`
        : `<span style="color:red">✘ Beweis fehlgeschlagen!</span>`;

    return `<div class="log-entry">` +
        `<p>${result.explanation}</p>` +
        `<p>A sendet: ${O('y')} = <span class="math">${O(result.y)}</span></p>` +
        `<p>${result.calcCheck}</p>` +
        `<h3>Ergebnis: ${resultText}</h3>` +
        `</div>`;
}

function resetProof() {
    document.getElementById('resStep1').innerHTML = "";
    document.getElementById('resStep2').innerHTML = "";
    document.getElementById('verifyLog').innerHTML = "";
    document.getElementById('verifyLogB0').innerHTML = "";
    document.getElementById('verifyLogB1').innerHTML = "";
    document.getElementById('challengeCard').style.display = 'none';
    document.getElementById('verifyCard').style.display = 'none';
    guessedB = null;
    preparedY = null;
}
