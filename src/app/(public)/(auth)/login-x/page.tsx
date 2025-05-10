import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    < div className="flex justify-center items-center h-screen">

      <div className="rounded-[10px] bg-white shadow-1 my-5 dark:bg-gray-dark dark:shadow-card min-w-[375px] ">
        <div className="flex flex-col w-full pt-5 gap-5">
          <Image

            src={"/images/logo/logo.png"}
            alt="Logo"
            width={100}
            height={100}
            className="rounded-xl m-auto"
          />
          <div className="w-full px-5 ">

            <Signin />

          </div>


        </div>
      </div>
    </div>
  );
}
