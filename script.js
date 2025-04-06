let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function generateID() {
  return Math.floor(Math.random() * 1000000);
}

function addTransaction(e) {
  e.preventDefault();

  const text = document.getElementById("text").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value || new Date().toISOString().split('T')[0];

  const transaction = {
    id: generateID(),
    text,
    amount: type === "expense" ? -amount : amount,
    type,
    category,
    date
  };

  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
  document.getElementById("transaction-form").reset();
}

function updateUI() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  const filtered = getFilteredTransactions();

  filtered.forEach(addTransactionDOM);

  const income = filtered
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = filtered
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById("income").innerText = income.toFixed(2);
  document.getElementById("expense").innerText = Math.abs(expense).toFixed(2);
  document.getElementById("balance").innerText = (income + expense).toFixed(2);

  updateChart(filtered);
  populateFilters();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} (₹${Math.abs(transaction.amount)} | ${transaction.category} | ${transaction.date})
    <button onclick="removeTransaction(${transaction.id})">❌</button>
  `;
  document.getElementById("transaction-list").appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

function getFilteredTransactions() {
  const month = document.getElementById("monthFilter").value;
  const category = document.getElementById("categoryFilter").value;
  return transactions.filter(t => {
    const tMonth = new Date(t.date).getMonth() + 1;
    const mMatch = !month || tMonth === +month;
    const cMatch = !category || t.category === category;
    return mMatch && cMatch;
  });
}

function populateFilters() {
  const monthFilter = document.getElementById("monthFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  const months = new Set(transactions.map(t => new Date(t.date).getMonth() + 1));
  const categories = new Set(transactions.map(t => t.category));

  monthFilter.innerHTML = `<option value="">All Months</option>`;
  months.forEach(m => {
    monthFilter.innerHTML += `<option value="${m}">Month ${m}</option>`;
  });

  categoryFilter.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(c => {
    categoryFilter.innerHTML += `<option value="${c}">${c}</option>`;
  });
}

document.getElementById("transaction-form").addEventListener("submit", addTransaction);
document.getElementById("monthFilter").addEventListener("change", updateUI);
document.getElementById("categoryFilter").addEventListener("change", updateUI);

// Initial call
updateUI();
