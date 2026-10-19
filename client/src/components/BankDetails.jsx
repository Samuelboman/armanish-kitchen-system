import { Landmark } from "lucide-react";
import CopyButton from "./ui/CopyButton";
import { BUSINESS } from "../config/business";
import { formatNaira } from "../lib/format";

// Bank transfer details, with a copy button for the account number.
export default function BankDetails({ amount }) {
  const { bank } = BUSINESS;
  return (
    <div className="rounded-2xl bg-yellow/35 p-4 sm:p-5">
      <p className="flex items-center gap-2 font-display font-bold">
        <Landmark className="size-5" aria-hidden="true" /> Pay by bank transfer
      </p>
      <dl className="mt-3 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <dt className="text-muted">Bank</dt>
          <dd className="font-semibold">{bank.name}</dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <dt className="text-muted">Account number</dt>
          <dd className="flex items-center gap-1 font-display text-lg font-bold tracking-wide">
            {bank.accountNumber}
            <CopyButton value={bank.accountNumber} label="account number" className="-mr-3" />
          </dd>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <dt className="text-muted">Account name</dt>
          <dd className="font-semibold">{bank.accountName}</dd>
        </div>
        {amount !== undefined && (
          <div className="flex flex-wrap items-center justify-between gap-x-4 border-t border-ink/15 pt-2">
            <dt className="text-muted">Amount</dt>
            <dd className="font-display text-lg font-bold">{formatNaira(amount)}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
