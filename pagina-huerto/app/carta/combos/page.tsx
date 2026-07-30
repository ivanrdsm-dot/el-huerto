import { redirect } from "next/navigation";

/** /carta/combos vive en /combos con protagonismo propio */
export default function CartaCombosRedirect() {
  redirect("/combos");
}
