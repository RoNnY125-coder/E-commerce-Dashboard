import { OrderRepository } from '../repositories/order.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CustomError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

const orderRepo = new OrderRepository();
const customerRepo = new CustomerRepository();
const productRepo = new ProductRepository();

export class OrderService {
  async getOrders(orgId: string, query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { items, total } = await orderRepo.findAll(orgId, {
      skip,
      take: limit,
      search: query.search,
      status: query.status,
      customerId: query.customerId,
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

  async getOrder(id: string, orgId: string) {
    const order = await orderRepo.findById(id, orgId);
    if (!order) throw new CustomError('Order not found', 404);
    return order;
  }

  async createOrder(orgId: string, data: any) {
    const { customer_id, items, ...orderData } = data;

    // Verify customer
    const customer = await customerRepo.findById(customer_id, orgId);
    if (!customer) throw new CustomError('Customer not found', 404);

    // Verify products and calculate totals
    let subtotal = 0;
    const orderItems: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = [];

    for (const item of items) {
      const product = await productRepo.findById(item.product_id, orgId);
      if (!product) throw new CustomError(`Product ${item.product_id} not found`, 404);
      
      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: itemTotal,
        variant_info: item.variant_info,
      });
    }

    const nextOrderNum = await orderRepo.getNextOrderNumber(orgId);
    const tax_amount = data.tax_amount || 0;
    const shipping_amount = data.shipping_amount || 0;
    const discount_amount = data.discount_amount || 0;
    const total = subtotal + tax_amount + shipping_amount - discount_amount;

    const createData: Prisma.OrderUncheckedCreateInput = {
      organization_id: orgId,
      customer_id,
      order_number: nextOrderNum,
      subtotal,
      total,
      tax_amount,
      shipping_amount,
      discount_amount,
      ...orderData
    };

    return orderRepo.create(createData, orderItems);
  }

  async updateOrderStatus(id: string, orgId: string, status: any) {
    const order = await orderRepo.findById(id, orgId);
    if (!order) throw new CustomError('Order not found', 404);

    return orderRepo.updateStatus(id, orgId, status);
  }
}
