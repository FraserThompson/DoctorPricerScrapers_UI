export function formatDate(date) {
  var date_obj = new Date(date);
  var day = date_obj.getDate();
  var monthIndex = date_obj.getMonth();
  var year = date_obj.getFullYear();

  return day + "/" + (monthIndex + 1) + "/" + year;
}
