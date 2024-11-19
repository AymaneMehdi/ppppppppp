"use client";

import { useState, useEffect } from "react";
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
import {
  getCategoryById,
  updateCategory,
} from "@/actions/categories/category.action";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCategoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const categoryId = params.category as string;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategory: "",
    },
  });

  useEffect(() => {
    async function fetchCategory() {
      setIsLoading(true);
      const response = await getCategoryById({ id: categoryId });
      if (response.success && response.category) {
        form.reset({
          name: response.category.name,
          description: response.category.description || "",
          parentCategory: response.category.parentCategory?._id || "",
        });
      } else {
        alert("Failed to fetch category");
        router.push("/admin/dashboard/categories");
      }
      setIsLoading(false);
    }
    fetchCategory();
  }, [categoryId, form, router]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const { name, description, parentCategory } = values;

    const response = await updateCategory({
      id: categoryId,
      data: {
        name,
        description,
        parentCategory: parentCategory || undefined,
      },
    });

    if (response.success) {
      alert(response.message);
      router.push("/admin/dashboard/categories");
    } else {
      alert(response.message);
    }

    setIsSubmitting(false);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
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
                    placeholder="Enter category description (optional)"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description of the category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a parent category (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose a parent category if this is a subcategory.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating Category..." : "Update Category"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
