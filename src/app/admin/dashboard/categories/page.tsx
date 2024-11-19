import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getAllCategories } from "@/actions/categories/category.action";

export default async function CategoriesPage() {
  const { success, categories } = await getAllCategories();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button>
          <Link href="/admin/dashboard/categories/add">Add New Category</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {success &&
            categories?.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.parentCategory?.name || "None"}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" asChild>
                    <Link
                      href={`/admin/dashboard/categories/${category._id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
