"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar(){
const {data: session} = useSession() //This tells us if someone is logged in!

return(
<nav className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-900
      dark:border-gray-800">
<h1 className="text-xl font-bold text-green-600">Finance-App</h1>

<div className="flex items-center gap-4">
{/* If logged in, show the user's name and sign out button */}
{session ?(
<>
      <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:block">
            Hi, {session.user?.name}
      </span>
      <button
      onClick={() => signOut()}
      className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all cursor-pointer"
      >
      Sign Out 
      </button>
      </>
      ) : (
         //If not logged in, show the Sign in button!
         <button
         onClick={() => signIn("google")}
         className="text-xs bg-green-600 text-white px-3 py-1.5 ml-5.5 rounded-lg hover:bg-green-700 transition-all cursor-pointer"
         >
            Sign In with google
         </button>   
      )
}
</div>

<div className="flex items-center gap-4">
<span className="text-gray-600 dark:text-gray-300">Dashboard</span>
<ThemeToggle />
</div>
</nav>
);
}