// --- Fibonacci por "fast doubling" con BigInt ---
// Devuelve [F(n), F(n+1)]
function fibDoubling(n) {
  if (n === 0n) return [0n, 1n];
  const [a, b] = fibDoubling(n >> 1n); // n/2
  const c = a * (2n * b - a);          // F(2k)   = F(k) * (2*F(k+1) – F(k))
  const d = a * a + b * b;             // F(2k+1) = F(k)^2 + F(k+1)^2
  if ((n & 1n) === 0n) {
    return [c, d];
  } else {
    return [d, c + d];
  }
}

// Wrapping: calcula F(n) para n >= 0 (Number o BigInt)
function fibonacci(n) {
  if (typeof n !== "bigint") n = BigInt(n);
  if (n < 0n) throw new Error("n debe ser ≥ 0");
  return fibDoubling(n)[0];
}

// --- UI ---
const form = document.getElementById("fib-form");
const input = document.getElementById("n");
const err = document.getElementById("error");

const sectionResultado = document.getElementById("resultado");
const outN = document.getElementById("out-n");
const outFn = document.getElementById("out-fn");
const outLen = document.getElementById("out-len");
const copyBtn = document.getElementById("copy-btn");
const copyMsg = document.getElementById("copy-msg");

// Calcula y muestra
form.addEventListener("submit", (e) => {
  e.preventDefault();
  err.textContent = "";
  copyMsg.textContent = "";

  const raw = input.value.trim();
  if (raw === "") {
    err.textContent = "Por favor, ingresa un número.";
    sectionResultado.hidden = true;
    return;
  }

  // Validación: entero >= 0
  if (!/^\d+$/.test(raw)) {
    err.textContent = "Debe ser un entero no negativo (sin decimales ni signos).";
    sectionResultado.hidden = true;
    return;
  }

  try {
    const n = BigInt(raw);
    const fn = fibonacci(n);
    const str = fn.toString();
    outN.textContent = n.toString();
    outFn.value = str;
    outLen.textContent = str.length.toString();
    sectionResultado.hidden = false;
  } catch (ex) {
    console.error(ex);
    err.textContent = "Ocurrió un error al calcular. Revisa el valor ingresado.";
    sectionResultado.hidden = true;
  }
});

// Copiar resultado
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outFn.value);
    copyMsg.textContent = "¡Copiado al portapapeles!";
    setTimeout(() => (copyMsg.textContent = ""), 2000);
  } catch {
    copyMsg.textContent = "No se pudo copiar automáticamente.";
  }
});

// Valor de ejemplo
input.value = "100";