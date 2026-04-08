function formatPrice(price) {
  return "€ " + parseFloat(price).toFixed(2).replace(".", ",");
}
