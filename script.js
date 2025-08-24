(function () {
  function println(html) {
    const out = document.getElementById("output");
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function randInt1to(n) {
    // Prefer cryptographic RNG if available
    if (window.crypto && crypto.getRandomValues) {
      const x = new Uint32Array(1);
      crypto.getRandomValues(x);
      return 1 + (x[0] % n);
    }
    return 1 + Math.floor(Math.random() * n);
  }

  function rollDice(specRaw) {
    const spec = (specRaw || "").trim();
    const m = spec.match(/^(\d{1,3})\s*[dD]\s*(\d{1,3})$/);
    if (!m) {
      println('<span class="err">Invalid format. Use NdM (e.g. 2d6)</span>');
      return;
    }
    const count = parseInt(m[1], 10);
    const sides = parseInt(m[2], 10);

    if (count < 1 || count > 100) {
      println('<span class="err">Dice count must be 1..100.</span>');
      return;
    }
    if (sides < 2 || sides > 1000) {
      println('<span class="err">Sides must be 2..1000.</span>');
      return;
    }

    const rolls = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const r = randInt1to(sides);
      rolls.push(r);
      total += r;
    }
    println(`Rolled <span class="cmd">${count}d${sides}</span> → [${rolls.join(", ")}] total=<span class="ok">${total}</span>`);
  }

  function help() {
    println("Commands:");
    println('<span class="cmd">roll NdM</span> - Roll N dice with M sides (e.g. roll 2d6)');
    println('<span class="cmd">clear</span> - Clear the screen');
    println('<span class="cmd">help</span> - Show this help');
  }

  function handleCommand(cmd) {
    const out = document.getElementById("output");
    const line = (cmd || "").trim();
    if (!line) return;
    println(`<span class="cmd">$ ${line.replace(/</g, "&lt;")}</span>`);

    const [head, ...rest] = line.split(/\s+/);
    if (head === "roll") {
      const spec = rest.join("");
      rollDice(spec);
    } else if (head === "help") {
      help();
    } else if (head === "clear") {
      out.innerHTML = "";
    } else {
      println('<span class="err">Unknown command</span>');
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    if (!input) {
      println('<span class="err">Initialization error: input element not found.</span>');
      return;
    }
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleCommand(input.value);
        input.value = "";
      }
    });
    println("Welcome to Dice Roller. Type <span class='cmd'>help</span> to begin.");
  });
})();
