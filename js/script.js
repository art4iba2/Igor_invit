const venueData = {
      "Ресторан": [
        {name:"Хочу Пури", meta:"Грузинский ресторан · пер. Кузнецова 3А", value:"Хочу Пури — пер. Кузнецова 3А"},
        {name:"По чесноку", meta:"Смешанная кухня · Московское шоссе 108", value:"По чесноку — Московское шоссе 108"},
        {name:"Антресоль", meta:"Грузинский ресторан · Московское шоссе 108", value:"Антресоль — Московское шоссе 108"},
        {name:"Мидийное место", meta:"Ресторан с морепродуктами · ул. Спасская 19/9", value:"Мидийное место — ул. Спасская 19/9"}
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
        {name:"Матрица", meta:"Московское ш., 91", value:"Кинотеатр «Матрица» — Московское ш., 91"}
      ]
    };

    // ============================================================
    // ВСТАВЬ СЮДА СВОЙ WEB3FORMS ACCESS KEY
    // Пример: const WEB3FORMS_ACCESS_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
    // ============================================================
    const WEB3FORMS_ACCESS_KEY = "c7caf6a7-9c19-4e3d-be8d-f835d043c0b8";

    const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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
          clearStatus();
          updateSummary();
        });
      });
    }

    function restaurantDetails() {
      return {
        cuisine: q("#cuisine").value || "Не указано",
        dish: q("#dish").value || "Не указано",
        foodMood: q("#foodMood").value || "Не указано",
        drink: q("#drink").value || "Не указано",
        notes: q("#notes").value.trim() || "Нет"
      };
    }

    function foodSummary() {
      if (state.type !== "Ресторан") return "—";
      const parts = [];
      const { cuisine, dish, foodMood, drink, notes } = restaurantDetails();
      if (cuisine !== "Не указано") parts.push(cuisine);
      if (dish !== "Не указано") parts.push(dish);
      if (foodMood !== "Не указано") parts.push(foodMood);
      if (drink !== "Не указано") parts.push(drink);
      if (notes !== "Нет") parts.push("Пожелание: " + notes);
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

    function clearStatus() {
      const status = q("#sendStatus");
      status.textContent = "";
      status.className = "send-status";
    }

    function showStatus(message, type) {
      const status = q("#sendStatus");
      status.textContent = message;
      status.className = `send-status ${type}`;
    }

    function validateSelection() {
      const missing = [];
      if (!state.date) missing.push("дату");
      if (!state.time) missing.push("время");
      if (!state.type) missing.push("формат");
      if (state.type && !state.venue) missing.push("место");

      if (missing.length) {
        showStatus(`Пожалуйста, выбери ${missing.join(", ")} ✨`, "error");
        return false;
      }
      return true;
    }

    qa('input[name="date"]').forEach(input => {
      input.addEventListener("change", () => {
        state.date = input.value;
        clearStatus();
        updateSummary();
      });
    });

    qa('input[name="time"]').forEach(input => {
      input.addEventListener("change", () => {
        state.time = input.value;
        clearStatus();
        updateSummary();
      });
    });

    qa('input[name="type"]').forEach(input => {
      input.addEventListener("change", () => {
        state.type = input.value;
        state.venue = "";
        renderVenues(state.type);
        q("#restaurantOptions").classList.toggle("show", state.type === "Ресторан");
        clearStatus();
        updateSummary();
      });
    });

    ["#cuisine", "#dish", "#foodMood", "#drink", "#notes"].forEach(sel => {
      q(sel).addEventListener(sel === "#notes" ? "input" : "change", () => {
        clearStatus();
        updateSummary();
      });
    });

    async function sendSelection() {
      if (!validateSelection()) return;

      if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "c7caf6a7-9c19-4e3d-be8d-f835d043c0b8") {
        showStatus("Сначала вставь Web3Forms Access Key в js/script.js.", "error");
        return;
      }

      const sendBtn = q("#sendBtn");
      const originalText = sendBtn.textContent;
      sendBtn.disabled = true;
      sendBtn.textContent = "Отправляю…";
      showStatus("Отправляю твой выбор…", "loading");

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "💌 Виктория выбрала наш вечер",
        from_name: "Сайт-приглашение для Виктории",
        "Дата": state.date,
        "Время": state.time,
        "Формат": state.type,
        "Место": state.venue
      };

      if (state.type === "Ресторан") {
        const food = restaurantDetails();
        payload["Кухня"] = food.cuisine;
        payload["Блюдо"] = food.dish;
        payload["Формат еды"] = food.foodMood;
        payload["Напитки"] = food.drink;
        payload["Пожелания"] = food.notes;
      }

      try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Не удалось отправить форму");
        }

        sendBtn.textContent = "Отправлено ✓";
        showStatus("Готово! Выбор отправлен 💜 Теперь встреча официально запланирована ✨", "success");
      } catch (error) {
        console.error("Web3Forms error:", error);
        sendBtn.textContent = originalText;
        showStatus("Не получилось отправить. Проверь интернет и Access Key и попробуй ещё раз.", "error");
      } finally {
        sendBtn.disabled = false;
      }
    }

    q("#sendBtn").addEventListener("click", sendSelection);

    q("#resetBtn").addEventListener("click", () => {
      qa('input[type="radio"]').forEach(i => i.checked = false);
      ["#cuisine", "#dish", "#foodMood", "#drink"].forEach(s => q(s).selectedIndex = 0);
      q("#notes").value = "";
      state.date = state.time = state.type = state.venue = "";
      q("#venueList").innerHTML = "";
      q("#restaurantOptions").classList.remove("show");
      q("#sendBtn").textContent = "Отправить мой выбор 💌";
      clearStatus();
      updateSummary();
      window.scrollTo({top: 0, behavior: "smooth"});
    });

    updateSummary();
