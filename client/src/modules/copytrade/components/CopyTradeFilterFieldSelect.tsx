import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { institutionalFilterSelectContentClass } from "@/lib/institutionalDataChrome";
import type { CopyTradeFilterSelectOption } from "../lib/copyTradeFilterOptions";

type CopyTradeFilterFieldSelectProps = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  triggerClassName: string;
  options: CopyTradeFilterSelectOption[];
};

export function CopyTradeFilterFieldSelect({
  id,
  value,
  onValueChange,
  placeholder,
  triggerClassName,
  options,
}: CopyTradeFilterFieldSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={institutionalFilterSelectContentClass}>
        {options.map((o) => (
          <SelectItem
            key={o.value}
            value={o.value}
            className="text-xs uppercase font-bold tracking-wider text-foreground focus:bg-accent focus:text-accent-foreground"
          >
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
