const wholeNaira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const nairaWithKobo = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// 500 -> "₦500", 12500 -> "₦12,500", 1234.5 -> "₦1,234.50"
export function formatNaira(amount) {
  const value = Number(amount) || 0;
  return Number.isInteger(value) ? wholeNaira.format(value) : nairaWithKobo.format(value);
}
