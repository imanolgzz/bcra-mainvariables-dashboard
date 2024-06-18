const formatNumber = (num: number, lang: string) => {
  // Put commas in the number to make it more readable
  if(lang === "en"){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    let numStr = num.toString();
    let [integer, decimal] = numStr.split(".");
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    decimal = decimal ? decimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    return decimal ? `${integer},${decimal}` : integer;
  }
}

export default formatNumber;
