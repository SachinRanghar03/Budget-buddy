const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const category = document.getElementById('category');
const filterCategory = document.getElementById('filter-category');
const filterMonth = document.getElementById('filter-month');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

form.addEventListener('submit', addTransaction);
filterCategory.addEventListener('change', init);
filterMonth.addEventListener('change', init);

function generateID() {
  return Date.now();
}

function addTransaction(e) {
  e.preventDefault();
  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    date: date.value,
    category: category.value
  };
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  form.reset();
  init();
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  init();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  item.innerHTML = `
    ${transaction.text} (${transaction.category}) - ${transaction.date} 
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})">❌</button>
  `;
  list.appendChild(item);
}

function updateValues(filtered) {
  const amounts = filtered.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const incomeAmt = amounts.filter(val => val > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expenseAmt = (amounts.filter(val => val < 0).reduce((a, b) => a + b, 0) * -1).toFixed(2);

  balance.textContent = total;
  income.textContent = incomeAmt;
  expense.textContent = expenseAmt;
}

function applyFilters() {
  let filtered = [...transactions];
  if (filterCategory.value) {
    filtered = filtered.filter(t => t.category === filterCategory.value);
  }
  if (filterMonth.value) {
    filtered = filtered.filter(t => t.date.startsWith(filterMonth.value));
  }
  return filtered;
}

function init() {
  list.innerHTML = '';
  const filtered = applyFilters();
  filtered.forEach(addTransactionDOM);
  updateValues(filtered);
  updateChart(filtered);
}

init();