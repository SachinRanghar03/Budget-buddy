function exportCSV() {
    let csv = "Text,Amount,Date,Category\n";
    transactions.forEach(t => {
      csv += `${t.text},${t.amount},${t.date},${t.category}\n`;
    });
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget.csv';
    a.click();
  }
  
