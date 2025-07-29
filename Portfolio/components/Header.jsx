import Image from "next/image";
import Link from "next/link";

import Socials from "../components/Socials";

const Header = () => {
  return (
    <header className="absolute z-30 w-full items-center px-4 md:px-16 xl:px-0 xl:h-[90px] top-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-y-2 pt-2">
          {/* logo */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="logo"
              width={180}
              height={48}
              priority
              className="w-[180px] md:w-[300px] xl:w-[420px] h-auto"
            />
          </Link>

          {/* socials */}
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
