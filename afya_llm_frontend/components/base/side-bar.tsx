import { Activity } from "lucide-react"
import { Button } from "../ui/button"

const Sidebar = () => {
    return (
        <div className="hidden md:flex flex-col w-64 bg-white border-r">
            <div className="p-4">
                <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            <nav className="flex-1">
                <Button variant="ghost" className="w-full justify-start">
                    <Activity className="mr-2 h-4 w-4" />
                    Chat with EatWise AI
                </Button>
                <NavigationButton label="Emergency" icon={<Activity className="mr-2 h-4 w-4" />} />
            </nav>
        </div>
    )
}

export default Sidebar


const NavigationButton = ({ label, icon }: { label: string; icon: React.ReactNode }) => {
    return (
        <Button variant="ghost" className="w-full justify-start">
            {icon}
            {label}
        </Button>
    )
}