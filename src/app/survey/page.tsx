import { redirect } from "next/navigation";

export default function SurveyRedirect() {
  redirect("/assess");
}

export const metadata = {
  title: "Redirecting...",
};
