import { SelectType } from "@/types/global-type";
import clsx from "clsx";

export const SelectComponent = ({
  plachoderOptions,
  options,
  value,
  className,
  onChange,
}: SelectType) => {
  const handleChange = (value: string) => {
    onChange && onChange(value);
  };

  return (
    <select
      className={clsx("text-[14px] cursor-pointer", className)}
      defaultValue={""}
      value={value}
      onChange={(e) => handleChange(e?.target?.value)}
    >
      {plachoderOptions && (
        <option value={plachoderOptions?.value} disabled hidden>
          {plachoderOptions?.name}
        </option>
      )}
      {options?.map((type, index) => {
        return (
          <option key={index} value={type?.value} className="py-3">
            {type?.name}
          </option>
        );
      })}
    </select>
  );
};
