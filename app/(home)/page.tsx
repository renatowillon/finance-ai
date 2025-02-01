import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SumaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-selects";
import { isMatch } from "date-fns";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`/?month=${currentMonth}`);
  }
  return (
    <>
      <Navbar />
      <div className="space-y-6 p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <SumaryCards month={month} />
      </div>
    </>
  );
};
export default Home;
