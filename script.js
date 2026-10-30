const STORAGE_KEY = "pantry-picnic-list";
const categoryNames = { produce: "Produce", pantry: "Pantry", chilled: "Chilled", treats: "Treats" };
const categoryImages = {
	produce: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=160&h=160&q=80",
	pantry: "https://images.unsplash.com/photo-1584473457493-17c4c24290c?auto=format&fit=crop&w=160&h=160&q=80",
	chilled: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=160&h=160&q=80",
	treats: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=160&h=160&q=80"
};
const itemImages = {
	apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=160&h=160&q=80",
	banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=160&h=160&q=80",
	bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=160&h=160&q=80",
	egg: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=160&h=160&q=80",
	milk: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=160&h=160&q=80",
	avocado: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=160&h=160&q=80",
	tomato: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=160&h=160&q=80"
};
const itemForm = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const categoryInput = document.querySelector("#categoryInput");
const shoppingList = document.querySelector("#shoppingList");
const emptyState = document.querySelector("#emptyState");
const itemTemplate = document.querySelector("#itemTemplate");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const itemSummary = document.querySelector("#itemSummary");
const clearButton = document.querySelector("#clearButton");
const filterButtons = document.querySelectorAll(".filter-button");
const modeButtons = document.querySelectorAll(".mode-button");
const shoppingPanel = document.querySelector(".list-card");
const budgetPanel = document.querySelector("#budgetPanel");
const budgetForm = document.querySelector("#budgetForm");
const budgetList = document.querySelector("#budgetList");
const budgetTemplate = document.querySelector("#budgetTemplate");
const budgetEmpty = document.querySelector("#budgetEmpty");
const themeToggle = document.querySelector("#themeToggle");
const budgetPlanForm = document.querySelector("#budgetPlanForm");
const planTotal = document.querySelector("#planTotal");
const planPurpose = document.querySelector("#planPurpose");
const planPurposeLabel = document.querySelector("#planPurposeLabel");
const pieChart = document.querySelector("#pieChart");
const chartLegend = document.querySelector("#chartLegend");
const chartSummary = document.querySelector("#chartSummary");
const budgetMonth = document.querySelector("#budgetMonth");
let budgetEntries = loadBudgetEntries();
let items = loadItems();
let activeFilter = "all";
let budgetPlan = loadBudgetPlan();

function setTheme(theme) {
	document.documentElement.dataset.theme = theme;
	const isLight = theme === "light";
	themeToggle.setAttribute("aria-pressed", String(isLight));
	themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
	themeToggle.querySelector(".theme-icon").textContent = isLight ? "☀" : "☾";
	themeToggle.querySelector(".theme-label").textContent = isLight ? "Dark mode" : "Light mode";
	document.querySelector('meta[name="theme-color"]').setAttribute("content", isLight ? "#f8f1f5" : "#080d18");
	document.body.style.backgroundColor = isLight ? "#fff7fb" : "#080d18";
	document.body.style.backgroundImage = isLight ? "radial-gradient(rgba(159,41,67,.13) .7px, transparent .7px)" : "radial-gradient(rgba(57,217,255,.14) .7px, transparent .7px)";
	localStorage.setItem("kays-cart-theme", theme);
}

function loadBudgetEntries() {
	try {
		const savedEntries = JSON.parse(localStorage.getItem("kays-cart-budget"));
		return Array.isArray(savedEntries) ? savedEntries : [];
	} catch (error) {
		return [];
	}
}

function loadBudgetPlan() {
	try {
		return JSON.parse(localStorage.getItem("kays-cart-plan")) || { total: 300, purpose: "" };
	} catch (error) {
		return { total: 300, purpose: "" };
	}
}

function saveBudgetPlan() { localStorage.setItem("kays-cart-plan", JSON.stringify(budgetPlan)); }

function saveBudgetEntries() { localStorage.setItem("kays-cart-budget", JSON.stringify(budgetEntries)); }

function getImageForItem(name, category) {
	const imageKey = Object.keys(itemImages).find((key) => name.toLowerCase().includes(key));
	return imageKey ? itemImages[imageKey] : "";
}

