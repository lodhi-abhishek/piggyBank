import "./style.css";
import "./flow.js";
import { renderTimeLine } from "./flow.js";
import Chart from "chart.js/auto";

export let collect = localStorage.getItem("appCollect")
  ? JSON.parse(localStorage.getItem("appCollect"))
  : {
      timeline: [],
    };

export let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export let savings = 0;

for (let i = 0; i < collect.timeline.length; i++) {
  if (collect.timeline[i].type === "deposit") {
    savings += collect.timeline[i].amount;
  } else {
    savings -= collect.timeline[i].amount;
  }
}

document.getElementById("txtSavings").innerText = savings
  .toLocaleString("hi-IN", { style: "currency", currency: "INR" })
  .split(".")[0];

renderTimeLine(collect.timeline, 6);

export function newFeed(amount, type) {
  amount = Number(amount);
  if (type == "withdraw" && savings < amount) {
    alert("Insufficient balance");
    return;
  }

  let date = new Date();
  let item = {
    time:
      months[date.getMonth()] +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear(),
    amount: amount,
    type: type,
  };

  collect.timeline.push(item);

  if (type == "deposit") {
    savings += amount;
  } else {
    savings -= amount;
  }

  document.querySelector("#txtSavings").innerText = savings
    .toLocaleString("hi-IN", { style: "currency", currency: "INR" })
    .split(".")[0];

  renderTimeLine(collect.timeline, 5);
  console.log("reloaded charts");

  // Ensure deposits, withdrawals, and netSavings are recalculated
  deposits = [];
  withdrawals = [];
  netSavings = [];

  for (
    let i = collect.timeline.length >= 7 ? collect.timeline.length - 7 : 0;
    i < collect.timeline.length;
    i++
  ) {
    let amount = 0;

    if (collect.timeline.length >= 7 && i == collect.timeline.length - 7) {
      for (let j = 0; j < collect.timeline.length - 8; j++)
        amount += collect.timeline[j].amount;
    }

    amount += collect.timeline[i].amount;

    if (collect.timeline[i].type == "deposit") {
      deposits.push(amount);
      if (netSavings.length > 0)
        netSavings.push(netSavings[netSavings.length - 1] + amount);
    } else {
      withdrawals.push(amount);
      if (netSavings.length > 0)
        netSavings.push(netSavings[netSavings.length - 1] - amount);
    }

    if (netSavings.length == 0) netSavings.push(amount);
  }

  reloadCharts(deposits, withdrawals, netSavings);
  localStorage.setItem("appCollect", JSON.stringify(collect));
}

export function closeFeedForm() {
  let toggleType = document.querySelector("#toggleType");
  let feedFrom = document.querySelector(".feed-form");
  let btnMenu = document.querySelector("#btnMenu");
  let btnClose = document.querySelector("#btnClose");
  let btnfeed = document.getElementById("btnFeed");

  feedFrom.style.display = "none";
  btnfeed.innerHTML = "FEED";

  document.querySelector("#inptAmount").value = "";

  btnClose.style.display = "none";
  btnMenu.style.display = "block";

  if (btnfeed.style.backgroundColor != "rgb(137, 222, 141)") {
    btnfeed.style.backgroundColor = "#89de8d";
    toggleType.checked = false;
    toggleType.dispatchEvent(new Event("change"));
  }
}

document.getElementById("btnFeed").addEventListener("click", function () {
  let toggleType = document.querySelector("#toggleType");
  let feedFrom = document.querySelector(".feed-form");
  let btnMenu = document.querySelector("#btnMenu");
  let btnClose = document.querySelector("#btnClose");

  if (this.innerText == "FEED") {
    feedFrom.style.display = "block";
    this.innerHTML = '<i class="material-icons">check</i>';
    btnMenu.style.display = "none";
    btnClose.style.display = "block";
  } else {
    let amount = document.querySelector("#inptAmount").value;
    let type = toggleType.checked ? "withdraw" : "deposit";

    if (amount) newFeed(amount, type);

    closeFeedForm();
  }
});

