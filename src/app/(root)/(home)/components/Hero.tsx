'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const images = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200',
  // Add more product images as needed
];

export default function Hero() {
  const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });

  return (
    <section className="relative w-full">
      <Carousel
        plugins={[plugin]}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[600px] w-full">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-4">Discover Our Products</h1>
                    <p className="text-xl">Experience quality and style</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
} 