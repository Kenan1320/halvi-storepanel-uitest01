
import logo from "@/assets/logos/main.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative flex justify-center items-center">
      <Image
        src={logo}
        height={100}
        width={100}
        alt="MyHalvi logo"
        role="presentation"
        quality={100}
        className="rounded-xl"
      />
    </div>
  );
}
