import CalendarDateRangePicker from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { generateMeta } from "@/lib/utils";
import MetricCard from "./cards/metric";
import SubscriptionsCard from "./cards/subscriptions";
import TotalRevenueCard from "./cards/total-revenue";
import { currentUser } from "@clerk/nextjs/server";

export async function generateMetadata() {
  return generateMeta({
    title: "Dashboard - FashtionFit",
    description:
      "The dashboard of FashtionFit, a platform that helps you find the perfect fit for your clothes.",
    canonical: "/default"
  });
}

export default async function Page() {
  const user = await currentUser();

  return (
    <>
      <div className="mb-4 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {user?.unsafeMetadata.favoriteProducts !== undefined && (
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        )}
      </div>
      {user?.unsafeMetadata.favoriteProducts !== undefined ? (
        <div className="grid lg:grid-cols-2">
          <SubscriptionsCard />
          <TotalRevenueCard />
          <div className="lg:col-span-3">
            <MetricCard className="h-full" />
          </div>
        </div>
      ) : (
        "You don't have any activity yet."
      )}
    </>
  );
}
