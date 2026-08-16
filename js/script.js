const venueData = {
      "Ресторан": [
        {name:"Алазани", meta:"Грузинский ресторан · ул. Федерации, 7", value:"Алазани — ул. Федерации, 7"},
        {name:"Обломовъ", meta:"Русская кухня · Спасская ул., 19/9", value:"Обломовъ — Спасская ул., 19/9"},
        {name:"Дубинин", meta:"Ресторан · ул. Красноармейская, 41", value:"Дубинин — ул. Красноармейская, 41"},
        {name:"Gonzo", meta:"Ресторан · ул. Гончарова, 48", value:"Gonzo — ул. Гончарова, 48"}
      ],
      "Бар": [
        {name:"ЗАХОДИ, Я НАСТАИВАЮ", meta:"Бар · ул. Гончарова, 21А", value:"ЗАХОДИ, Я НАСТАИВАЮ — ул. Гончарова, 21А"},
        {name:"Бар Нутрь", meta:"Бар · ул. Карла Маркса, 13/2", value:"Бар Нутрь — ул. Карла Маркса, 13/2"},
        {name:"Harat's Pub", meta:"Паб · ул. Карла Маркса, 12", value:"Harat's Pub — ул. Карла Маркса, 12"},
        {name:"Vse Svoi", meta:"Коктейль-бар · ул. Федерации, 3", value:"Vse Svoi — ул. Федерации, 3"}
      ],
      "Парк": [
        {name:"Парк Дружбы народов", meta:"Центральная часть города", value:"Парк Дружбы народов"},
        {name:"Владимирский сад", meta:"ул. Плеханова, 10", value:"Владимирский сад — ул. Плеханова, 10"},
        {name:"Парк Победы", meta:"ул. Юности, 2", value:"Парк Победы — ул. Юности, 2"},
        {name:"Винновская Роща", meta:"Зелёная прогулочная зона", value:"Винновская Роща"}
      ],
      "Кинотеатр": [
        {name:"Синема Парк Аква Молл", meta:"ТРЦ Аквамолл · Московское ш., 108", value:"Синема Парк Аква Молл — Московское ш., 108"},
        {name:"Луна", meta:"Камышинская ул., 43А", value:"Кинотеатр «Луна» — Камышинская ул., 43А"},
        {name:"Матрица", meta:"Московское ш., 91", value:"Кинотеатр «Матрица» — Московское ш., 91"},
        {name:"Люмьер", meta:"ул. Радищева, 148", value:"Кинотеатр «Люмьер» — ул. Радищева, 148"}
      ]
    };

    const state = {
      date: "",
      time: "",
      type: "",
      venue: ""
    };

    const q = s => document.querySelector(s);
    const qa = s => [...document.querySelectorAll(s)];

    function renderVenues(type) {
      const box = q("#venueList");
      box.innerHTML = "";
      if (!type || !venueData[type]) return;

      const title = document.createElement("div");
      title.style.margin = "22px 0 10px";
      title.innerHTML = `<div class="step">Варианты</div><h2 style="font-size:22px">Что тебе нравится?</h2>`;
      box.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "grid venues";
      venueData[type].forEach((v, i) => {
        const wrapper = document.createElement("div");
        wrapper.className = "choice venue-card";
        const id = "venue_" + i;
        wrapper.innerHTML = `
          <input type="radio" name="venue" id="${id}" value="${v.value}">
          <label for="${id}">
            <strong>${v.name}</strong>
            <div class="venue-meta">${v.meta}</div>
          </label>`;
        grid.appendChild(wrapper);
      });
      box.appendChild(grid);

      qa('input[name="venue"]').forEach(input => {
        input.addEventListener("change", () => {
          state.venue = input.value;
          updateSummary();
        });
      });
    }

    function foodSummary() {
      if (state.type !== "Ресторан") return "—";
      const parts = [];
      const cuisine = q("#cuisine").value;
      const dish = q("#dish").value;
      const mood = q("#foodMood").value;
      const drink = q("#drink").value;
      const notes = q("#notes").value.trim();
      if (cuisine) parts.push(cuisine);
      if (dish) parts.push(dish);
      if (mood) parts.push(mood);
      if (drink) parts.push(drink);
      if (notes) parts.push("Пожелание: " + notes);
      return parts.length ? parts.join(" · ") : "Решим на месте";
    }

    function updateSummary() {
      q("#sumDate").textContent = state.date || "Пока не выбрана";
      q("#sumTime").textContent = state.time || "Пока не выбрано";
      q("#sumType").textContent = state.type || "Пока не выбран";
      q("#sumVenue").textContent = state.venue || "Можно выбрать ниже";
      q("#sumFood").textContent = foodSummary();
      q("#foodRow").style.display = state.type === "Ресторан" ? "grid" : "none";
    }

    qa('input[name="date"]').forEach(input => {
      input.addEventListener("change", () => {
        state.date = input.value;
        updateSummary();
      });
    });

    qa('input[name="time"]').forEach(input => {
      input.addEventListener("change", () => {
        state.time = input.value;
        updateSummary();
      });
    });

    qa('input[name="type"]').forEach(input => {
      input.addEventListener("change", () => {
        state.type = input.value;
        state.venue = "";
        renderVenues(state.type);
        q("#restaurantOptions").classList.toggle("show", state.type === "Ресторан");
        updateSummary();
      });
    });

    ["#cuisine", "#dish", "#foodMood", "#drink", "#notes"].forEach(sel => {
      q(sel).addEventListener(sel === "#notes" ? "input" : "change", updateSummary);
    });

    function buildText() {
      const lines = [
        "Мой выбор для нашего вечера ✨",
        "",
        `📅 Дата: ${state.date || "не выбрана"}`,
        `🕒 Время: ${state.time || "не выбрано"}`,
        `📍 Формат: ${state.type || "не выбран"}`,
        `💫 Место: ${state.venue || "можем решить вместе"}`
      ];
      if (state.type === "Ресторан") {
        lines.push(`🍽️ По еде: ${foodSummary()}`);
      }
      lines.push("", "Жду наш вечер 💜");
      return lines.join("\n");
    }

    q("#copyBtn").addEventListener("click", async () => {
      const text = buildText();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      const toast = q("#toast");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    });

    q("#resetBtn").addEventListener("click", () => {
      qa('input[type="radio"]').forEach(i => i.checked = false);
      ["#cuisine", "#dish", "#foodMood", "#drink"].forEach(s => q(s).selectedIndex = 0);
      q("#notes").value = "";
      state.date = state.time = state.type = state.venue = "";
      q("#venueList").innerHTML = "";
      q("#restaurantOptions").classList.remove("show");
      updateSummary();
      window.scrollTo({top: 0, behavior: "smooth"});
    });

    updateSummary();