function setPhoto(container, name, category) {
	const image = container.querySelector("img");
	const fallback = container.querySelector(".fallback-letter");
	const source = getImageForItem(name, category);
	image.hidden = !source;
	fallback.hidden = Boolean(source);
	if (source) {
		image.src = source;
		image.alt = `${name} photo`;
	} else {
		image.removeAttribute("src");
		image.alt = "";
	}
}

function loadItems() {
	try {
		const savedItems = JSON.parse(localStorage.getItem(STORAGE_KEY));
		return Array.isArray(savedItems) ? savedItems : [];
	} catch (error) {
		return [];
	}
}

function saveItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render() {
	const visibleItems = items.filter((item) => activeFilter === "active" ? !item.completed : activeFilter === "done" ? item.completed : true);
	shoppingList.replaceChildren();
	visibleItems.forEach((item) => {
		const row = itemTemplate.content.cloneNode(true);
		const listItem = row.querySelector(".shopping-item");
		const image = row.querySelector(".item-image");
		const checkbox = row.querySelector(".check-input");
		const name = row.querySelector(".item-name");
		const tag = row.querySelector(".category-tag");
		listItem.classList.toggle("completed", item.completed);
		setPhoto(image, item.name, item.category);
		checkbox.checked = item.completed;
		checkbox.setAttribute("aria-label", `Mark ${item.name} as ${item.completed ? "to buy" : "picked up"}`);
		name.textContent = item.name;
		tag.textContent = categoryNames[item.category] || "Other";
		tag.dataset.category = item.category;
		row.querySelector(".delete-button").addEventListener("click", () => removeItem(item.id));
		checkbox.addEventListener("change", () => toggleItem(item.id));
		shoppingList.appendChild(row);
	});
	const completedCount = items.filter((item) => item.completed).length;
	const totalCount = items.length;
	progressText.textContent = `${completedCount} / ${totalCount}`;
	progressBar.style.width = totalCount ? `${(completedCount / totalCount) * 100}%` : "0%";
	document.querySelector("#allCount").textContent = totalCount;
	document.querySelector("#activeCount").textContent = totalCount - completedCount;
	document.querySelector("#doneCount").textContent = completedCount;
	itemSummary.textContent = `${totalCount} ${totalCount === 1 ? "item" : "items"} on your list`;
	emptyState.hidden = visibleItems.length > 0;
}

function renderBudget() {
	budgetMonth.textContent = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(new Date()).toUpperCase();
	const total = budgetEntries.reduce((sum, entry) => sum + entry.amount, 0);
	const limit = Number(planTotal.value) || 0;
	const remaining = limit - total;
	const categoryTotals = budgetEntries.reduce((totals, entry) => { totals[entry.category] = (totals[entry.category] || 0) + entry.amount; return totals; }, {});
	const topCategoryKey = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])[0];
	document.querySelector("#totalSpent").textContent = `R${total.toFixed(2)}`;
	document.querySelector("#planTotalAmount").textContent = `R${limit.toFixed(2)}`;
	document.querySelector("#availableAmount").textContent = `R${Math.max(remaining, 0).toFixed(2)}`;
	document.querySelector("#entrySummary").textContent = `${budgetEntries.length} ${budgetEntries.length === 1 ? "purchase" : "purchases"}`;
	document.querySelector("#budgetStatus").textContent = remaining >= 0 ? `R${remaining.toFixed(2)} left to spend` : `R${Math.abs(remaining).toFixed(2)} over budget`;
	document.querySelector("#budgetStatus").style.color = remaining < 0 ? "var(--neon-pink)" : "#a8b9cd";
	document.querySelector("#topCategory").textContent = topCategoryKey ? categoryNames[topCategoryKey] || "Other" : "No data yet";
	budgetList.replaceChildren();
	budgetEntries.slice().reverse().forEach((entry) => {
		const row = budgetTemplate.content.cloneNode(true);
		const image = row.querySelector(".budget-image");
		setPhoto(image, entry.name, entry.category);
		row.querySelector(".budget-entry-name strong").textContent = entry.name;
		row.querySelector(".budget-entry-name span").textContent = `${categoryNames[entry.category] || "Other"} · ${entry.date}`;
		row.querySelector(".entry-amount").textContent = `R${entry.amount.toFixed(2)}`;
		row.querySelector(".entry-delete").addEventListener("click", () => removeBudgetEntry(entry.id));
		budgetList.appendChild(row);
	});
	budgetEmpty.hidden = budgetEntries.length > 0;
	renderChart(categoryTotals, total);
}

