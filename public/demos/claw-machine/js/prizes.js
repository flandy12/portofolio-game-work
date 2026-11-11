(function () {
  "use strict";
  var catalog = [
    { id: "teddy", name: "Teddy Bear", icon: "🧸", quantity: 5, difficulty: .3 },
    { id: "mystery", name: "Mystery Box", icon: "🎁", quantity: 3, difficulty: .5 },
    { id: "golden", name: "Golden Prize", icon: "🏆", quantity: 1, difficulty: .8 },
    { id: "duck", name: "Lucky Duck", icon: "🐥", quantity: 6, difficulty: .25 },
    { id: "robot", name: "Pocket Robot", icon: "🤖", quantity: 4, difficulty: .55 },
    { id: "candy", name: "Sweet Candy", icon: "🍭", quantity: 8, difficulty: .2 }
  ];

  function inventory(data) {
    catalog.forEach(function (prize) {
      if (!Number.isInteger(data.inventory[prize.id])) data.inventory[prize.id] = prize.quantity;
    });
  }

  function difficultyLabel(value) {
    if (value >= .7) return "Sangat sulit";
    if (value >= .5) return "Sulit";
    if (value >= .3) return "Sedang";
    return "Mudah";
  }

  function build(data, count) {
    inventory(data);
    var available = catalog.filter(function (p) { return data.inventory[p.id] > 0; });
    if (!available.length) return [];
    var output = [];
    for (var i = 0; i < count; i += 1) {
      var prize = available[Math.floor(Math.random() * available.length)];
      var col = i % 5;
      var row = Math.floor(i / 5);
      output.push({
        uid: prize.id + "-" + i + "-" + Date.now(), id: prize.id, name: prize.name,
        icon: prize.icon, difficulty: prize.difficulty,
        x: 12 + col * 19 + (Math.random() * 7 - 3.5),
        y: 43 + row * 38 + (Math.random() * 8 - 4),
        rotation: Math.round(Math.random() * 24 - 12)
      });
    }
    return output;
  }

  window.PrizeSystem = {
    catalog: catalog,
    difficultyLabel: difficultyLabel,
    populate: function (container, data) {
      var items = build(data, GAME_CONFIG.prizes.quantity);
      container.replaceChildren();
      items.forEach(function (item, index) {
        var node = document.createElement("div");
        node.className = "prize";
        node.textContent = item.icon;
        node.title = item.name + " — " + difficultyLabel(item.difficulty);
        node.dataset.uid = item.uid;
        node.dataset.difficulty = String(item.difficulty);
        node.style.left = item.x + "%"; node.style.top = item.y + "%";
        node.style.setProperty("--r", item.rotation + "deg");
        node.style.setProperty("--delay", (-index * .18) + "s");
        item.element = node; container.appendChild(node);
      });
      return items;
    },
    decrement: function (data, prize) {
      data.inventory[prize.id] = Math.max(0, (data.inventory[prize.id] || 0) - 1);
      data.wins.push({ prizeId: prize.id, wonAt: new Date().toISOString() });
      data.wins = data.wins.slice(-30);
    }
  };
}());
