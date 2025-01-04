import { NumericFormat, NumericFormatProps } from "react-number-format";
import React, { forwardRef } from "react";
import { Input } from "@/app/_components/ui/input";

export const MoneyInput = forwardRef(
  (props: NumericFormatProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
      <NumericFormat
        {...props}
        thousandSeparator="."
        decimalSeparator=","
        prefix="RS "
        allowNegative={false}
        customInput={Input}
        getInputRef={ref}
      />
    );
  },
);
MoneyInput.displayName = "MoneyInput";
