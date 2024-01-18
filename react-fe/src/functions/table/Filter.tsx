import { Select } from '@chakra-ui/react';
import { Column } from '@tanstack/table-core';
import * as React from 'react';

/* eslint-disable */

interface IFilterProps {
  column: Column<any, unknown>;
}

const Filter: React.FunctionComponent<IFilterProps> = (props) => {
  const { column } = props;
  const facetedUniqueValues = Array.from(column.getFacetedUniqueValues().keys());
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = React.useMemo(() => {
    if (arrayCheck(facetedUniqueValues)) {
      // eslint-disable
      return facetedUniqueValues.sort();
    } else if (isArrayOfArrays(facetedUniqueValues)) {
      const temp: string[] = [];
      facetedUniqueValues.forEach((values: any[]) => {
        values.forEach((value: any) => {
          if (value.title) {
            temp.push(value.title);
          }
        });
      });
      return [...new Set(temp)];
    } else {
      const temp = facetedUniqueValues.map((value) => value.title).sort();
      return [...new Set(temp)];
    }
  }, [facetedUniqueValues]);
  const heading = column.columnDef.meta?.filterTitle ?? column.columnDef.header ?? 'Suche';

  return (
    <Select
      maxW="300px"
      size={'sm'}
      variant={'wedding'}
      placeholder={`${heading}... (${sortedUniqueValues.length})`}
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      boxShadow={'md'}
      border={column.getIsFiltered() ? '1px solid' : 'inherit'}
    >
      {sortedUniqueValues.map((value, index) => (
        <option key={index}>{value}</option>
      ))}
    </Select>
  );
};

const arrayCheck = (value: any): boolean => {
  if (Array.isArray(value)) {
    let somethingIsNotString = false;
    value.forEach(function (item) {
      if (typeof item !== 'string') {
        somethingIsNotString = true;
      }
    });
    return !somethingIsNotString && value.length > 0;
  }
  return false;
};

const isArrayOfArrays = (value: any): boolean => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every((item) => Array.isArray(item));
};

/* eslint-enable */

export default Filter;
