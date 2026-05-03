import { InstitutionalFilterSearchField } from "@/components/shared/InstitutionalFilterSearchField";
import { InstitutionalMobileFilterSheet } from "@/components/shared/InstitutionalMobileFilterSheet";
import {
  INSTITUTIONAL_FILTER_BAR,
  institutionalFieldLabelClass,
  institutionalFilterSelectTriggerClass,
  institutionalFilterSelectTriggerSheetClass,
} from "@/lib/institutionalDataChrome";
import { cn } from "@/lib/utils";
import { ArbitrageRefreshButton } from "@/modules/arbitrage/components/ArbitrageRefreshButton";
import {
  COPYTRADE_CAPACITY_FILTER_OPTIONS,
  COPYTRADE_CONFIDENCE_FILTER_OPTIONS,
  COPYTRADE_GRADE_FILTER_OPTIONS,
  COPYTRADE_SIGNAL_FILTER_OPTIONS,
} from "../lib/copyTradeFilterOptions";
import { CopyTradeFilterFieldSelect } from "./CopyTradeFilterFieldSelect";

export type CopyTradeFiltersToolbarProps = {
  traderQuery: string;
  onTraderQueryChange: (value: string) => void;
  grade: string;
  onGradeChange: (value: string) => void;
  confidence: string;
  onConfidenceChange: (value: string) => void;
  signal: string;
  onSignalChange: (value: string) => void;
  capacity: string;
  onCapacityChange: (value: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
};

export type CopyTradeMobileActionsProps = CopyTradeFiltersToolbarProps & {
  onClearAllFilters: () => void;
};

export function CopyTradeFiltersToolbar({
  traderQuery,
  onTraderQueryChange,
  grade,
  onGradeChange,
  confidence,
  onConfidenceChange,
  signal,
  onSignalChange,
  capacity,
  onCapacityChange,
  isFetching,
  onRefresh,
}: CopyTradeFiltersToolbarProps) {
  return (
    <div className={cn(INSTITUTIONAL_FILTER_BAR, "hidden px-0 md:block")}>
      <div className="md:grid md:grid-cols-[minmax(11rem,1fr)_minmax(7.25rem,9.5rem)_minmax(7.25rem,9.5rem)_minmax(7.25rem,9.5rem)_minmax(7.25rem,9.5rem)_auto] md:items-end md:gap-x-3 md:gap-y-2">
        <InstitutionalFilterSearchField
          id="copytrade-trader-filter"
          label="Trader"
          value={traderQuery}
          onChange={onTraderQueryChange}
          placeholder="Handle or trader ID…"
        />
        <div className="min-w-0">
          <label htmlFor="copytrade-grade-desktop" className={institutionalFieldLabelClass}>
            Grade
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-grade-desktop"
            value={grade}
            onValueChange={onGradeChange}
            placeholder="Grade"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={COPYTRADE_GRADE_FILTER_OPTIONS}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="copytrade-confidence-desktop" className={institutionalFieldLabelClass}>
            Confidence
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-confidence-desktop"
            value={confidence}
            onValueChange={onConfidenceChange}
            placeholder="Confidence"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={COPYTRADE_CONFIDENCE_FILTER_OPTIONS}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="copytrade-signal-desktop" className={institutionalFieldLabelClass}>
            Signal
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-signal-desktop"
            value={signal}
            onValueChange={onSignalChange}
            placeholder="Signal"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={COPYTRADE_SIGNAL_FILTER_OPTIONS}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="copytrade-capacity-desktop" className={institutionalFieldLabelClass}>
            Capacity
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-capacity-desktop"
            value={capacity}
            onValueChange={onCapacityChange}
            placeholder="Capacity"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={COPYTRADE_CAPACITY_FILTER_OPTIONS}
          />
        </div>
        <div className="w-min min-w-0 shrink-0 justify-self-end">
          <div aria-hidden className="mb-1 h-5 shrink-0" />
          <ArbitrageRefreshButton isFetching={isFetching} onRefresh={onRefresh} />
        </div>
      </div>
    </div>
  );
}

export function CopyTradeMobileActions({
  traderQuery,
  onTraderQueryChange,
  grade,
  onGradeChange,
  confidence,
  onConfidenceChange,
  signal,
  onSignalChange,
  capacity,
  onCapacityChange,
  isFetching,
  onRefresh,
  onClearAllFilters,
}: CopyTradeMobileActionsProps) {
  return (
    <div className="flex items-center gap-2 md:hidden">
      <InstitutionalMobileFilterSheet onClear={onClearAllFilters}>
        <InstitutionalFilterSearchField
          className="space-y-3"
          id="copytrade-trader-sheet"
          label="Trader"
          value={traderQuery}
          onChange={onTraderQueryChange}
          placeholder="Handle or trader ID…"
          comfortable
        />
        <div className="space-y-3">
          <label htmlFor="copytrade-grade-sheet" className={institutionalFieldLabelClass}>
            Grade
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-grade-sheet"
            value={grade}
            onValueChange={onGradeChange}
            placeholder="Grade"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={COPYTRADE_GRADE_FILTER_OPTIONS}
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="copytrade-confidence-sheet" className={institutionalFieldLabelClass}>
            Confidence
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-confidence-sheet"
            value={confidence}
            onValueChange={onConfidenceChange}
            placeholder="Confidence"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={COPYTRADE_CONFIDENCE_FILTER_OPTIONS}
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="copytrade-signal-sheet" className={institutionalFieldLabelClass}>
            Signal
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-signal-sheet"
            value={signal}
            onValueChange={onSignalChange}
            placeholder="Signal"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={COPYTRADE_SIGNAL_FILTER_OPTIONS}
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="copytrade-capacity-sheet" className={institutionalFieldLabelClass}>
            Capacity
          </label>
          <CopyTradeFilterFieldSelect
            id="copytrade-capacity-sheet"
            value={capacity}
            onValueChange={onCapacityChange}
            placeholder="Capacity"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={COPYTRADE_CAPACITY_FILTER_OPTIONS}
          />
        </div>
      </InstitutionalMobileFilterSheet>
      <ArbitrageRefreshButton isFetching={isFetching} onRefresh={onRefresh} />
    </div>
  );
}
