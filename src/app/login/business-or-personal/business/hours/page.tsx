import { BusinessHoursForm } from "@/components/forms/business-hours-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start lg:hidden">
          <a
            href="#"
            className="flex items-center gap-2 font-bold text-primary">
            Pronto!
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <BusinessHoursForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/bg.jpg"
          width={500}
          height={500}
          alt="Picture of the author"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 backdrop-blur-sm">
          <h2 className="text-8xl font-bold text-primary">Pronto!</h2>
          <h3 className="mt-2 text-white text-lg max-w-lg">
            Discover local organic self-service stores – all in one place.
          </h3>
        </div>
      </div>
    </div>
  );
}
