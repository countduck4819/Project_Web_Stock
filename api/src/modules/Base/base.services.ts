import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseEntities } from './base.entities';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata.js';
import { HttpStatusCode, ResponseCode } from 'src/shared';
import * as fs from 'fs';
import * as path from 'path';

export class BaseServices<Entity extends BaseEntities> {
  constructor(protected readonly repository: Repository<Entity>) {}

  protected convertDatabaseNameToProperty(dataReq: Record<string, any>) {
    const columns = this.repository.metadata.columns;

    // Lọc column có databaseName nằm trong keys của dataReq
    const validColumns = columns.filter((col) =>
      Object.keys(dataReq).includes(col.databaseName),
    );

    // Dùng reduce tạo object updateData với propertyName làm key
    const newDataReq = validColumns.reduce((acc, col) => {
      acc[col.propertyName as keyof Entity] = dataReq[col.databaseName];
      return acc;
    }, {} as Partial<Entity>);

    return newDataReq;
  }

  protected privateColumns: string[] = [];
  // lấy ra tên của bảng
  protected getTableName(): string {
    return this.repository.metadata.tableName;
  }

  // loại bớt những column private và trả về databaseName
  protected getPublishColumn(): string[] {
    const privateColumns = [
      'createdAt',
      'createdBy',
      'modifiedAt',
      'modifiedBy',
      'deletedAt',
      'deletedBy',
      'active',
      ...this.privateColumns,
    ];
    const columnMetadatas: ColumnMetadata[] =
      this.repository.metadata.columns.filter(
        (c: ColumnMetadata) => !privateColumns.includes(c.propertyName),
      );

    return columnMetadatas.map((c: ColumnMetadata) => c.databaseName);
  }

  // loại bớt những column private và trả về propertyName
  protected getPublishPropertyNameColumn(): string[] {
    const privateColumns = [
      'createdAt',
      'createdBy',
      'modifiedAt',
      'modifiedBy',
      'deletedAt',
      'deletedBy',
      'active',
      ...this.privateColumns,
    ];
    const columnMetadatas: ColumnMetadata[] =
      this.repository.metadata.columns.filter(
        (c: ColumnMetadata) => !privateColumns.includes(c.propertyName),
      );

    return columnMetadatas.map((c: ColumnMetadata) => c.propertyName);
  }

  protected handleSelect(): SelectQueryBuilder<Entity> {
    const query: SelectQueryBuilder<Entity> = this.repository
      .createQueryBuilder(this.getTableName())
      .select(this.getPublishColumn());
    return query;
  }

  protected handleWhere(
    query: SelectQueryBuilder<Entity>,
    condition: Partial<Record<keyof Entity, any>>,
  ): SelectQueryBuilder<Entity> {
    return query.where({ ...condition });
  }

