import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "./_components/chats-card";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RegionLabels } from "./_components/region-labels";
import Link from "next/link";
import { getOverviewData } from "./fetch";
import * as icons from "./_components/overview-cards/icons";
type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
    category: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const params = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(params.selected_time_frame);

  // Define your categories
  const categories = [
    { id: 'all', name: 'All', icon: '🌐' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'marketing', name: 'Marketing', icon: '📈' },
    { id: 'finance', name: 'Finance', icon: '💳' },
    { id: 'support', name: 'Support', icon: '🛟' },
  ];
  const { views, profit, products, users } = await getOverviewData();

  const overviewData = [{
    label: "Total Earning",
    data: profit,
    icon: icons.Profit
  },
  {
    label: "Total Orders",
    data: users,
    icon: icons.Orders
  },
  {
    label: "Total Items",
    data: products,
    icon: icons.Product
  }
  ]

  const metaOverviewData = [{
    label: "Order Placed",
    data: profit,
    icon: icons.Profit
  },
  {
    label: "Order Confirmed",
    data: views,
    icon: icons.Store
  },
  {
    label: "Order Shipped",
    data: users,
    icon: icons.Orders
  },
  {
    label: "Order Completed",
    data: products,
    icon: icons.Product
  },
  {
    label: "Order Canceled",
    data: users,
    icon: icons.Profit
  },
  {
    label: "Delivery Failed",
    data: views,
    icon: icons.Users
  },
  {
    label: "Waiting for driver",
    data: profit,
    icon: icons.Driver
  }
  ]
  return (
    <>


      <h2 className="text-body-2xlg mb-4 font-bold text-dark dark:text-white">
        Business analytics
      </h2>

      <Suspense fallback={<OverviewCardsSkeleton cards={overviewData.length}/>}>
        <OverviewCardsGroup data={overviewData} classes={{
          cardData: " flex items-end justify-between",
          card: "",
          container: ""
        }} />
      </Suspense>

      {/* <div className="mt-4">


        <Suspense fallback={<OverviewCardsSkeleton cards={metaOverviewData.length}/>}>
          <OverviewCardsGroup data={metaOverviewData} classes={
            {
              card: "flex items-center justify-between",
              cardData: "items-center flex justify-between",
              container: ""
            }
          } />
        </Suspense>
      </div> */}

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={`${extractTimeFrame("payments_overview")}-${params.category}`}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        // category={category || 'all'}
        />

        <WeeksProfit
          key={`${extractTimeFrame("weeks_profit")}-${params.category}`}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}

          className="col-span-12 xl:col-span-5"
        />

        {/* <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={`${extractTimeFrame("used_devices")}-${params.category}`}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        // category={category || 'all'}
        />

        <RegionLabels />

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ChatsCard />
        </Suspense> */}
      </div>
    </>
  );
}