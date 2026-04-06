import { useState, useEffect } from 'react';
import { Bell, BellRing, Trash2, X, Plus, Infinity as InfinityIcon, AlertCircle } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert } from '../hooks/useAlerts';
import type { AlertEvaluationResult } from '@shared/types';
import type { CreatePulseAlertInput } from '@shared/types';

const FREE_TIER_MAX = 3;

type AlertType = 'price_threshold' | 'pct_change' | 'volume_spike' | 'intraday_break';
type AlertDirection = 'above' | 'below';

const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  price_threshold: 'Price Threshold',
  pct_change: '% Change',
  volume_spike: 'Volume Spike',
  intraday_break: 'Intraday Break',
};

const NEEDS_DIRECTION: AlertType[] = ['price_threshold', 'intraday_break'];
const NEEDS_THRESHOLD: AlertType[] = ['price_threshold', 'pct_change', 'volume_spike'];

function cn(...c: unknown[]) { return (c.filter(Boolean) as string[]).join(' '); }

interface AlertFormState {
  symbol: string;
  alertType: AlertType;
  threshold: string;
  direction: AlertDirection;
}

const DEFAULT_FORM: AlertFormState = {
  symbol: '',
  alertType: 'price_threshold',
  threshold: '',
  direction: 'above',
};

interface AlertsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: string;
  triggeredAlerts: AlertEvaluationResult[];
  initialSymbol?: string;
}