  async paginate(
    condition: Partial<Record<keyof Entity, any>> = {},
    page: number = 1,
    limit: number = 10,
    searchFilters?: Partial<Record<keyof Entity, any>>,
  ) {
    try {
      const alias = this.getTableName();

      // 🟣 1. Tạo query builder thủ công, không dùng handleSelect()
      const query = this.repository
        .createQueryBuilder(alias)
        .where(`${alias}.active = true`)
        .andWhere(`${alias}.deletedAt IS NULL`);

      // 🟢 2. Điều kiện EQUAL
      if (Object.keys(condition).length > 0) {
        for (const [key, value] of Object.entries(condition)) {
          if (value !== undefined && value !== null && value !== '') {
            query.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
          }
        }
      }

      // 🟢 3. Điều kiện LIKE (search)
      if (searchFilters && Object.keys(searchFilters).length > 0) {
        const searchExprs: string[] = [];
        const searchParams: Record<string, any> = {};

        for (const [key, value] of Object.entries(searchFilters)) {
          if (value !== undefined && value !== null && value !== '') {
            const paramKey = `search_${key}`;
            searchExprs.push(`${alias}.${key} LIKE :${paramKey}`);
            searchParams[paramKey] = `%${value}%`;
          }
        }

        if (searchExprs.length > 0) {
          // Dùng OR để dễ lọc hơn
          query.andWhere(`(${searchExprs.join(' OR ')})`, searchParams);
        }
      }

      // 🟣 4. Select đầy đủ, có alias
      const publishCols = this.repository.metadata.columns
        .filter(
          (col) =>
            ![
              'createdAt',
              'createdBy',
              'modifiedAt',
              'modifiedBy',
              'deletedAt',
              'deletedBy',
              'active',
              ...this.privateColumns,
            ].includes(col.propertyName),
        )
        .map((col) => `${alias}.${col.databaseName}`);

      query.select(publishCols);

      // 🟢 5. Order by createdAt nếu có
      if (
        this.repository.metadata.columns.some(
          (col) => col.propertyName === 'modifiedAt',
        )
      ) {
        query.orderBy(`${alias}.modifiedAt`, 'DESC');
      }

      // 🟢 6. Phân trang
      const [data, total] = await query
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount();

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Lấy dữ liệu phân trang bảng ${alias} thành công`,
        data,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (e as Error).message,
        data: null,
      };
    }
  }

  // tìm 1 cái với id (chung)
  async findOne(id: number) {
    try {
      const data: any = [];
      const result = await this.repository.findOneBy({
        id: id,
      } as FindOptionsWhere<Entity>);

      if (!result) {
        return {
          status: HttpStatusCode.NOT_FOUND,
          code: ResponseCode.SUCCESS,
          message: `Không tìm thấy id = ${id} của bảng ${this.getTableName()}`,
          data: null,
        };
      }
      data.push(result);
      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Lấy dữ liêu của bảng ${this.getTableName()} thành công`,
        data,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (e as Error).message,
        data: null,
      };
    }
  }

  // lấy theo điều kiên (chung) => ko truyền vào thì lấy tất
  async find(condition = {}) {
    try {
      let query: SelectQueryBuilder<Entity> = this.handleSelect();
      query = this.handleWhere(query, condition);

      const data = await query.execute();

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Lấy dữ liệu của bảng ${this.getTableName()} thành công`,
        data,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (e as Error).message,
        data: null,
      };
    }
  }

  // thêm (chung)
  async create(dataReq: any) {
    try {
      const data: any = [];
      const result = await this.repository
        .createQueryBuilder(this.getTableName())
        .insert()
        .values(dataReq)
        .execute();

      const id = result.identifiers[0]?.id;
      if (!id) throw new Error('Insert failed');

      const object = await this.repository.findOne({
        where: { id },
      });
      if (object) data.push(object);
      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Tạo dữ liệu cho bảng ${this.getTableName()} thành công`,
        data,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (e as Error).message,
        data: null,
      };
    }
  }

  // sửa (chung)
  async updateOne(id: number, dataReq: any) {
    try {
      const data: any = [];
      const newDataReq = this.convertDatabaseNameToProperty(dataReq);

      const query: SelectQueryBuilder<Entity> =
        this.repository.createQueryBuilder();
      const updateResult = await query
        .update(this.repository.target)
        .set(newDataReq as any)
        .where('id = :id', { id })
        .andWhere('active = true')
        .execute();

      if (updateResult.affected === 0) {
        throw new Error('Update failed or record not found');
      }

      const object = await this.repository.findOne({
        where: { id } as FindOptionsWhere<Entity>,
      });
      if (object) data.push(object);

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Cập nhật dữ liệu của bảng ${this.getTableName()} thành công`,
        data,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (e as Error).message,
        data: null,
      };
    }
  }

  // xóa (chung)
  async softDelete(id: number) {
    try {
      const query = this.repository.createQueryBuilder();
      const result = await query
        .update(this.repository.target)
        .set({
          deletedAt: () => 'CURRENT_TIMESTAMP',
          active: false,
        } as any)
        .where('id = :id', { id })
        .execute();

      if (result.affected === 0) {
        throw new Error('Delete failed or record not found');
      }

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Xóa dữ liệu của bảng ${this.getTableName()} thành công`,
        data: null,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: (e as Error).message,
        data: null,
      };
    }
  }

  // lấy data json từ python
  async getJsonData(filename: string) {
    try {
      const filePath = path.join(process.cwd(), '../data', filename);

      if (!fs.existsSync(filePath)) {
        return {
          status: HttpStatusCode.NOT_FOUND,
          code: ResponseCode.ERROR,
          message: `Không tìm thấy file ${filename}`,
          data: null,
        };
      }

      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);

      return {
        status: HttpStatusCode.OK,
        code: ResponseCode.SUCCESS,
        message: `Đọc dữ liệu từ file ${filename} thành công`,
        data,
      };
    } catch (e) {
      return {
        status: HttpStatusCode.INTERNAL_ERROR,
        code: ResponseCode.ERROR,
        message: `Lỗi khi đọc file ${filename}: ${(e as Error).message}`,
        data: null,
      };
    }
  }
}

