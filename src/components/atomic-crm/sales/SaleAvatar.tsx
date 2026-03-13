import { useRecordContext } from "ra-core";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Sale } from "../types";

export const SaleAvatar = ({
  sale,
  size = 20,
  title,
}: {
  sale?: Sale;
  size?: 20 | 24 | 32 | 40;
  title?: string;
}) => {
  const saleFromContext = useRecordContext<Sale>();
  const finalSale = sale ?? saleFromContext;

  if (!finalSale) {
    return null;
  }

  const sizeClass =
    size === 20
      ? "w-5 h-5"
      : size === 24
        ? "w-6 h-6"
        : size === 32
          ? "w-8 h-8"
          : "w-10 h-10";

  const initials = `${finalSale.first_name?.charAt(0) ?? ""}${
    finalSale.last_name?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <Avatar
      className={sizeClass}
      title={title ?? `${finalSale.first_name} ${finalSale.last_name}`}
    >
      <AvatarImage src={finalSale.avatar?.src ?? undefined} />
      <AvatarFallback className={size < 40 ? "text-[10px]" : "text-sm"}>
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
};
