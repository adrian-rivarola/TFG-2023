import Intl from "intl";
import "intl/locale-data/jsonp/es-PY";

export function formatCurrency(value: number) {
  const formatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
  });

  return formatter.format(value);
}
