/* eslint-disable react-hooks/exhaustive-deps */
import { InputType } from "@/types/global-type";
import clsx from "clsx";
import { ChangeEvent, useEffect, useState } from "react";

export const InputSearch = ({
  className,
  searchClassName,
  searchSizes,
  isForm,
  padding,
  bg,
  border,
  placeholder,
  onChange,
}: InputType) => {
  const [search, setSearch] = useState<string>("");

  const handleChange = (value: string) => {
    onChange && onChange(value);
  };

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onChange && onChange(search);
  };

  useEffect(() => {
    if (!search && isForm) {
      onChange && onChange(search);
    }
  }, [search, isForm]);

  if (isForm) {
    return (
      <form
        className={clsx("search", searchSizes ? `search-${searchSizes}` : "")}
        onSubmit={handleSubmit}
      >
        <input
          value={search}
          placeholder={placeholder}
          className={clsx(
            className,
            padding ? padding : "py-[9px] pl-[12px] pr-[40px]"
          )}
          style={{ background: bg, border: border }}
          onChange={handleChangeForm}
        />
        <button
          type="submit"
          className={searchClassName}
          onClick={(e) => handleSubmit(e as any)}
        />
      </form>
    );
  }

  return (
    <div className="search">
      <input
        placeholder={placeholder}
        className={clsx(
          className,
          padding ? padding : "py-[9px] pl-[12px] pr-[40px]"
        )}
        onChange={(e) => handleChange(e?.target?.value)}
      />
    </div>
  );
};
