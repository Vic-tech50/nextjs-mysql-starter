import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import Image from "next/image";
import DeleteButton from "./DeleteButton";

export async function GetData() {
  "use server";
  const [rows]: any = await db.query(
    "SELECT * FROM crudimage ORDER BY id DESC",
  );

  //   if (!rows.success) {
  //     return <p>{rows.message}</p>;
  //   }

  return (
    <>
      {rows.map((record: any) => (
        <TableRow key={record.id}>
          <TableCell>
            {record.image ? (
              <Image
                src={record.image}
                alt={record.name}
                width={100}
                height={100}
                className="w-full h-36 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-400 text-sm">
                No image
              </div>
            )}
          </TableCell>
          <TableCell className="font-medium">{record.name}</TableCell>
          <TableCell>{record.address}</TableCell>
          <TableCell> {new Date(record.date).toLocaleDateString()}</TableCell>
          <TableCell className="text-right">
            <Link href={`/readimage/editimage/${record.id}`}>
              <Button>Edit</Button>
            </Link>

            <DeleteButton id={record.id} imagePath={record.image} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default async function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="">
            <Link href="/createimage">
              <Button>Create</Button>
            </Link>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>dob</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <React.Suspense fallback={<p>Loading...</p>}>
                  <GetData />
                </React.Suspense>
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
