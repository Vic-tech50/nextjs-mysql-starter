import LogoutButton from "@/components/logoutButton";


export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to the Multi-Auth App</h1>
      <p className="mt-4 text-lg text-gray-600">This is admin</p>
      <LogoutButton />
    </div>
  );
}
