import { redirect } from "next/navigation";

export const metadata = { title: "Redirecting to AEGIS..." };

export default function AEGISRedirect() {
  redirect("/consulting/aegis");
}
