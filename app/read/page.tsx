// "use client";
// import * as React from "react";
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
import { fetchData } from "../actions/crud";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/DeleteButton";



export default async function Page() {
  //   const [records, setRecords] = React.useState<any[]>([]);
  //   React.useEffect(() => {
  //     async function loadData() {
  //       const records = await fetchData();

  //       if (records.success) {
  //         setRecords(records.data as any[]);
  //       }
  //     }

  //     loadData();
  //   }, []);
  const records = await fetchData();

  if (!records.success) {
    return <p>{records.message}</p>;
  }
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
            <Link href="/create">
              <Button>Create</Button>
            </Link>
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>dob</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.data.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.address}</TableCell>
                    <TableCell>
                      {" "}
                      {new Date(record.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/read/edit/${record.id}`}>
                        <Button>Edit</Button>
                      </Link>

                      <DeleteButton id={record.id} />
                      {/* <Link href="#">
                        <Button variant={"destructive"}>Delete</Button>
                      </Link> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
