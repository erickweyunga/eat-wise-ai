import Footer from "@/components/base/footer";
import Sidebar from "@/components/base/side-bar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Menu, User } from "lucide-react";

export default function RestrictedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-zinc-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">EATWISE AI</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <Footer />

      </div>
    </div>
  );
}
