let highestBid = 1000;
const endTime = new Date().getTime() + 60000; // 1 minute from now

function updateTimer() {
  const now = new Date().getTime();
  const distance = endTime - now;

  if (distance < 0) {
    document.getElementById("countdown").innerText = "Auction Ended";
    document.getElementById("message").innerText = "Auction has ended!";
    document.querySelector("button").disabled = true;
    return;
  }

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("countdown").innerText = seconds + "s";
}

setInterval(updateTimer, 1000);

function placeBid() {
  const bidInput = document.getElementById("bidAmount");
  const bidValue = parseInt(bidInput.value);

  if (isNaN(bidValue) || bidValue <= highestBid) {
    document.getElementById("message").innerText = "Bid must be higher than ₹" + highestBid;
    return;
  }

  highestBid = bidValue;
  document.getElementById("highestBid").innerText = highestBid;
  document.getElementById("message").innerText = "Bid placed successfully!";
  addToBidLog(highestBid);
  bidInput.value = "";
}

function addToBidLog(amount) {
  const log = document.getElementById("bidLog");
  const entry = document.createElement("li");
  entry.innerText = `New bid: ₹${amount} at ${new Date().toLocaleTimeString()}`;
  log.prepend(entry);
}
