import { Activity, Ambulance, User } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

const Sidebar = () => {
    return (
        <div className="hidden md:flex flex-col w-64 bg-white border-r">
            <div className="p-4 py-5">
                <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            <nav className="flex-1">
                <NavigationButton label="Chat" icon={<User className="mr-2 h-4 w-4" />} href="/account" />
                <NavigationButton label="Activity" icon={<Activity className="mr-2 h-4 w-4" />} href="/activity" />
                <NavigationButton label="Emergency" icon={<Ambulance className="mr-2 h-4 w-4" />} href="/emergence" />
            </nav>
        </div>
    )
}

export default Sidebar


const NavigationButton = ({ label, icon, href }: { label: string; icon: React.ReactNode, href: string }) => {
    return (
        <Link href={`${href.toLowerCase()}`}>
            <Button variant="ghost" className="w-full justify-start rounded-none">
                {icon}
                {label}
            </Button>
        </Link>
    )
}