export const hiddenLongText = (
  text: string | undefined | null,
  numberTextShow?: number
) => {
  if (!text) return "";
  const numbTextShow = numberTextShow ? numberTextShow : 4;
  if (2 * numbTextShow >= text.length) return text;
  const before = text.substring(0, 6);
  const after = text.substring(
    text?.length - (numbTextShow ? numbTextShow : 3),
    text?.length
  );
  return before + "..." + after;
};

export const getBoxesText = (numberBox: number | any) => {
  if (!numberBox) return "0 box";
  if (numberBox <= 1) return `${numberBox} box`;
  return `${numberBox} boxes`;
};
