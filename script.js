let isFirstCalculation = true;
let totalTapeWidth = 0;
let finalMessageTimeout;

const platformRates = {
  spotify: 0.003,
  apple: 0.01,
  tidal: 0.0125
};

const tape = document.getElementById("tape-extension");
const scrollContainer = document.getElementById("tapeScroll");
const finalMessage = document.getElementById("end-section");
const pxPerDollar = 150;

// only add scroll listener ONCE
scrollContainer.addEventListener("scroll", () => {
  // no-op or reserved for future if needed
});

document.getElementById("calculateBtn").addEventListener("click", () => {
  const streams = parseInt(document.getElementById("streamInput").value) || 0;
  const platform = document.getElementById("platformSelect").value;
  const rate = platformRates[platform];
  const payout = streams * rate;
  const formatted = Number(payout).toFixed(2);

  const newTapeLength = payout * pxPerDollar;

  // First time: apply slow class & delay the width update
  if (isFirstCalculation) {
    tape.classList.add("slow");
    tape.style.width = `0px`; // reset if needed

    requestAnimationFrame(() => {
      // Slight delay so transition applies
      setTimeout(() => {
        totalTapeWidth += newTapeLength;
        tape.style.width = `${totalTapeWidth}px`;

      }, 50);
    });

    isFirstCalculation = false;
  } else {
    tape.classList.remove("slow");
    totalTapeWidth += newTapeLength; // keep adding!
    tape.style.width = `${totalTapeWidth}px`;
  }

  // Update text
  const earningsText = document.getElementById("earningsText");
  earningsText.textContent = `YOUR FAVORITE ARTIST ONLY EARNED $${formatted}`;
  earningsText.classList.add("visible");

  // Spin reels
  document.querySelectorAll(".reel").forEach(reel => {
    reel.style.animationPlayState = "running";
  });

  // Scroll to start
  scrollContainer.scrollTo({
    left: 0,
    behavior: "smooth"
  });

  // Fade-in tick line
  const tickLine = document.getElementById('tickLine');
  const tickSpacing = 5;
  const maxTickValue = Math.ceil(payout / tickSpacing) * tickSpacing + tickSpacing * 4;
  tickLine.style.width = `${maxTickValue * pxPerDollar}px`;
  tickLine.innerHTML = "";
  tickLine.classList.add("visible");

  for (let value = tickSpacing; value <= maxTickValue; value += tickSpacing) {
    const tick = document.createElement('div');
    tick.classList.add('tick');
    tick.style.left = `${value * pxPerDollar}px`;

    const label = document.createElement('span');
    label.textContent = `$${value}`;
    tick.appendChild(label);
    tickLine.appendChild(tick);

    
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  // Reset tape width visually
  tape.style.width = `0px`;

  // Reset tape width tracker
  totalTapeWidth = 0;

  // Clear earnings text and input
  document.getElementById("earningsText").textContent = "";
  document.getElementById("streamInput").value = "";

  // Pause reel animations
  document.querySelectorAll(".reel").forEach(reel => {
    reel.style.animationPlayState = "paused";
  });

  earningsText.classList.remove("visible");

  // Reset tick line
  const tickLine = document.getElementById("tickLine");
  tickLine.innerHTML = "";
  tickLine.classList.remove("visible");
  tickLine.style.width = "0px";

  // Reset scroll to start
  scrollContainer.scrollTo({
    left: 0,
    behavior: "smooth"
  });

  // Optional: make the first calculation slow again
  isFirstCalculation = true;

  clearTimeout(finalMessageTimeout);
  finalMessage.classList.remove("show");
  finalMessage.style.opacity = "0";

  // Force a reflow to cancel any transition in progress
  finalMessage.style.transition = 'none';
  finalMessage.style.opacity = '0';
  
  // Wait a tick, then restore transition (clean slate)
  requestAnimationFrame(() => {
    finalMessage.style.transition = 'opacity 0.5s ease-in';
  });
  
});

function generateTicks(upToValue) {
  const tickLine = document.getElementById('tickLine');
  tickLine.innerHTML = "";
  tickLine.classList.add("visible");

  tickLine.style.width = `${upToValue * pxPerDollar}px`;

  for (let value = 5; value <= upToValue; value += 5) {
    const tick = document.createElement('div');
    tick.classList.add('tick');
    tick.style.left = `${value * pxPerDollar}px`;

    const label = document.createElement('span');
    label.textContent = `$${value}`;
    tick.appendChild(label);
    tickLine.appendChild(tick);
  }
}

//skip button

document.getElementById("skipBtn").addEventListener("click", () => {
  const tickLine = document.getElementById("tickLine");
  const fakeMaxDollar = 100;
  const tickSpacing = 5;

  // Extend tick line visually
  tickLine.innerHTML = "";
  tickLine.style.width = `${fakeMaxDollar * pxPerDollar}px`;
  tickLine.classList.add("visible");

  for (let value = 5; value <= fakeMaxDollar; value += tickSpacing) {
    const tick = document.createElement("div");
    tick.classList.add("tick");
    tick.style.left = `${value * pxPerDollar}px`;

    const label = document.createElement("span");
    label.textContent = `$${value}`;
    tick.appendChild(label);
    tickLine.appendChild(tick);
  }

  // Cancel any existing timeout and force-hide the message
  clearTimeout(finalMessageTimeout);
  finalMessage.classList.remove("show");
  finalMessage.style.opacity = "0";

  // Force reflow so transition can retrigger
  void finalMessage.offsetWidth;

  // 👇 Clear inline override so class-based fade can work
  finalMessage.style.opacity = "";

  // Scroll to the fake end
  scrollContainer.scrollTo({
    left: fakeMaxDollar * pxPerDollar + 300,
    behavior: "smooth"
  });

  // Show the final message after scroll settles
  finalMessageTimeout = setTimeout(() => {
    finalMessage.classList.add("show");
  }, 800);
});






