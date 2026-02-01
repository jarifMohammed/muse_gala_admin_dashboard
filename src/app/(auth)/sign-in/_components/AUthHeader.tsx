import Image from "next/image";

const AuthHeader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-[35px] md:mb-[50px] lg:mb-[69px]">
        <Image
          src="https://files.edgestore.dev/2pgl62wxp0dbg019/Dev/_public/c07daf32-7d8a-4490-994e-00f3431e3de4.png"
          alt="Logo"
          width={94}
          height={80}
          unoptimized
        />
      </div>

      {/* Heading */}
      <div className="text-center pb-[12px] md:pb-[15px]">
        <h1 className="font-avenir-arabic font-light text-[24px] uppercase text-black leading-none tracking-20 mb-[23.5px]">
          MUSE GALA
        </h1>
        <p className="font-avenir font-normal text-[16px] uppercase text-black leading-none tracking-10">
          THE ADMIN SUITE
        </p>
      </div>
    </div>
  );
};

export default AuthHeader;
