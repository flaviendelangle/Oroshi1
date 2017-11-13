import { setValue, getValue } from 'services/localstorage'

export const sortElements = (elements, params) => {
  elements = elements.sort((a, b) => {
    let comparison = 0;
    const key = params.field;
    const mul = params.direction === 'asc' ? 1 : -1;
    if(a[key] > b[key])
      comparison = mul;
    else if(a[key] < b[key])
      comparison = -1 * mul;
    return comparison;
  });
  return elements;
};

export const setSortParameters = (params, defaultOrder) => {
  let oldParams = getValue('order') || defaultOrder;
  oldParams[params.layout] = params;
  setValue('order', oldParams);
};

export const setLayoutParameters = params => {
  setValue('layout', params);
};