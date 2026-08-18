import React from "react";
import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { Badge } from "lucide-react";
import Image from "next/image";

const TopMenu = [
  {
    name: "Getting Started",
    Dropdown: [
      {
        title: "Introduction",
        description:
          "Re-usable components built using Radix UI and Tailwind CSS.",
        icon: <Zap className="size-5 shrink-0" />,
        href: "/docs",
      },
      {
        title: "Installation",
        description: "How to install dependencies and structure your app.",
        icon: <Sunset className="size-5 shrink-0" />,
        href: "/docs/installation",
      },
      {
        title: "Typography",
        description: "Styles for headings, paragraphs, lists...etc",
        icon: <Trees className="size-5 shrink-0" />,
        href: "/docs/primitives/typography",
      },
    ],
  },
  {
    name: "Resources",
    Dropdown: [
      {
        title: "Help Center",
        description: "Get all the answers you need right here",
        icon: <Zap className="size-5 shrink-0" />,
        href: "/",
      },
      {
        title: "Contact Us",
        description: "We are here to help you with any questions you have",
        icon: <Sunset className="size-5 shrink-0" />,
        href: "/",
      },
      {
        title: "Status",
        description: "Check the current status of our services and APIs",
        icon: <Trees className="size-5 shrink-0" />,
        href: "/",
      },
      {
        title: "Terms of Service",
        description: "Our terms and conditions for using our services",
        icon: <Book className="size-5 shrink-0" />,
        href: "/",
      },
    ],
  },
  { name: "Pricing", href: "/#pricing" },
  { name: "Blog", href: "/blog" },
];

const Logo = () => {
  return (
    <Link href="/" className="flex space-x-2 py-3 items-center">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="StarterKitPro Blocks"
          width={24}
          height={24}
        />
        Blocks
      </h1>
    </Link>
  );
};

export default async function Header01() {
  return (
    // wanna make sticky add these classed to header as well "sticky top-0"
    <header className="w-full py-4 px-3 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
          </div>
          <div className="items-center flex gap-6">
            <div className="flex items-center">
              <NavigationMenu className="relative z-[100]">
                <NavigationMenuList>
                  {TopMenu.map((menu, idx) =>
                    menu.Dropdown ? (
                      <NavigationMenuItem key={idx}>
                        <NavigationMenuTrigger className="bg-transparent">
                          {menu.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-[100]">
                          {menu.name === "Getting Started" ? (
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <Link
                                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                    href="/"
                                  >
                                    <Badge className="h-6 w-6" />
                                    <div className="mb-2 mt-4 text-lg font-medium">
                                      shadcn/ui
                                    </div>
                                    <p className="text-sm leading-tight text-muted-foreground">
                                      Beautifully designed components that you
                                      can copy and paste into your apps.
                                      Accessible. Customizable. Open Source.
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                              {menu.Dropdown.map((item, idx) => (
                                <ListItem
                                  key={idx}
                                  href={item.href}
                                  title={item.title}
                                >
                                  {item.description}
                                </ListItem>
                              ))}
                            </ul>
                          ) : (
                            <ul className="w-80 p-3">
                              {menu.Dropdown.map((item, index) => (
                                <li key={index} className="group">
                                  <NavigationMenuLink asChild>
                                    <Link
                                      className={cn(
                                        "flex flex-row select-none gap-4 rounded-md p-3 leading-none no-underline outline-hidden transition-colors"
                                      )}
                                      href={item.href}
                                    >
                                      <span className="transition-colors group-hover:text-primary">
                                        {item.icon}
                                      </span>
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {item.title}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {item.description}
                                        </p>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          )}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    ) : (
                      <NavigationMenuItem key={idx}>
                        <Link
                          className={navigationMenuTriggerStyle()}
                          href={menu.href}
                        >
                          {menu.name}
                        </Link>
                      </NavigationMenuItem>
                    )
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <ModeToggle />
            <div className="flex gap-2">
              <Link href="#" className={buttonVariants({ variant: "outline" })}>
                Log in
              </Link>
              <Link href="#" className={buttonVariants({ variant: "default" })}>
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <Sheet>
              <div className="flex gap-3 items-center">
                <Suspense>
                  <ModeToggle />
                </Suspense>
                <SheetTrigger asChild>
                  <Button variant={"outline"} size={"icon"}>
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
              </div>
              <SheetContent
                side="bottom"
                className="pb-5 overflow-y-auto max-h-[calc(100vh-20vh)] px-4"
              >
                <SheetHeader className="pb-4 px-0 border-b">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col">
                  {TopMenu.map((menu, idx) =>
                    menu.Dropdown ? (
                      <Accordion
                        key={idx}
                        type="single"
                        collapsible
                        className="w-full mb-1"
                      >
                        <AccordionItem
                          value={menu.name}
                          className="border-b border-border/40"
                        >
                          <AccordionTrigger className="py-3 font-medium hover:no-underline text-base">
                            {menu.name}
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-3">
                            <div className="flex flex-col space-y-3">
                              {menu.Dropdown.map((item, index) => (
                                <Link
                                  key={index}
                                  className={cn(
                                    "flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                                  )}
                                  href={item.href}
                                >
                                  <div className="flex-shrink-0 text-primary">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">
                                      {item.title}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Link
                        key={idx}
                        href={menu.href}
                        className="py-3 px-1 font-medium text-base border-b border-border/40 flex items-center"
                      >
                        {menu.name}
                      </Link>
                    )
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-2">
                    <Link
                      href="#"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Log in
                    </Link>
                    <Link
                      href="#"
                      className={buttonVariants({ variant: "default" })}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
