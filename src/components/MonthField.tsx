import React, { useEffect, useRef, useState } from "react";
import { eachYearOfInterval, format, parse, startOfDay } from "date-fns";

type props = {
  onChange: (value: string) => void;
};

function MonthField({ onChange }: props) {
  const date = new Date();
  let today = startOfDay(date);
  const [toggle, setToggle] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(format(today, "MMMM"));

  const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const element = useRef<any>();
  useEffect(() => {
    const clickOutSide = (e: any) => {
      if (!element.current.contains(e.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", clickOutSide);
    return () => {
      document.removeEventListener("mousedown", clickOutSide);
    };
  });

  return (
    <>
      <div ref={element} className=" relative inline-block z-10">
        <input
          type="text"
          value={currentMonth}
          onClick={() => setToggle(true)}
        />
        {toggle && (
          <ul className="absolute top-full left-0 w-full bg-white shadow-md max-h-[200px] overflow-auto">
            {Months.map((month, index) => (
              <li
                key={index}
                style={{
                  width: "100%",
                  marginBottom: "0",
                }}
                className={`py-1 px-2 text-[12px] border bordeer-black w-full cursor-pointer hover:bg-red-2 hover:text-white ${
                  currentMonth === month
                    ? " bg-red-2 text-white"
                    : "text-[#757575]"
                }`}
                onClick={() => {
                  setCurrentMonth(month);

                  onChange(month);
                  setToggle(false);
                }}
              >
                {month}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default MonthField;
