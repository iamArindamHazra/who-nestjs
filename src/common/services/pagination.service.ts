import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { PaginationDto } from '../dto/pagination.dto';

enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  SIMILAR = 'similar',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  GREATER_THAN_EQUALS = 'gte',
  LESS_THAN_EQUALS = 'lte',
  IN = 'in',
  NOT_IN = 'nin',
  EXISTS = 'exists',
  NOT_EXISTS = 'notExists',
  BETWEEN = 'between',
  NOT_BETWEEN = 'notBetween',
  REGEX = 'regex',
}

interface ParsedFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}

@Injectable()
export class PaginationService {
  async paginate<T extends Document>(
    model: Model<T>,
    queryParams: PaginationDto & Record<string, any>,
  ) {
    const { start = 0, limit = 20, sort, or, ...filterParams } = queryParams;
    const query = model.find();

    // Handle filters
    const filters = this.parseFilters(filterParams);
    const orFilters = or ? this.parseOrFilters(or) : [];

    if (filters.length > 0 || orFilters.length > 0) {
      const filterQuery: any = { $and: [] };

      if (filters.length > 0) {
        filterQuery.$and.push({
          $and: filters.map((filter) => this.buildFilterCondition(filter)),
        });
      }

      if (orFilters.length > 0) {
        filterQuery.$and.push({
          $or: orFilters.map((filter) => this.buildFilterCondition(filter)),
        });
      }

      query.where(filterQuery);
    }

    // Handle sorting
    if (sort) {
      const sortCriteria = this.parseSortString(sort);
      query.sort(sortCriteria);
    }

    // Get total counts
    const totalRecords = await model.countDocuments();
    const filteredTotalRecords = await query.clone().countDocuments();

    // Apply pagination
    const data = await query.skip(start).limit(limit).exec();

    return {
      data,
      start,
      limit,
      filteredTotalRecords,
      totalRecords,
    };
  }

  private parseFilters(params: Record<string, any>): ParsedFilter[] {
    return Object.entries(params)
      .filter(([key]) => !['start', 'limit', 'sort', 'or'].includes(key))
      .map(([key, value]) => {
        const [field, operator = FilterOperator.EQUALS] = key.split(':');
        return {
          field,
          operator: operator as FilterOperator,
          value,
        };
      });
  }

  private parseOrFilters(orString: string): ParsedFilter[] {
    return orString.split(',').map((condition) => {
      const [field, operator = FilterOperator.EQUALS, value] =
        condition.split(':');
      return {
        field,
        operator: operator as FilterOperator,
        value,
      };
    });
  }

  private parseSortString(sortString: string): Record<string, 1 | -1> {
    const sortCriteria: Record<string, 1 | -1> = {};

    sortString.split(',').forEach((field) => {
      if (field.startsWith('-')) {
        sortCriteria[field.substring(1)] = -1;
      } else {
        sortCriteria[field] = 1;
      }
    });

    return sortCriteria;
  }

  private buildFilterCondition(filter: ParsedFilter) {
    const { field, operator, value } = filter;
    const condition: any = {};

    switch (operator) {
      case FilterOperator.EQUALS:
        condition[field] = value;
        break;
      case FilterOperator.NOT_EQUALS:
        condition[field] = { $ne: value };
        break;
      case FilterOperator.CONTAINS:
        condition[field] = { $regex: value, $options: 'i' };
        break;
      case FilterOperator.NOT_CONTAINS:
        condition[field] = { $not: { $regex: value, $options: 'i' } };
        break;
      case FilterOperator.STARTS_WITH:
        condition[field] = { $regex: `^${value}`, $options: 'i' };
        break;
      case FilterOperator.ENDS_WITH:
        condition[field] = { $regex: `${value}$`, $options: 'i' };
        break;
      case FilterOperator.SIMILAR:
        const escapedValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const pattern = `^${escapedValue}`;
        condition[field] = {
          $regex: pattern,
          $options: 'i',
        };
        break;
      case FilterOperator.GREATER_THAN:
        condition[field] = { $gt: value };
        break;
      case FilterOperator.LESS_THAN:
        condition[field] = { $lt: value };
        break;
      case FilterOperator.GREATER_THAN_EQUALS:
        condition[field] = { $gte: value };
        break;
      case FilterOperator.LESS_THAN_EQUALS:
        condition[field] = { $lte: value };
        break;
      case FilterOperator.IN:
        const inValues = typeof value === 'string' ? value.split(',') : value;
        condition[field] = { $in: inValues };
        break;
      case FilterOperator.NOT_IN:
        const notInValues =
          typeof value === 'string' ? value.split(',') : value;
        condition[field] = { $nin: notInValues };
        break;
      case FilterOperator.EXISTS:
        condition[field] = { $exists: true };
        break;
      case FilterOperator.NOT_EXISTS:
        condition[field] = { $exists: false };
        break;
      case FilterOperator.BETWEEN:
        const [min, max] = value.split(',');
        condition[field] = { $gte: min, $lte: max };
        break;
      case FilterOperator.NOT_BETWEEN:
        const [notMin, notMax] = value.split(',');
        condition[field] = { $not: { $gte: notMin, $lte: notMax } };
        break;
      case FilterOperator.REGEX:
        // For advanced users who want to write their own regex
        condition[field] = { $regex: value, $options: 'i' };
        break;
    }

    return condition;
  }
}
