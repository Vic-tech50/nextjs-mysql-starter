"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero01() {
  return (
    <section className="pb-20 pt-36 md:pb-32 md:pt-48">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-3 md:mx-auto">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-1">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span> Design is out now! </span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-7xl tracking-tighter font-bold">
            <h1>
              Experience the
              <span className="text-transparent px-2 bg-gradient-to-r from-primary bg-clip-text">
                StarterKitPro
              </span>
            </h1>
          </div>

          <p className="max-w-screen-md mx-auto text-xl text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
            doloremque mollitia fugiat omnis! Porro facilis quo animi
            consequatur. Explicabo.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
              Get Started
              <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-5/6 md:w-1/4 font-bold"
            >
              <Link href="#" target="_blank">
                Github respository
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-red-400 rounded-full blur-3xl"></div>
          <img
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src="/dummy-image.svg"
            alt="dashboard"
          />
        </div>
      </div>
    </section>
  );
}