function renderChart(categoryTotals, total) {
	const colors = { produce: "#ff496d", pantry: "#32dcff", chilled: "#d0fa42", treats: "#b58cff", other: "#ff9d56" };
	let current = 0;
	const segments = Object.entries(categoryTotals).map(([category, amount]) => {
		const start = current;
		current += total ? amount / total * 100 : 0;
		return `${colors[category] || colors.other} ${start}% ${current}%`;
	});
	pieChart.style.background = segments.length ? `conic-gradient(${segments.join(", ")})` : "conic-gradient(#263b5b 0 100%)";
	chartLegend.replaceChildren();
	Object.keys(categoryTotals).forEach((category) => {
		const label = document.createElement("span");
		label.className = "legend-item";
		label.innerHTML = `<i class="legend-dot" style="background:${colors[category] || colors.other}"></i>${categoryNames[category] || "Other"}`;
		chartLegend.appendChild(label);
	});
	chartSummary.textContent = total ? `R${total.toFixed(2)} across ${Object.keys(categoryTotals).length} ${Object.keys(categoryTotals).length === 1 ? "category" : "categories"}.` : "Log purchases to see your mix.";
}

function removeBudgetEntry(id) { budgetEntries = budgetEntries.filter((entry) => entry.id !== id); saveBudgetEntries(); renderBudget(); }

function addItem(event) {
	event.preventDefault();
	const name = itemInput.value.trim();
	if (!name) return;
	items.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, name, category: categoryInput.value, completed: false });
	saveItems();
	itemInput.value = "";
	itemInput.focus();
	render();
}

function toggleItem(id) {
	items = items.map((item) => item.id === id ? { ...item, completed: !item.completed } : item);
	saveItems();
	render();
}

function removeItem(id) {
	items = items.filter((item) => item.id !== id);
	saveItems();
	render();
}

itemForm.addEventListener("submit", addItem);
clearButton.addEventListener("click", () => { items = items.filter((item) => !item.completed); saveItems(); render(); });
filterButtons.forEach((button) => button.addEventListener("click", () => {
	activeFilter = button.dataset.filter;
	filterButtons.forEach((filterButton) => filterButton.classList.toggle("active", filterButton === button));
	render();
}));

modeButtons.forEach((button) => button.addEventListener("click", () => {
	const budgetMode = button.dataset.mode === "budget";
	modeButtons.forEach((modeButton) => modeButton.classList.toggle("active", modeButton === button));
	shoppingPanel.hidden = budgetMode;
	budgetPanel.hidden = !budgetMode;
	if (budgetMode) renderBudget();
}));

shoppingPanel.hidden = true;
budgetPanel.hidden = false;

budgetForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const name = document.querySelector("#expenseName").value.trim();
	const amount = Number(document.querySelector("#expenseAmount").value);
	if (!name || !amount || amount < 0) return;
	budgetEntries.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, name, amount, category: document.querySelector("#expenseCategory").value, date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }) });
	saveBudgetEntries();
	budgetForm.reset();
	renderBudget();
});

document.querySelector("#clearBudget").addEventListener("click", () => { budgetEntries = []; saveBudgetEntries(); renderBudget(); });
budgetPlanForm.addEventListener("submit", (event) => {
	event.preventDefault();
	budgetPlan = { total: Number(planTotal.value) || 0, purpose: planPurpose.value.trim() };
	planPurposeLabel.textContent = budgetPlan.purpose || "Give your money a job";
	saveBudgetPlan();
	renderBudget();
});
themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
render();
planTotal.value = budgetPlan.total || "";
planPurpose.value = budgetPlan.purpose || "";
planPurposeLabel.textContent = budgetPlan.purpose || "Give your money a job";
renderBudget();
setTheme(localStorage.getItem("kays-cart-theme") || "dark");

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("sw.js").catch(() => {});
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then(() => console.log("Service worker registered"))
            .catch(error => console.error("Service worker error:", error));
    });
}