document.querySelector("#inptAmount").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let type = document.querySelector("#toggleType").checked
      ? "withdraw"
      : "deposit";

    if (this.value) newFeed(this.value, type);

    closeFeedForm();
  }
});

document.querySelector("#toggleType").addEventListener("change", function () {
  let toggleTypeClass = this.parentElement;
  let btnFeed = document.getElementById("btnFeed");

  if (this.checked) {
    toggleTypeClass.children[2].style.color = "#f393bc";
    btnFeed.style.backgroundColor = "#f393bc";
    toggleTypeClass.children[0].style.color = "rgba(201, 179, 189, 0.52)";
  } else {
    toggleTypeClass.children[0].style.color = "#89de8d";
    btnFeed.style.backgroundColor = "#89de8d";
    toggleTypeClass.children[2].style.color = "rgba(201, 179, 189, 0.52)";
  }
});

document.querySelector("#btnClose").addEventListener("click", closeFeedForm);

// chart logic

let deposits = [];
let withdrawals = [];
let netSavings = [];

for (
  let i = collect.timeline.length >= 7 ? collect.timeline.length - 7 : 0;
  i < collect.timeline.length;
  i++
) {
  let amount = 0;
  /* add the previous amount form the staring net amount */
  if (collect.timeline.length >= 7 && i == collect.timeline.length - 7) {
    for (let j = 0; j < collect.timeline.length - 8; j++)
      amount += collect.timeline[j].amount;
  }

  amount += collect.timeline[i].amount;

  if (collect.timeline[i].type == "deposit") {
    deposits.push(amount);
    if (netSavings.length > 0)
      netSavings.push(netSavings[netSavings.length - 1] + amount);
  } else {
    withdrawals.push(amount);
    if (netSavings.length > 0)
      netSavings.push(netSavings[netSavings.length - 1] - amount);
  }

  if (netSavings.length == 0) netSavings.push(amount);
}

let chartOptions = {
  maintainAspectRatio: false,
  elements: {
    point: {
      radius: 0,
    },
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
      },
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    x: {
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

let chartSav = document.querySelector("#chartSavings").getContext("2d");

let chartSavings = new Chart(chartSav, {
  type: "line",
  data: {
    labels: netSavings,
    datasets: [
      {
        data: netSavings,
        borderColor: "rgba(235, 211, 110, 0.6)",
        backgroundColor: "rgba(235, 211, 110, 0.6)",
        fill: true,
        borderWidth: 1,
        tension: 0.3,
      },
    ],
  },
  options: chartOptions,
});

let chtdepo = document.querySelector("#chartDeposits").getContext("2d");

let chartDeposits = new Chart(chtdepo, {
  type: "line",
  data: {
    labels: deposits,
    datasets: [
      {
        data: deposits,
        backgroundColor: "rgba(136, 222, 140, 0.6)",
        borderColor: "rgba(136, 222, 140, 0.6)",
        fill: true, // fill the background
        borderWidth: 1,
        tension: 0.3,
      },
    ],
  },
  options: chartOptions,
});

let chtwithdraw = document.getElementById("chartWithdraw").getContext("2d");

let chartWithdraw = new Chart(chtwithdraw, {
  type: "line",
  data: {
    labels: withdrawals,
    datasets: [
      {
        data: withdrawals,
        backgroundColor: "rgba(244, 147, 188, 0.6)",
        borderColor: "rgba(244, 147, 188, 0.6)",
        fill: true,
        borderWidth: 1,
        tension: 0.3, // Makes the line smoother and rounded
      },
    ],
  },
  options: chartOptions,
});

function reloadCharts(dataDeposits, dataWithdrawals, dataNetSavings) {
  chartDeposits.config.data.labels = dataDeposits;
  chartDeposits.config.data.datasets[0].data = dataDeposits;
  chartDeposits.update();

  chartWithdraw.config.data.labels = dataWithdrawals;
  chartWithdraw.config.data.datasets[0].data = dataWithdrawals;
  chartWithdraw.update();

  chartSavings.config.data.labels = dataNetSavings;
  chartSavings.config.data.datasets[0].data = dataNetSavings;
  chartSavings.update();
}
