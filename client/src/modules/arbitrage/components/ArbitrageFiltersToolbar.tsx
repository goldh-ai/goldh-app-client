import { InstitutionalFilterSearchField } from "@/components/shared/InstitutionalFilterSearchField";
import { InstitutionalMobileFilterSheet } from "@/components/shared/InstitutionalMobileFilterSheet";
import {
  INSTITUTIONAL_FILTER_BAR,
  institutionalFieldLabelClass,
  institutionalFilterSelectTriggerClass,
  institutionalFilterSelectTriggerSheetClass,
} from "@/lib/institutionalDataChrome";
import {
  ARBITRAGE_CONFIDENCE_FILTER_OPTIONS,
  ARBITRAGE_GRADE_FILTER_OPTIONS,
  ARBITRAGE_SIGNAL_FILTER_OPTIONS,
} from "../lib/arbitrageFilterOptions";
import { cn } from "@/lib/utils";
import { ArbitrageFilterFieldSelect } from "./ArbitrageFilterFieldSelect";
import { ArbitrageRefreshButton } from "./ArbitrageRefreshButton";

export interface ArbitrageFiltersToolbarProps {
  pairQuery: string;
  onPairQueryChange: (value: string) => void;
  grade: string;
  onGradeChange: (value: string) => void;
  confidence: string;
  onConfidenceChange: (value: string) => void;
  signal: string;
  onSignalChange: (value: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
}

export interface ArbitrageMobileActionsProps {
  pairQuery: string;
  onPairQueryChange: (value: string) => void;
  grade: string;
  onGradeChange: (value: string) => void;
  confidence: string;
  onConfidenceChange: (value: string) => void;
  signal: string;
  onSignalChange: (value: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
  onClearAllFilters: () => void;
}

export function ArbitrageFiltersToolbar({
  pairQuery,
  onPairQueryChange,
  grade,
  onGradeChange,
  confidence,
  onConfidenceChange,
  signal,
  onSignalChange,
  isFetching,
  onRefresh,
}: ArbitrageFiltersToolbarProps) {
  return (
    <div className={cn(INSTITUTIONAL_FILTER_BAR, "hidden px-0 md:block")}>
      <div className="md:grid md:grid-cols-[minmax(11rem,1fr)_minmax(7.25rem,9.5rem)_minmax(7.25rem,9.5rem)_minmax(7.25rem,9.5rem)_auto] md:items-end md:gap-x-3 md:gap-y-2">
        <InstitutionalFilterSearchField
          id="arbitrage-pair-filter"
          label="Pair"
          value={pairQuery}
          onChange={onPairQueryChange}
          placeholder="Filter pair…"
        />
        <div className="min-w-0">
          <label htmlFor="arbitrage-grade-desktop" className={institutionalFieldLabelClass}>
            Grade
          </label>
          <ArbitrageFilterFieldSelect
            id="arbitrage-grade-desktop"
            value={grade}
            onValueChange={onGradeChange}
            placeholder="Grade"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={ARBITRAGE_GRADE_FILTER_OPTIONS}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="arbitrage-confidence-desktop" className={institutionalFieldLabelClass}>
            Confidence
          </label>
          <ArbitrageFilterFieldSelect
            id="arbitrage-confidence-desktop"
            value={confidence}
            onValueChange={onConfidenceChange}
            placeholder="Confidence"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={ARBITRAGE_CONFIDENCE_FILTER_OPTIONS}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="arbitrage-signal-desktop" className={institutionalFieldLabelClass}>
            Signal
          </label>
          <ArbitrageFilterFieldSelect
            id="arbitrage-signal-desktop"
            value={signal}
            onValueChange={onSignalChange}
            placeholder="Signal"
            triggerClassName={institutionalFilterSelectTriggerClass}
            options={ARBITRAGE_SIGNAL_FILTER_OPTIONS}
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

export function ArbitrageMobileActions({
  pairQuery,
  onPairQueryChange,
  grade,
  onGradeChange,
  confidence,
  onConfidenceChange,
  signal,
  onSignalChange,
  isFetching,
  onRefresh,
  onClearAllFilters,
}: ArbitrageMobileActionsProps) {
  return (
    <div className="flex items-center gap-2 md:hidden">
      <InstitutionalMobileFilterSheet onClear={onClearAllFilters}>
        <InstitutionalFilterSearchField
          className="space-y-3"
          id="arbitrage-pair-sheet"
          label="Pair"
          value={pairQuery}
          onChange={onPairQueryChange}
          placeholder="Filter pair…"
          comfortable
        />
        <div className="space-y-3">
          <label htmlFor="arbitrage-grade-sheet" className={institutionalFieldLabelClass}>
            Grade
          </label>
          <ArbitrageFilterFieldSelect
            id="arbitrage-grade-sheet"
            value={grade}
            onValueChange={onGradeChange}
            placeholder="Grade"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={ARBITRAGE_GRADE_FILTER_OPTIONS}
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="arbitrage-confidence-sheet" className={institutionalFieldLabelClass}>
            Confidence
          </label>
          <ArbitrageFilterFieldSelect
            id="arbitrage-confidence-sheet"
            value={confidence}
            onValueChange={onConfidenceChange}
            placeholder="Confidence"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={ARBITRAGE_CONFIDENCE_FILTER_OPTIONS}
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="arbitrage-signal-sheet" className={institutionalFieldLabelClass}>
            Signal
          </label>
          <ArbitrageFilterFieldSelect
            id="arbitrage-signal-sheet"
            value={signal}
            onValueChange={onSignalChange}
            placeholder="Signal"
            triggerClassName={institutionalFilterSelectTriggerSheetClass}
            options={ARBITRAGE_SIGNAL_FILTER_OPTIONS}
          />
        </div>
      </InstitutionalMobileFilterSheet>
      <ArbitrageRefreshButton isFetching={isFetching} onRefresh={onRefresh} />
    </div>
  );
}
