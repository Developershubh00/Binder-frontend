export const calculateTotalWastage = (workOrders) => {
  if (!workOrders || workOrders.length === 0) return 0;
  // Sum all wastage percentages
  const total = workOrders.reduce((sum, wo) => {
    const wastage = parseFloat(wo.wastage?.replace('%', '')) || 0;
    return sum + wastage;
  }, 0);
  return total;
};

export const calculateGrossConsumption = (netConsumption, totalWastage, overage, poQty) => {
  const net = parseFloat(netConsumption) || 0;
  const wastage = parseFloat(totalWastage) || 0;
  const overagePercent = parseFloat(overage?.replace('%', '')) || 0;
  const qty = parseFloat(poQty) || 0;
  
  if (net === 0 || qty === 0) return 0;
  
  // Gross Consumption = Net Consumption * (1 + Total Wastage/100) * (1 + OVERAGE/100) * Po QTY
  const result = net * (1 + wastage / 100) * (1 + overagePercent / 100) * qty;
  return result.toFixed(6);
};