// import {
//   FindOptionsWhere,
//   InsertQueryBuilder,
//   Repository,
//   SelectQueryBuilder,
//   UpdateQueryBuilder,
// } from 'typeorm';
// import { BaseEntities } from './base.entities';
// import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata.js';
// import { HttpStatusCode, ResponseCode } from 'src/shared';

// export class BaseServices<Entity extends BaseEntities> {
//   constructor(protected readonly repository: Repository<Entity>) {}

//   protected convertDatabaseNameToProperty(dataReq: Record<string, any>) {
//     const columns = this.repository.metadata.columns;

//     // Lọc column có databaseName nằm trong keys của dataReq
//     const validColumns = columns.filter((col) =>
//       Object.keys(dataReq).includes(col.databaseName),
//     );

//     // Dùng reduce tạo object updateData với propertyName làm key
//     const newDataReq = validColumns.reduce((acc, col) => {
//       acc[col.propertyName as keyof Entity] = dataReq[col.databaseName];
//       return acc;
//     }, {} as Partial<Entity>);

//     return newDataReq;
//   }

//   protected privateColumns: string[] = [];
//   // lấy ra tên của bảng
//   protected getTableName(): string {
//     return this.repository.metadata.tableName;
//   }

//   // loại bớt những column private và trả về databaseName
//   protected getPublishColumn(): string[] {
//     const privateColumns = [
//       'createdAt',
//       'createdBy',
//       'modifiedAt',
//       'modifiedBy',
//       'deletedAt',
//       'deletedBy',
//       'active',
//       ...this.privateColumns,
//     ];
//     const columnMetadatas: ColumnMetadata[] =
//       this.repository.metadata.columns.filter(
//         (c: ColumnMetadata) => !privateColumns.includes(c.propertyName),
//       );

//     return columnMetadatas.map((c: ColumnMetadata) => c.databaseName);
//   }

//   // loại bớt những column private và trả về propertyName
//   protected getPublishPropertyNameColumn(): string[] {
//     const privateColumns = [
//       'createdAt',
//       'createdBy',
//       'modifiedAt',
//       'modifiedBy',
//       'deletedAt',
//       'deletedBy',
//       'active',
//       ...this.privateColumns,
//     ];
//     const columnMetadatas: ColumnMetadata[] =
//       this.repository.metadata.columns.filter(
//         (c: ColumnMetadata) => !privateColumns.includes(c.propertyName),
//       );

//     return columnMetadatas.map((c: ColumnMetadata) => c.propertyName);
//   }

//   protected handleSelect(): SelectQueryBuilder<Entity> {
//     const query: SelectQueryBuilder<Entity> = this.repository
//       .createQueryBuilder(this.getTableName())
//       .select(this.getPublishColumn());
//     return query;
//   }

