import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";

import { JSX, SVGProps } from "react";

type TProps = {
  data: Array<{
    label: string,
    data: {
      value: number | string;
      growthRate: number;
    },
    icon: any
  }>,
  classes?:{
    card:string,
    cardData:string,
    container:string
  }
}

export async function OverviewCardsGroup(params: TProps) {


  return (
    <div className={`grid gap-2 sm:grid-cols-2  xl:grid-cols-3  ${params.classes}`}>
      {params.data.map((d) =>
        <OverviewCard
        key={d.label}
          label={d.label}
          data={d.data}
          Icon={d.icon}
          classes={params.classes}
        />
      )}
    </div>
  );
}
