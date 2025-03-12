document.getElementById("btnMenu").addEventListener("click", function () {
  let sidebar = document.querySelector(".sidebar");
  let menuOverlay = document.querySelector(".sidebar-overlay");

  sidebar.style.transform = "translateX(0)";
  menuOverlay.style.opacity = "1";
  menuOverlay.style.visibility = "visible";
});

document.querySelector(".sidebar-overlay").addEventListener("click", closeMenu);

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeMenu();
  }
});

function closeMenu() {
  let sidebar = document.querySelector(".sidebar");
  let menuOverlay = document.querySelector(".sidebar-overlay");

  sidebar.style.transform = "translateX(-100%)";
  menuOverlay.style.opacity = "0";
  menuOverlay.style.visibility = "hidden";
}

function renderTimeLine(timeline, limit = -1) {
  let lstTimeline = document.querySelector("#listTimeline");
  lstTimeline.innerHTML = "";

  for (let i = timeline.length - 1; i >= 0; i--) {
    // Excess Items not shown
    if (i == timeline.length - limit) break;

    let item = document.createElement("li");
    item.classList.add(timeline[i].type); // withdraw or deposit class

    let numAmount = timeline[i].amount
      .toLocaleString("hi-IN", { style: "currency", currency: "INR" })
      .split(".")[0];

    let title = document.createElement("span");
    title.classList.add("title");
    title.innerText =
      timeline[i].type == "deposit"
        ? "Deposit of " + numAmount
        : "Withdraw of " + numAmount;

    let time = document.createElement("span");
    time.classList.add("time");
    time.innerText = timeline[i].time;

    let amount = document.createElement("span");
    amount.classList.add("amount");
    amount.innerText = numAmount;

    item.appendChild(title);
    item.appendChild(time);
    item.appendChild(amount);

    lstTimeline.appendChild(item);
  }
}

function clearData() {
  localStorage.setItem("appCollect", "");
  window.location.reload();
}
