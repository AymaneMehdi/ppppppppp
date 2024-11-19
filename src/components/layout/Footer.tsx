import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-highlight/5 via-primary/10 to-background text-primary/80 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p>
              E-Shop is your one-stop destination for all your shopping needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form className="flex">
              <Input type="email" placeholder="Your email" className="mr-2" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted-foreground/20 text-center">
          <p>&copy; 2024 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
