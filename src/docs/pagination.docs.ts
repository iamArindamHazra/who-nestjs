import { ApiQueryOptions } from '@nestjs/swagger';

export const PaginationDocs = {
  params: {
    pagination: {
      name: 'start',
      required: false,
      type: Number,
      description: `
      Represents the starting offset (index) for records.
      Example: start=0
      `,
    } as ApiQueryOptions,
    limit: {
      name: 'limit',
      required: false,
      type: Number,
      description: `
      Maximum number of records to return per page.
      Default Value: 20
      Example: limit=20
      `,
    } as ApiQueryOptions,
    sort: {
      name: 'sort',
      required: false,
      type: String,
      description: `
      Allows sorting the results by any field—including nested fields—and supports multiple keys.
      Format: A comma-separated list where each field can be optionally prefixed by a minus (-) to indicate descending order.
      Example: sort=-price,createdAt (Sorts by price descending, then by createdAt ascending)
      `,
      example: '',
    } as ApiQueryOptions,
    or: {
      name: 'or',
      required: false,
      type: String,
      description: `
      Combine multiple conditions with OR operator.
      Format: field:operator:value,field:operator:value
      Example: status:eq:active,status:eq:pending
      `,
      example: '',
    } as ApiQueryOptions,
    // Common filter examples
    fieldEquals: {
      name: 'field',
      required: false,
      type: String,
      description: `
      Filter by exact match (eq operator).
      Example: username=john (equivalent to username:eq:john)
      `,
    } as ApiQueryOptions,
    fieldContains: {
      name: 'field:contains',
      required: false,
      type: String,
      description: `
      Filter by substring match.
      Example: username:contains=jo
      `,
    } as ApiQueryOptions,
    fieldGreaterThan: {
      name: 'field:gt',
      required: false,
      type: String,
      description: `
      Filter by greater than comparison.
      Example: age:gt=25
      `,
    } as ApiQueryOptions,
    fieldIn: {
      name: 'field:in',
      required: false,
      type: String,
      description: `
      Filter by multiple allowed values.
      Example: status:in=active,pending,completed
      `,
    } as ApiQueryOptions,
  },
  filtering: {
    description: 'Filtering options for the API',
    syntax: 'field:operator=value',
    operators: {
      eq: 'Equals (default if no operator specified)',
      neq: 'Not equals',
      contains: 'Contains the value (case-insensitive)',
      notContains: 'Does not contain the value (case-insensitive)',
      startsWith: 'Starts with the value (case-insensitive)',
      endsWith: 'Ends with the value (case-insensitive)',
      similar: 'Similar to the value (case-insensitive)',
      gt: 'Greater than',
      lt: 'Less than',
      gte: 'Greater than or equal to',
      lte: 'Less than or equal to',
      in: 'Value is in a comma-separated list',
      nin: 'Value is not in a comma-separated list',
      exists: 'Field exists',
      notExists: 'Field does not exist',
      between: 'Value is between two comma-separated values (inclusive)',
      notBetween: 'Value is not between two comma-separated values (inclusive)',
      regex:
        'Matches the provided regular expression pattern (case-insensitive)',
    },
    examples: [
      {
        description: 'Basic equals filter',
        example: 'name=John',
      },
      {
        description: 'Not equals filter',
        example: 'name:neq=John',
      },
      {
        description: 'Contains filter (case-insensitive)',
        example: 'name:contains=oh',
      },
      {
        description: 'Starts with filter',
        example: 'name:startsWith=J',
      },
      {
        description: 'Ends with filter',
        example: 'name:endsWith=hn',
      },
      {
        description: 'Greater than filter',
        example: 'age:gt=25',
      },
      {
        description: 'Less than or equal to filter',
        example: 'age:lte=30',
      },
      {
        description: 'In filter with comma-separated values',
        example: 'status:in=active,pending',
      },
      {
        description: 'Not in filter',
        example: 'status:nin=deleted,archived',
      },
      {
        description: 'Field exists filter',
        example: 'email:exists=true',
      },
      {
        description: 'Between filter',
        example: 'age:between=25,35',
      },
      {
        description: 'Regular expression filter',
        example: 'name:regex=^Jo.*n$',
      },
      {
        description: 'Multiple filters (AND condition)',
        example: 'name:contains=john&age:gt=25',
      },
      {
        description: 'OR condition with multiple filters',
        example: 'or=status:eq:active,status:eq:pending',
      },
    ],
    notes: [
      'Multiple filters are combined with AND logic by default',
      'Use the "or" parameter to combine multiple conditions with OR logic',
      'The "or" parameter accepts a comma-separated list of conditions in the format field:operator:value',
      'All string comparisons are case-insensitive by default',
      'For the "between" and "notBetween" operators, provide two comma-separated values',
      'The "regex" operator allows for custom regular expression patterns',
      'Boolean values should be specified as "true" or "false"',
      'Numeric values are automatically converted to the appropriate type',
    ],
  },
  responses: {
    200: {
      status: 200,
      description: 'Paginated response with data and metadata',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            description: 'Array of items matching the query criteria',
            items: {
              type: 'object',
              description: 'Will contain the actual data items',
            },
          },
          start: {
            type: 'number',
            description: 'Starting index of the current page',
            example: 0,
          },
          limit: {
            type: 'number',
            description: 'Number of items per page',
            example: 20,
          },
          filteredTotalRecords: {
            type: 'number',
            description: 'Total number of records matching the filter criteria',
            example: 12,
          },
          totalRecords: {
            type: 'number',
            description: 'Total number of records in the collection',
            example: 25,
          },
        },
      },
    },
  },
};
