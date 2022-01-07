export const arrayDifference = <Type>(first: Type[], seconnd: Type[]): Type[] => {
  const result: Type[] = [];
  for (const p of first) {
    if (seconnd.indexOf(p) === -1) {
      result.push(p);
    }
  }

  return result;
};