//   protected handleWhere(
//     query: SelectQueryBuilder<Entity>,
//     condition: Partial<Record<keyof Entity, any>>,
//   ): SelectQueryBuilder<Entity> {
//     return query.where({ ...condition });
//   }

//   // tìm 1 cái với id (chung)
//   async findOne(id: number) {
//     try {
//       const data: any = [];
//       const result = await this.repository.findOneBy({
//         id: id,
//       } as FindOptionsWhere<Entity>);

//       if (!result) {
//         return {
//           status: HttpStatusCode.NOT_FOUND,
//           code: ResponseCode.SUCCESS,
//           message: `Không tìm thấy id = ${id} của bảng ${this.getTableName()}`,
//           data: null,
//         };
//       }
//       data.push(result);
//       return {
//         status: HttpStatusCode.OK,
//         code: ResponseCode.SUCCESS,
//         message: `Lấy dữ liêu của bảng ${this.getTableName()} thành công`,
//         data,
//       };
//     } catch (e) {
//       return {
//         status: HttpStatusCode.INTERNAL_ERROR,
//         code: ResponseCode.ERROR,
//         message: (e as Error).message,
//         data: null,
//       };
//     }
//   }

//   async paginate(
//     condition: Partial<Record<keyof Entity, any>> = {},
//     page: number = 1,
//     limit: number = 10,
//     searchFilters?: Partial<Record<keyof Entity, any>>,
//   ) {
//     try {
//       const alias = this.getTableName();

//       // 🟣 1. Tạo query builder thủ công, không dùng handleSelect()
//       const query = this.repository
//         .createQueryBuilder(alias)
//         .where(`${alias}.active = true`)
//         .andWhere(`${alias}.deleted_at IS NULL`);

//       // 🟢 2. Điều kiện EQUAL
//       if (Object.keys(condition).length > 0) {
//         for (const [key, value] of Object.entries(condition)) {
//           if (value !== undefined && value !== null && value !== '') {
//             query.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
//           }
//         }
//       }

//       // 🟢 3. Điều kiện LIKE (search)
//       if (searchFilters && Object.keys(searchFilters).length > 0) {
//         const searchExprs: string[] = [];
//         const searchParams: Record<string, any> = {};

//         for (const [key, value] of Object.entries(searchFilters)) {
//           if (value !== undefined && value !== null && value !== '') {
//             const paramKey = `search_${key}`;
//             searchExprs.push(`${alias}.${key} LIKE :${paramKey}`);
//             searchParams[paramKey] = `%${value}%`;
//           }
//         }

//         if (searchExprs.length > 0) {
//           // Dùng OR để dễ lọc hơn
//           query.andWhere(`(${searchExprs.join(' OR ')})`, searchParams);
//         }
//       }

//       // 🟣 4. Select đầy đủ, có alias
//       const publishCols = this.repository.metadata.columns
//         .filter(
//           (col) =>
//             ![
//               'createdAt',
//               'createdBy',
//               'modifiedAt',
//               'modifiedBy',
//               'deletedAt',
//               'deletedBy',
//               'active',
//               ...this.privateColumns,
//             ].includes(col.propertyName),
//         )
//         .map((col) => `${alias}.${col.databaseName}`);

//       query.select(publishCols);

//       // 🟢 5. Order by createdAt nếu có
//       if (
//         this.repository.metadata.columns.some(
//           (col) => col.propertyName === 'createdAt',
//         )
//       ) {
//         query.orderBy(`${alias}.created_at`, 'DESC');
//       }

//       // 🟢 6. Phân trang
//       const [data, total] = await query
//         .take(limit)
//         .skip((page - 1) * limit)
//         .getManyAndCount();

//       return {
//         status: HttpStatusCode.OK,
//         code: ResponseCode.SUCCESS,
//         message: `Lấy dữ liệu phân trang bảng ${alias} thành công`,
//         data,
//         meta: {
//           page,
//           limit,
//           total,
//           totalPages: Math.ceil(total / limit),
//         },
//       };
//     } catch (e) {
//       return {
//         status: HttpStatusCode.INTERNAL_ERROR,
//         code: ResponseCode.ERROR,
//         message: (e as Error).message,
//         data: null,
//       };
//     }
//   }

