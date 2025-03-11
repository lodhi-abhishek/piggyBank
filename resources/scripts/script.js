function clearData() {
  localStorage.setItem("appCollect", "");
  window.location.reload();
}

let collect = localStorage.getItem("appCollect")
  ? JSON.parse(localStorage.getItem("appCollect"))
  : {
      timeline: [],
    };

// 0 - Jan to 11 - Dec by using getMonth() from date object
let months = [
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

// Savings Logic
let savings = 0;

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

/**
 *
 * Feed Form Logic
 * */

document.getElementById("btnFeed").addEventListener("click", function () {
  let toggleType = document.querySelector("#toggleType");
  let feedFrom = document.querySelector(".feed-form");
  let btnMenu = document.querySelector("#btnMenu");
  let btnClose = document.querySelector("#btnClose");

  // to open the feed form
  if (this.innerText == "FEED") {
    feedFrom.style.display = "block";
    this.innerHTML = '<i class="material-icons">check</i>';
    btnMenu.style.display = "none";
    btnClose.style.display = "block";
  } else {
    // to close the feed form
    let amount = document.querySelector("#inptAmount").value;
    let type = toggleType.checked ? "withdraw" : "deposit";

    if (amount) newFeed(amount, type);

    closeFeedForm();
  }
});

// Value add using the Enter button
document.querySelector("#inptAmount").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let type = document.querySelector("#toggleType").checked
      ? "withdraw"
      : "deposit";

    if (this.value) newFeed(this.value, type);

    closeFeedForm();
  }
});

// Change color via toggle value
// try to convert function() to arrow function you'll learn something new
document.querySelector("#toggleType").addEventListener("change", function () {
  let toggleTypeClass = this.parentElement;
  let btnFeed = document.getElementById("btnFeed");

  if (this.checked) {
    toggleTypeClass.children[2].style.color = "#f393bc";
    btnFeed.style.backgroundColor = "#f393bc";
    console.log(toggleTypeClass.children[2]);
    toggleTypeClass.children[0].style.color = "rgba(201, 179, 189, 0.52)";
  } else {
    console.log(toggleTypeClass.children[0]);
    toggleTypeClass.children[0].style.color = "#89de8d";
    btnFeed.style.backgroundColor = "#89de8d";
    toggleTypeClass.children[2].style.color = "rgba(201, 179, 189, 0.52)";
  }
});

// material close button
document.querySelector("#btnClose").addEventListener("click", closeFeedForm);

renderTimeLine(collect.timeline, 5);

// Feed from Logic

function newFeed(amount, type) {
  amount = Number(amount);
  if (type == "withdraw" && saving < amount) {
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
}
