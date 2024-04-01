import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from '../common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  onModuleInit(): any {
    this.$connect();
    this.logger.log('Connected to the database PRISMA');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: total,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    if(!id) throw new RpcException(`Id: #${id} not found`);

    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new RpcException({
        message:`Product #${id} not found`,
        status:HttpStatus.BAD_REQUEST
    });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    await this.findOne(id);
    if (!id) {
      throw new RpcException(`Id: #${id} not found`);
    }
    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    const product = await this.product.findUnique({
      where: { id: parseInt(String(id)) },
    });

    if (!product) {
      throw new RpcException(`Product #${id} not found`);
    }

    const deleteProduct = await this.product.delete({
      where: { id: parseInt(String(id)) },
    });

    return {
      message: `Product #${id} has been deleted`,
      data: deleteProduct,
    };
  }

  async softDeleteService(id: number) {
    await this.findOne(id);

    if (!id) {
      throw new RpcException(`Id: #${id} not found`);
    }

    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    if (!product) {
      throw new RpcException(`Product #${id} not found`);
    }

    return product;
  }
}
