import React, { useState, useEffect, useRef } from "react";
import { Search, User, ShieldAlert, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAccounts } from "../../data/mock/accounts";
import { mockTransactions } from "../../data/mock/transactions";
import { mockCases } from "../../data/mock/cases";
import { RiskBadge } from "./RiskBadge";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  // Handle open/close side effects, keyboard shortcuts, and focus management
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;
      // Short timeout to guarantee DOM node is mounted before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      };

      window.addEventListener("keydown", handleGlobalKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleGlobalKeyDown);
      };
    } else {
      setQuery("");
      // Restore focus to previously focused trigger element
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAccounts = mockAccounts.filter(
    (a) =>
      a.account_id.toLowerCase().includes(query.toLowerCase()) ||
      a.vpa.toLowerCase().includes(query.toLowerCase()) ||
      a.holder_name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTransactions = mockTransactions.filter(
    (t) =>
      t.transaction_id.toLowerCase().includes(query.toLowerCase()) ||
      t.utr.toLowerCase().includes(query.toLowerCase()) ||
      t.sender_vpa.toLowerCase().includes(query.toLowerCase()) ||
      t.receiver_vpa.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCases = mockCases.filter(
    (c) =>
      c.case_id.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.primary_vpa.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/60 backdrop-blur-xs animate-row-insert select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Global Search Modal"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#0072BC] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search accounts, VPAs, UTRs, transactions, or fraud cases..."
            className="flex-1 text-xs sm:text-sm bg-transparent border-none outline-hidden text-[#172B4D] placeholder-slate-400 font-medium"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono-code font-bold text-slate-400 bg-slate-200 rounded">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Close Search (Esc)"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* Empty search prompt */}
          {!query && (
            <div className="text-center py-8 text-xs text-slate-400 space-y-1 font-mono-code">
              <p>Type to query the live simulation graph & database</p>
              <p className="text-[11px] text-slate-400/80">
                Examples: ACC_8A91F2 · vijay.singh@sbi · TXN_748291 · CASE_UPI_2026_8492
              </p>
            </div>
          )}

          {/* Accounts Section */}
          {filteredAccounts.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] px-2 block">
                Accounts & VPAs ({filteredAccounts.length})
              </span>
              {filteredAccounts.map((a) => (
                <div
                  key={a.account_id}
                  onClick={() => handleSelect(`/accounts/${a.account_id}`)}
                  className="p-3 rounded-xl hover:bg-[#EAF5FC] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0072BC] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-[#172B4D] group-hover:text-[#0072BC]">
                          {a.holder_name}
                        </strong>
                        <span className="font-mono-code text-[11px] text-slate-500">({a.account_id})</span>
                      </div>
                      <span className="font-mono-code text-xs text-[#0072BC] block">{a.vpa}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <RiskBadge level={a.risk_level} score={a.risk_score} size="sm" />
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0072BC] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cases Section */}
          {filteredCases.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] px-2 block">
                Investigation Cases ({filteredCases.length})
              </span>
              {filteredCases.map((c) => (
                <div
                  key={c.case_id}
                  onClick={() => handleSelect(`/cases/${c.case_id}`)}
                  className="p-3 rounded-xl hover:bg-[#EAF5FC] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-[#172B4D] group-hover:text-[#0072BC]">
                          {c.title}
                        </strong>
                        <span className="font-mono-code text-[11px] text-slate-500">({c.case_id})</span>
                      </div>
                      <span className="text-xs text-[#526581] block">
                        Target: {c.primary_vpa} · Risk: {c.risk_score}
                      </span>
                    </div>
                  </div>
                  <RiskBadge level={c.risk_level} score={c.risk_score} size="sm" />
                </div>
              ))}
            </div>
          )}

          {/* Transactions Section */}
          {filteredTransactions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#7B8794] px-2 block">
                Transactions ({filteredTransactions.length})
              </span>
              {filteredTransactions.map((t) => (
                <div
                  key={t.transaction_id}
                  onClick={() => handleSelect(`/transactions`)}
                  className="p-3 rounded-xl hover:bg-[#EAF5FC] cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code font-bold text-xs text-[#0072BC]">
                        {t.transaction_id}
                      </span>
                      <span className="font-mono-code text-[11px] text-slate-400">· {t.utr}</span>
                    </div>
                    <span className="text-xs text-[#526581]">
                      {t.sender_vpa} → {t.receiver_vpa}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <strong className="font-mono-code font-bold text-xs text-[#172B4D] block">
                      ₹{t.amount.toLocaleString("en-IN")}
                    </strong>
                    <RiskBadge level={t.risk_level} score={t.risk_score} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results message */}
          {query &&
            filteredAccounts.length === 0 &&
            filteredCases.length === 0 &&
            filteredTransactions.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-500">
                No matching accounts, transactions, or cases found for &quot;
                <span className="font-mono-code font-bold text-[#172B4D]">{query}</span>&quot;.
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
