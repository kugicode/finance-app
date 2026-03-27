import ThemeToggle from "./ThemeToggle";

export default function Navbar(){

return(
<nav className="flex justify-between items-center p-4 border-b bg-white dark:bg-gray-900
      dark:border-gray-800">
<h1 className="text-xl font-bold text-green-600">Finance-App</h1>
<div className="flex items-center gap-4">
<span className="text-gray-600 dark:text-gray-300">Dashboard</span>
<ThemeToggle />
</div>
</nav>
);
}