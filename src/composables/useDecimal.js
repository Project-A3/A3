export default function useDecimal() {
  const removeCommas = (num) => {
    return Number(num.toString().replace(/,/g,''));
  }

  const roundToPrecision = (value, precision) => {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  const getMultiplierAndDecimalPlaces = (a, b) => {
    const decimalPlacesA = ((a.toString().split('.')[1] || []).length);
    const decimalPlacesB = ((b.toString().split('.')[1] || []).length);
    const maxDecimalPlaces = Math.max(decimalPlacesA, decimalPlacesB);

    return {
      multiplier: Math.pow(10, maxDecimalPlaces),
      decimalPlaces: maxDecimalPlaces
    }
  }

  //加法
  const add = (a, b) => {
    a = removeCommas(a);
    b = removeCommas(b);
    const { multiplier } = getMultiplierAndDecimalPlaces(a, b);
    return roundToPrecision(a * multiplier + b * multiplier, 0) / multiplier;
  };

  //減法
  const subtract = (a, b) => {
    a = removeCommas(a);
    b = removeCommas(b);
    const { multiplier } = getMultiplierAndDecimalPlaces(a, b);
    return roundToPrecision(a * multiplier - b * multiplier, 0) / multiplier;
  };

  //除法
  const divide = (a, b) => {
    a = removeCommas(a);
    b = removeCommas(b);
    const { multiplier, decimalPlaces} = getMultiplierAndDecimalPlaces(a, b);
    const result = roundToPrecision(a * multiplier, 0) / roundToPrecision(b * multiplier, 0);
    return parseFloat(result.toFixed(decimalPlaces));
  }

  //乘法
  const multiply = (a, b) => {
    a = removeCommas(a);
    b = removeCommas(b);
    const multiplierA = getMultiplierAndDecimalPlaces(a, 1).multiplier;
    const multiplierB = getMultiplierAndDecimalPlaces(b, 1).multiplier;
    const { decimalPlaces} = getMultiplierAndDecimalPlaces(a, b);
    const result = roundToPrecision(a * multiplierA, 0) * roundToPrecision(b * multiplierB, 0) / (multiplierA * multiplierB);
    return parseFloat(result.toFixed(decimalPlaces));
  }

  return {
    add,
    subtract,
    divide,
    multiply
  };
}