export function AlertsManager({ open, onOpenChange, tier, triggeredAlerts, initialSymbol }: AlertsManagerProps) {
  const { data: alerts = [], isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const updateAlert = useUpdateAlert();
  const deleteAlert = useDeleteAlert();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AlertFormState>(DEFAULT_FORM);
  const [createError, setCreateError] = useState<string | null>(null);

  // Sync initialSymbol when drawer opens
  useEffect(() => {
    if (open) {
      if (initialSymbol) {
        setForm({ ...DEFAULT_FORM, symbol: initialSymbol.toUpperCase() });
        setShowForm(true); // Auto-open the form if a symbol is passed
      } else {
        setForm(DEFAULT_FORM);
        setShowForm(false);
      }
      setCreateError(null);
    }
  }, [open, initialSymbol]);

  const isFree = tier === 'free';
  const atCap = isFree && alerts.length >= FREE_TIER_MAX;

  const triggeredIds = new Set(triggeredAlerts.map((t) => t.alertId));

  const handleToggleEnabled = (id: string, currentEnabled: boolean) => {
    updateAlert.mutate({ id, data: { enabled: !currentEnabled } });
  };

  const handleDelete = (id: string) => {
    deleteAlert.mutate(id);
  };

  const handleCreate = async () => {
    setCreateError(null);
    const input: CreatePulseAlertInput = {
      symbol: form.symbol.toUpperCase().trim(),
      alertType: form.alertType,
      enabled: true,
      ...(NEEDS_THRESHOLD.includes(form.alertType) && form.threshold
        ? { threshold: parseFloat(form.threshold) }
        : {}),
      ...(NEEDS_DIRECTION.includes(form.alertType)
        ? { direction: form.direction }
        : {}),
    };

    if (!input.symbol) {
      setCreateError('Symbol is required.');
      return;
    }
    if (NEEDS_THRESHOLD.includes(form.alertType) && (!form.threshold || isNaN(Number(form.threshold)))) {
      setCreateError('A valid threshold value is required.');
      return;
    }

    try {
      await createAlert.mutateAsync(input);
      setForm(DEFAULT_FORM);
      setShowForm(false);
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create alert.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-[#0a0a0a] border-l border-[#222] text-white w-full sm:max-w-md flex flex-col gap-0 p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <SheetTitle className="text-xs font-black text-white uppercase tracking-widest">
              Alert Command Center
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Manage your pulse alerts. Free tier: up to {FREE_TIER_MAX} alerts.
          </SheetDescription>

          {/* Tier info bar */}
          <div className="flex items-center justify-between p-3 bg-[#C7AE6A]/5 border border-[#C7AE6A]/20 rounded-lg mt-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
              <span className="text-[10px] text-[#C7AE6A] font-bold uppercase tracking-widest">
                {isFree ? `Free Plan — ${FREE_TIER_MAX} Alert Max` : 'Essentials Plan'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isFree ? (
                <span className="text-[10px] font-bold text-[#C7AE6A] uppercase tracking-widest">
                  {alerts.length}/{FREE_TIER_MAX} used
                </span>
              ) : (
                <InfinityIcon className="w-4 h-4 text-[#C7AE6A]" aria-hidden="true" />
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Alert list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {isLoading && (
            <>
              <Skeleton className="h-14 w-full bg-[#1a1a1a]" />
              <Skeleton className="h-14 w-full bg-[#1a1a1a]" />
            </>
          )}

          {!isLoading && alerts.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-8 h-8 text-[#3a3a3a] mx-auto mb-3" aria-hidden="true" />
              <p className="text-[10px] text-[#4a4a4a] font-bold uppercase tracking-widest">
                No alerts configured
              </p>
              <p className="text-xs text-[#3a3a3a] mt-1">
                Create an alert to get notified when conditions are met.
              </p>
            </div>
          )}

          {!isLoading && alerts.map((alert) => {
            const isTriggered = triggeredIds.has(alert.id);
            const needsDir = NEEDS_DIRECTION.includes(alert.alertType as AlertType);
            const needsThr = NEEDS_THRESHOLD.includes(alert.alertType as AlertType);

            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border group transition-all',
                  isTriggered
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#050505] border-[#1a1a1a] hover:border-amber-500/20'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isTriggered && (
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" aria-label="triggered" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{alert.symbol}</span>
                      <span className="text-[9px] text-[#4a4a4a] font-bold uppercase bg-[#1a1a1a] px-1.5 py-0.5 rounded">
                        {ALERT_TYPE_LABELS[alert.alertType as AlertType] ?? alert.alertType}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6b6b6b] mt-0.5">
                      {needsThr && alert.threshold != null && (
                        <>Threshold: {alert.threshold}</>
                      )}
                      {needsDir && alert.direction && (
                        <> · {alert.direction}</>
                      )}
                      {isTriggered && (
                        <span className="text-amber-400 font-bold"> · Triggered</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleEnabled(alert.id, alert.enabled ?? true)}
                    className={cn(
                      'w-8 h-4 rounded-full transition-all relative shrink-0',
                      alert.enabled ? 'bg-emerald-500' : 'bg-[#4a4a4a]'
                    )}
                    aria-label={alert.enabled ? 'Disable alert' : 'Enable alert'}
                    disabled={updateAlert.isPending}
                  >
                    <div className={cn(
                      'w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all',
                      alert.enabled ? 'right-0.5' : 'left-0.5'
                    )} />
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="text-[#4a4a4a] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label={`Delete alert for ${alert.symbol}`}
                    disabled={deleteAlert.isPending}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create alert section */}
        <div className="px-6 pb-6 pt-4 border-t border-[#222] space-y-3">
          {createError && (
            <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
              <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
              {createError}
            </div>
          )}

          {showForm ? (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-black text-[#6b6b6b] uppercase tracking-widest block mb-1">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={form.symbol}
                    onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                    placeholder="BTC"
                    className="bg-[#050505] border border-[#1a1a1a] rounded-lg text-xs text-white px-3 h-8 w-full font-mono font-bold placeholder:text-[#4a4a4a] outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-[#6b6b6b] uppercase tracking-widest block mb-1">
                    Type
                  </label>
                  <select
                    value={form.alertType}
                    onChange={(e) => setForm({ ...form, alertType: e.target.value as AlertType })}
                    className="bg-[#050505] border border-[#1a1a1a] rounded-lg text-xs text-white px-2 h-8 w-full font-bold outline-none focus:ring-1 focus:ring-amber-500/50"
                  >
                    {(Object.keys(ALERT_TYPE_LABELS) as AlertType[]).map((t) => (
                      <option key={t} value={t}>{ALERT_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {NEEDS_THRESHOLD.includes(form.alertType) && (
                  <div>
                    <label className="text-[9px] font-black text-[#6b6b6b] uppercase tracking-widest block mb-1">
                      Threshold
                    </label>
                    <input
                      type="number"
                      value={form.threshold}
                      onChange={(e) => setForm({ ...form, threshold: e.target.value })}
                      placeholder={form.alertType === 'price_threshold' ? '100000' : form.alertType === 'volume_spike' ? '1.8' : '3'}
                      min="0"
                      step="any"
                      className="bg-[#050505] border border-[#1a1a1a] rounded-lg text-xs text-white px-3 h-8 w-full font-mono font-bold placeholder:text-[#4a4a4a] outline-none focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                )}
                {NEEDS_DIRECTION.includes(form.alertType) && (
                  <div>
                    <label className="text-[9px] font-black text-[#6b6b6b] uppercase tracking-widest block mb-1">
                      Direction
                    </label>
                    <select
                      value={form.direction}
                      onChange={(e) => setForm({ ...form, direction: e.target.value as AlertDirection })}
                      className="bg-[#050505] border border-[#1a1a1a] rounded-lg text-xs text-white px-2 h-8 w-full font-bold outline-none focus:ring-1 focus:ring-amber-500/50"
                    >
                      <option value="above">Above</option>
                      <option value="below">Below</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={createAlert.isPending}
                  className="flex-1 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#C7AE6A] text-black hover:bg-[#C7AE6A]/90 disabled:opacity-50 transition-all font-bold"
                >
                  {createAlert.isPending ? 'Creating…' : 'Create Alert'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setForm(DEFAULT_FORM); setCreateError(null); }}
                  className="w-9 h-9 rounded-lg border border-[#1a1a1a] flex items-center justify-center text-[#4a4a4a] hover:text-white transition-colors"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setShowForm(true); setCreateError(null); }}
              disabled={atCap}
              title={atCap ? `Free tier allows only ${FREE_TIER_MAX} alerts. Upgrade to Essentials for unlimited.` : undefined}
              className={cn(
                'w-full h-9 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all font-bold',
                atCap
                  ? 'border-[#1a1a1a] text-[#3a3a3a] cursor-not-allowed'
                  : 'border-[#C7AE6A]/30 text-[#C7AE6A] hover:bg-[#C7AE6A]/10'
              )}
            >
              <Plus className="w-3 h-3" aria-hidden="true" />
              {atCap ? `Alert limit reached (${FREE_TIER_MAX}/${FREE_TIER_MAX})` : 'Create Alert'}
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default AlertsManager;
