// src/utils/simplifyExpenses.js

export function simplifyExpenses(expenses, members) {
  if (!Array.isArray(members) || !Array.isArray(expenses)) {
    console.warn('simplifyExpenses: members o expenses es undefined o no es array');
    return [];
  }

  const balances = {};

  // Inicializar balances
  members.forEach((member) => {
    balances[member.id] = 0;
  });

  // Calcular balance neto de cada miembro
  expenses.forEach((expense) => {
    const totalAmount = expense.amount;
    const paidBy = expense.paid_by;
    const splitBetween = expense.split_between && expense.split_between.length > 0
      ? expense.split_between
      : members.map((m) => m.id); // Si no hay split_between, dividir entre todos

    const splitAmount = totalAmount / splitBetween.length;

    // Restar a cada uno su parte
    splitBetween.forEach((memberId) => {
      balances[memberId] -= splitAmount;
    });

    // Sumar al que pagó
    balances[paidBy] += totalAmount;
  });

  // Convertir balances a array de deudores y acreedores
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance < -0.01) {
      debtors.push({ memberId, balance });
    } else if (balance > 0.01) {
      creditors.push({ memberId, balance });
    }
  });

  // Simplificar deudas
  const settlements = [];

  while (debtors.length && creditors.length) {
    const debtor = debtors.pop();
    const creditor = creditors.pop();

    const amount = Math.min(-debtor.balance, creditor.balance);

    settlements.push({
      from: members.find((m) => m.id === debtor.memberId)?.name || 'Unknown',
      to: members.find((m) => m.id === creditor.memberId)?.name || 'Unknown',
      amount: Math.round(amount * 100) / 100,
    });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (debtor.balance < -0.01) debtors.unshift(debtor);
    if (creditor.balance > 0.01) creditors.unshift(creditor);
  }

  return settlements;
}
