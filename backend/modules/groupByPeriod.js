const moment = require('moment');

function groupByPeriod(items, dateField, range, sumField = null) {
  const grouped = {};

  items.forEach(item => {
    const date = moment(item[dateField]);
    if (!date.isValid()) return;

    let key = '';
    if (range === 'semaine') key = `S${date.isoWeek()}`;
    else if (range === 'mois') key = date.format('YYYY-MM');
    else if (range === 'annee') key = date.format('YYYY');

    if (!grouped[key]) grouped[key] = 0;
    if (sumField) {
      grouped[key] += item[sumField] || 0;
    } else {
      grouped[key] += 1;
    }
  });

  // Tri chrono
  const sorted = Object.keys(grouped).sort().map(key => grouped[key]);
  return sorted;
}

module.exports = {groupByPeriod};
