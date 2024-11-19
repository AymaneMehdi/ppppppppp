"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getAllCategories } from "@/actions/categories/category.action";
import { createProduct } from "@/actions/products/product.action";
import Image from "next/image";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Price must be a non-negative number.",
    }),
  stock: z
    .string()
    .refine(
      (val) => val === "" || (!isNaN(parseInt(val)) && parseFloat(val) >= 0),
      {
        message: "Stock must be a non-negative integer.",
      }
    ),
  category: z.string({
    required_error: "Please select a category.",
  }),
  images: z.array(z.string().url()).optional(),
});

type CategoryType = {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string;
};

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [uploadedImages, setUploadedImages] = useState<PutBlobResult[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      images: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const { name, description, price, stock, category, images = [] } = values;

    // Create a new product
    const response = await createProduct({
      name,
      description,
      price: parseFloat(price || "0"),
      category,
      images,
      stock: parseInt(stock || "0"),
    });

    if (response.success) {
      // Display success message
      alert("Product added successfully");
      form.reset();
      form.setValue("category", ""); // Reset the category field explicitly
      form.resetField("category"); // Reset the category field and clear its value
    } else {
      console.log(response);

      // Display error message
      alert("Failed to add product");
    }

    setIsSubmitting(false);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      // Fetch categories from the server
      const response = await getAllCategories();
      if (response.success) {
        setCategories(
          response?.categories
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              response.categories.map((category: any) => ({
                _id: category._id,
                name: category.name,
                description: category.description,
                parentCategory: category.parentCategory,
              }))
            : []
        );
      }
    };

    fetchCategories();
  }, []);

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed to customers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow numbers and at most one decimal point
                      if (/^\d*\.?\d*$/.test(value)) {
                        // Remove leading zeros, but keep one if it's the only digit before decimal
                        const cleanedValue = value.replace(/^0+(?=\d)/, "");
                        field.onChange(cleanedValue);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Enter the price in dollars.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Only allow non-negative integers
                      if (/^\d*$/.test(value)) {
                        // Remove leading zeros, but keep one if it's the only digit before decimal
                        const cleanedValue = value.replace(/^0+(?=\d)/, "");
                        field.onChange(cleanedValue);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter the current stock quantity.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the category that best fits this product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={async (e) => {
                      setIsSubmitting(true);
                      const files = Array.from(e.target.files || []);
                      const uploadedFiles: PutBlobResult[] = [];

                      for (const file of files) {
                        const newBlob = await upload(file.name, file, {
                          access: "public",
                          handleUploadUrl: "/api/file/upload",
                        });
                        uploadedFiles.push(newBlob);
                      }

                      setUploadedImages(uploadedFiles);
                      field.onChange(uploadedFiles.map((image) => image.url));
                      setIsSubmitting(false);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload one or more product images.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image preview */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {uploadedImages.map((image: PutBlobResult, index: number) => (
                <Image
                  key={index}
                  src={image.url}
                  width={200}
                  height={200}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
