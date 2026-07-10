"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidatePath, unstable_cache } from "next/cache";

export type CreateState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string;
    address?: string;
    dob?: string;
  };
  values?: {
    name?: string;
    address?: string;
    dob?: string;
    comment?: string;
  };
};


export async function create(
  prevState: CreateState,
  formData: FormData
) {
  const values = {
    name: formData.get("name")?.toString() || "",
    address: formData.get("address")?.toString() || "",
    dob: formData.get("dob")?.toString() || "",
    comment: formData.get("comment")?.toString() || "",
  };
  

  const {name, address, dob, comment} = values


   const errors: CreateState["errors"] = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!address.trim()) {
    errors.address = "Address is required";
  }

  if (!dob) {
    errors.dob = "Date of birth is required";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors,
      values,
    };
  }
    const status = 1;
    const date = new Date()
  
    let action = await db.query(
    "INSERT INTO crud(name,address,dob, comment, status, date) VALUES(?,?,?,?,?,?)", [name,address,dob, comment, status, date]
    );

    if(action){
    return {
        success: true,
        message: "Added Successfully",
        
    }
}
    // redirect(referer || "/");

  

}

// export async function fetchData() {
//   try {
//     console.log('Fetching revenue data...');
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     const [rows] = await db.query(
//       "SELECT * FROM crud ORDER BY id DESC"
//     );

//     return {
//       success: true,
//       data: rows,
//     };
//   } catch (error) {
//     console.error(error);

//     return {
//       success: false,
//       message: "Failed to fetch records",
//       data: [],
//     };
//   }
// }

const getCrudData = unstable_cache( // Use unstable_cache to cache the data fetching function
  async () => {
    console.log("Fetching revenue data...");

    await new Promise((resolve) => setTimeout(resolve, 3000)); //just to simulate a delay for testing purposes

    const [rows] = await db.query(
      "SELECT * FROM crud ORDER BY id DESC"
    );

    return rows;
  },
  ["crud-data"], // Cache key
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["crud"],
  }
);

export async function fetchData() {
  try {
    const rows = await getCrudData();

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch records",
      data: [],
    };
  }
}
// export const getUsers = unstable_cache(
//   async () => {
//     const [rows] = await db.query(
//       "SELECT * FROM crud ORDER BY id DESC"
//     );

//     return rows;
//   },
//   ["users"],
//   {
//     revalidate: 60,
//   }
// );
export async function getById(id: number) {
  try {
    const [rows]: any = await db.query(
      "SELECT * FROM crud WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "Record not found",
      };
    }

    return {
      success: true,
      data: rows[0],
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function update(id: number, formData: FormData) {
  try{
  await db.query(
    `
      UPDATE crud
      SET name=?, address=?, dob=?, comment=?
      WHERE id=?
    `,
    [
      formData.get("name"),
      formData.get("address"),
      formData.get("dob"),
      formData.get("comment"),
      id,
    ]
  );

  revalidatePath("/read");
  redirect("/read");
}catch(err:any){
  console.log(err.message)
}
}


export async function remove(id: number) {
  try {
    await db.query("DELETE FROM crud WHERE id = ?", [id]);

    revalidatePath("/read"); //call revalidatePath to revalidate the /read page after deletion

    return {
      success: true,
      message: "Record deleted successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to delete record.",
    };
  }
}