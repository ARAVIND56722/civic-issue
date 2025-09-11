// utils/department.js
const map = {
  streetlight: "Electricity",
  electricity: "Electricity",
  garbage: "Sanitation",
  sanitation: "Sanitation",
  water: "Water Board",
  roads: "Roads",
};

function autoAssign(category = "") {
  const key = String(category).toLowerCase().trim();
  return map[key] || "General";
}

module.exports = { autoAssign };
