import { ProductRepository } from '../repositories/product.repository';
import { uploadImage } from '../utils/cloudinary';
import { CustomError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

const productRepo = new ProductRepository();

export class ProductService {
  async getProducts(orgId: string, query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { items, total } = await productRepo.findAll(orgId, {
      skip,
      take: limit,
      search: query.search,
      status: query.status,
      categoryId: query.categoryId,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder as any,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getProduct(id: string, orgId: string) {
    const product = await productRepo.findById(id, orgId);
    if (!product) throw new CustomError('Product not found', 404);
    return product;
  }

  async createProduct(orgId: string, data: any) {
    const createData: Prisma.ProductUncheckedCreateInput = {
      ...data,
      organization_id: orgId
    };
    return productRepo.create(createData);
  }

  async updateProduct(id: string, orgId: string, data: any) {
    const product = await productRepo.findById(id, orgId);
    if (!product) throw new CustomError('Product not found', 404);

    return productRepo.update(id, orgId, data);
  }

  async deleteProduct(id: string, orgId: string) {
    const product = await productRepo.findById(id, orgId);
    if (!product) throw new CustomError('Product not found', 404);

    return productRepo.delete(id, orgId);
  }

  async uploadImages(id: string, orgId: string, files: Express.Multer.File[]) {
    const product = await productRepo.findById(id, orgId);
    if (!product) throw new CustomError('Product not found', 404);

    const uploadPromises = files.map(file => 
      uploadImage(file.buffer, `ecommerce/products/${orgId}`)
    );

    const newUrls = await Promise.all(uploadPromises);
    
    // Append to existing
    const currentImages = Array.isArray(product.images) ? product.images as string[] : [];
    const updatedImages = [...currentImages, ...newUrls];

    return productRepo.update(id, orgId, { images: updatedImages });
  }
}
