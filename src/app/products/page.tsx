import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ProducsPage() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: { category: true },
  });
  return (
    <div className=" container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 ">Danh sách sản phẩm</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <h3 className="font-semibold "> {product.name}</h3>
                <p className="text-gray-600"> {product.description}</p>
                <p className="text-blue-600 font-bold">{product.price.toLocaleString()}đ</p>
                <p className="text-sm text-gray-500">{ product.category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
