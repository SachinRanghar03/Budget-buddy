const members = ["Alice", "Bob", "Charlie"];
let sharedExpenses = JSON.parse(localStorage.getItem('sharedExpenses')) || [];

const payerSelect = document.getElementById('payer');
const splitMembersDiv = document.getElementById('split-members');
const sharedForm = document.getElementById('shared-expense-form');
const ledgerList = document.getElementById('ledger-list');

// Setup dropdown and checkboxes
function loadMembers() {
  payerSelect.innerHTML = members.map(m => `<option value="${m}">${m}</option>`).join('');
  splitMembersDiv.innerHTML += members.map(m =>
    `<label><input type="checkbox" value="${m}" checked> ${m}</label><br>`
  ).join('');
}

// Add shared expense
sharedForm.addEventListener('submit', e => {
  e.preventDefault();
  const desc = document.getElementById('shared-desc').value;
  const amount = parseFloat(document.getElementById('shared-amount').value);
  const payer = payerSelect.value;
  const splitWith = [...splitMembersDiv.querySelectorAll('input:checked')].map(cb => cb.value);

  const expense = {
    id: Date.now(),
    description: desc,
    amount,
    payer,
    splitWith,
    date: new Date().toISOString().split('T')[0]
  };

  sharedExpenses.push(expense);
  localStorage.setItem('sharedExpenses', JSON.stringify(sharedExpenses));
  renderLedger();
  sharedForm.reset();
});

function calculateBalances() {
  const balances = {};
  members.forEach(m => balances[m] = 0);

  sharedExpenses.forEach(exp => {
    const share = exp.amount / exp.splitWith.length;
    exp.splitWith.forEach(member => {
      if (member !== exp.payer) {
        balances[member] -= share;
        balances[exp.payer] += share;
      }
    });
  });

  return balances;
}

function renderLedger() {
  ledgerList.innerHTML = '';
  const balances = calculateBalances();
  const entries = [];

  members.forEach(from => {
    members.forEach(to => {
      if (from !== to && balances[from] < 0 && balances[to] > 0) {
        const amount = Math.min(-balances[from], balances[to]);
        if (amount > 0.01) {
          entries.push({ from, to, amount });
          balances[from] += amount;
          balances[to] -= amount;
        }
      }
    });
  });

  if (entries.length === 0) {
    ledgerList.innerHTML = '<li>All settled up! ✅</li>';
  } else {
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.from} owes ${entry.to}: ₹${entry.amount.toFixed(2)}`;
      ledgerList.appendChild(li);
    });
  }
}

loadMembers();
renderLedger();
