export function formatDate(date) {
  var date_obj = new Date(date);
  var day = date_obj.getDate();
  var monthIndex = date_obj.getMonth();
  var year = date_obj.getFullYear();

  return day + "/" + (monthIndex + 1) + "/" + year;
}

export function getPriceByAge(all_prices, target_age) {
  const price = all_prices.reduce((acc, priceset) => {
    console.log(priceset)
    if (priceset.from_age <= target_age) acc = priceset.price;
    return acc;
  }, 1000);

  return price;
}