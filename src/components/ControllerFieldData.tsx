"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { Controller } from "react-hook-form";

import { useFetch } from "@/util/api";

type Props = {
  control: any;
  errors: any;
  name: string;
  rules?: any;
  placeholder: string;
  endpoint: string;
  parentFilter?: string | number;
  displayValue?: string;
  keyID?: string;
  keyName?: string;
  FourData?: boolean;
  displayValueKey: string;
  setDisplayValue: Function;
};

function ControllerFieldData({
  control,
  errors,
  name,
  rules,
  placeholder,
  endpoint,
  parentFilter,
  displayValue,
  keyID,
  keyName,
  FourData,
  displayValueKey,
  setDisplayValue,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Field
          field={field}
          name={name}
          endpoint={endpoint}
          placeholder={placeholder}
          errors={errors}
          parentID={parentFilter}
          displayValue={displayValue}
          keyID={keyID}
          keyName={keyName}
          FourData={FourData}
          displayValueKey={displayValueKey}
          setDisplayValue={setDisplayValue}
        />
      )}
    />
  );
}

export default ControllerFieldData;

const Field = ({
  field,
  name,
  endpoint,
  placeholder,
  errors,
  parentFilter,
  displayValue,
  keyID,
  keyName,
  FourData,
  displayValueKey,
  setDisplayValue,
}: any) => {
  const [open, setOpen] = useState(false);
  const { isLoading, isError, data } = useFetch(
    name,
    [name, field.value, parentFilter],
    `${endpoint}${parentFilter ? `${parentFilter}` : ""}`
  );

  return (
    <aside>
      <label htmlFor={name} className=" text-[.9rem] text-red-2">
        {placeholder}
      </label>

      <div className="relative">
        <input type="text" hidden name={displayValueKey} />
        <input
          id={name}
          placeholder={isLoading ? "Loading..." : ""}
          type="text"
          autoComplete="off"
          onFocus={() => setOpen(true)}
          {...field}
          value={displayValue}
          disabled={isLoading || parentFilter === "" || parentFilter === null}
          className=" w-full"
        />
        {open && (
          <ul className=" absolute top-[110%] z-10 left-0 bg-white w-full shadow-md max-h-[10rem] overflow-auto">
            {FourData ? (
              <>
                {data?.data?.data?.data.map((item: any, indx: number) => (
                  <li
                    key={indx}
                    className=" px-2 py-1 hover:bg-red-2 hover:text-white duration-150 cursor-pointer"
                    onClick={() => {
                      field.onChange(keyID ? item[keyID] : item?.id);
                      setDisplayValue(
                        displayValueKey,
                        keyName ? item[keyName] : item?.name
                      );
                      setOpen(false);
                    }}
                  >
                    {keyName ? item[keyName] : item?.name}
                  </li>
                ))}
              </>
            ) : (
              <>
                {data?.data?.data.map((item: any, indx: number) => (
                  <li
                    key={indx}
                    className=" px-2 py-1 hover:bg-red-2 hover:text-white duration-150 cursor-pointer"
                    onClick={() => {
                      field.onChange(keyID ? item[keyID] : item?.id);
                      setDisplayValue(
                        displayValueKey,
                        keyName ? item[keyName] : item?.name
                      );
                      setOpen(false);
                    }}
                  >
                    {keyName ? item[keyName] : item?.name}
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </div>

      {errors[name]?.message && (
        <span className=" text-[.9rem] text-red-2">
          {errors[name]?.message}
        </span>
      )}
    </aside>
  );
};
