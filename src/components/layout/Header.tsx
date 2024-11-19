import { Search } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { CartSheet } from "@/components/cart/CartSheet"
import SettingsDropdown from "./dropdowns/SettingsDropdown"

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-highlight/5 via-primary/10 to-background border-b border-border/40">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-extrabold tracking-tight text-primary">
            FeizhouStore
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <Link href="#" className="text-primary/80 hover:text-primary transition-colors">New Arrivals</Link>
            <Link href="#" className="text-primary/80 hover:text-primary transition-colors">Categories</Link>
            <Link href="#" className="text-primary/80 hover:text-primary transition-colors">Deals</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <form className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/80 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-64 pl-10 bg-background border-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <Button type="submit" variant="ghost" size="sm" className="ml-2">
                Search
              </Button>
            </form>
            <CartSheet />
            <SettingsDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
