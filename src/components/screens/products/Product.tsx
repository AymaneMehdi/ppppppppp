import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Product({
  id = "1",
  name = "Sample Product",
  price = 19.99,
  image = "",
}: {
  id: string;
  name: string;
  price: number;
  image?: string;
}) {
  return (
    <Link href={`/products/${id}`}>
      <Card
        key={id}
        className="group cursor-pointer h-full transition-all duration-300 hover:shadow-lg hover:shadow-highlight/30 hover:scale-105 flex flex-col"
      >
        <CardHeader className="p-0">
          <div className={"bg-muted h-48 relative"}>
            {image && <Image src={image} alt={name} fill />}
          </div>
        </CardHeader>
        <CardContent className="p-2 flex flex-col h-full">
          <CardTitle className="mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {name}
          </CardTitle>

          <div className="mt-auto">
            <p className="text-xl font-bold mb-2 text-highlight">
              ${price.toFixed(2)}
            </p>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(4.9)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              {/* <span className="ml-2 text-sm text-muted-foreground">
            ({reviewCount})
          </span> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
