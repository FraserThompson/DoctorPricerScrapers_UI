export function formatDate(date) {
  var date_obj = new Date(date);
  var day = date_obj.getDate();
  var monthIndex = date_obj.getMonth();
  var year = date_obj.getFullYear();

  return day + "/" + (monthIndex + 1) + "/" + year;
}

/**
 * Parses a priceset and returns the price for an age.
 * Can also be used on average pricesets, hence the weird key-switching stuff.
 * @param {*} all_prices the array of prices
 * @param {*} target_age the age to target
 * @returns {float} the price
 */
export function getPriceByAge(all_prices, target_age, price_key = "price") {
  return all_prices.reduce((acc, priceset) => {
    const from_age =
      "from_age" in priceset ? priceset.from_age : priceset.from_age__max;

    const price = priceset[price_key];

    if (from_age <= target_age) acc = price;
    return acc;
  }, 1000);
}

/**
 * Returns the average price for a region when given an age
 * @param {*} region the region object
 * @param {*} age the age
 * @param {*} decimalPoints how many decimal points of accuracy
 * @returns {float} the price or 0 if not existed
 */
export const getRegionAverage = (region, age, decimalPoints = 2) => {
  const price = getPriceByAge(region.averages, age, "price__avg");
  return price ? Number(price).toFixed(decimalPoints) : 0;
};

/**
 * Returns the max price for a region when given an age
 * @param {*} region the region object
 * @param {*} age the age
 * @param {*} decimalPoints how many decimal points of accuracy
 * @returns {float} the price or 0 if not existed
 */
export const getRegionMax = (region, age, decimalPoints = 2) => {
  const price = getPriceByAge(region.averages, age, "price__max");
  return price ? Number(price).toFixed(decimalPoints) : 0;
};

/**
 * Calculates the difference between the region average and the national average.
 * @param {*} average the regions average
 * @param {*} age the age
 * @param {*} defaultRegion the NZ region object
 * @param {*} decimalPoints how many decimal points of accuracy
 * @returns {float} the difference percentage
 */
export const getRegionDifference = (
  average,
  age,
  defaultRegion,
  decimalPoints = 2
) => {
  if (!defaultRegion) return 0;
  const regionAverage = getRegionAverage(defaultRegion, age, decimalPoints);
  return (((average - regionAverage) / regionAverage) * 100).toFixed(2);
};
