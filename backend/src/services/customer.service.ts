import { CustomerRepository } from '../repositories/customer.repository';
import { CustomError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

const customerRepo = new CustomerRepository();

export class CustomerService {
  async getCustomers(orgId: string, query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { items, total } = await customerRepo.findAll(orgId, {
      skip,
      take: limit,
      search: query.search,
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

  async getCustomer(id: string, orgId: string) {
    const customer = await customerRepo.findById(id, orgId);
    if (!customer) throw new CustomError('Customer not found', 404);
    return customer;
  }

  async createCustomer(orgId: string, data: any) {
    const createData: Prisma.CustomerUncheckedCreateInput = {
      ...data,
      organization_id: orgId
    };
    return customerRepo.create(createData);
  }

  async updateCustomer(id: string, orgId: string, data: any) {
    const customer = await customerRepo.findById(id, orgId);
    if (!customer) throw new CustomError('Customer not found', 404);

    return customerRepo.update(id, orgId, data);
  }

  async deleteCustomer(id: string, orgId: string) {
    const customer = await customerRepo.findById(id, orgId);
    if (!customer) throw new CustomError('Customer not found', 404);

    return customerRepo.delete(id, orgId);
  }
}