//   // lấy theo điều kiên (chung) => ko truyền vào thì lấy tất
//   async find(condition = {}) {
//     try {
//       let query: SelectQueryBuilder<Entity> = this.handleSelect();
//       query = this.handleWhere(query, condition);

//       const data = await query.execute();

//       return {
//         status: HttpStatusCode.OK,
//         code: ResponseCode.SUCCESS,
//         message: `Lấy dữ liệu của bảng ${this.getTableName()} thành công`,
//         data,
//       };
//     } catch (e) {
//       return {
//         status: HttpStatusCode.INTERNAL_ERROR,
//         code: ResponseCode.ERROR,
//         message: (e as Error).message,
//         data: null,
//       };
//     }
//   }

//   // thêm (chung)
//   async create(dataReq: any) {
//     try {
//       const data: any = [];
//       const result = await this.repository
//         .createQueryBuilder(this.getTableName())
//         .insert()
//         .values(dataReq)
//         .execute();

//       const id = result.identifiers[0]?.id;
//       if (!id) throw new Error('Insert failed');

//       const object = await this.repository.findOne({
//         where: { id },
//       });
//       if (object) data.push(object);
//       return {
//         status: HttpStatusCode.OK,
//         code: ResponseCode.SUCCESS,
//         message: `Tạo dữ liệu cho bảng ${this.getTableName()} thành công`,
//         data,
//       };
//     } catch (e) {
//       return {
//         status: HttpStatusCode.INTERNAL_ERROR,
//         code: ResponseCode.ERROR,
//         message: (e as Error).message,
//         data: null,
//       };
//     }
//   }

//   // sửa (chung)
//   async updateOne(id: number, dataReq: any) {
//     try {
//       const data: any = [];
//       const newDataReq = this.convertDatabaseNameToProperty(dataReq);

//       const query: SelectQueryBuilder<Entity> =
//         this.repository.createQueryBuilder();
//       const updateResult = await query
//         .update(this.repository.target)
//         .set(newDataReq as any)
//         .where('id = :id', { id })
//         .andWhere('active = true')
//         .execute();

//       if (updateResult.affected === 0) {
//         throw new Error('Update failed or record not found');
//       }

//       const object = await this.repository.findOne({
//         where: { id } as FindOptionsWhere<Entity>,
//       });
//       if (object) data.push(object);

//       return {
//         status: HttpStatusCode.OK,
//         code: ResponseCode.SUCCESS,
//         message: `Cập nhật dữ liệu của bảng ${this.getTableName()} thành công`,
//         data,
//       };
//     } catch (e) {
//       return {
//         status: HttpStatusCode.INTERNAL_ERROR,
//         code: ResponseCode.ERROR,
//         message: (e as Error).message,
//         data: null,
//       };
//     }
//   }

//   // xóa (chung)
//   async softDelete(id: number) {
//     try {
//       const query = this.repository.createQueryBuilder();
//       const result = await query
//         .update(this.repository.target)
//         .set({
//           deletedAt: () => 'CURRENT_TIMESTAMP',
//           active: false,
//         } as any)
//         .where('id = :id', { id })
//         .execute();

//       if (result.affected === 0) {
//         throw new Error('Delete failed or record not found');
//       }

//       return {
//         status: HttpStatusCode.OK,
//         code: ResponseCode.SUCCESS,
//         message: `Xóa dữ liệu của bảng ${this.getTableName()} thành công`,
//         data: null,
//       };
//     } catch (e) {
//       return {
//         status: HttpStatusCode.INTERNAL_ERROR,
//         code: ResponseCode.ERROR,
//         message: (e as Error).message,
//         data: null,
//       };
//     }
//   }
// }
