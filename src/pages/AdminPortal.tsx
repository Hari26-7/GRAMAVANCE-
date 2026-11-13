import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { Card, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

const PENDING_VERIFICATIONS = [
  {
    id: 'org_01',
    name: 'Kaveri Women Farmers & Artisans SHG',
    type: 'Self-Help Group (SHG)',
    district: 'Thanjavur, Tamil Nadu',
    members: 14,
    bankStatus: 'Submitted (IOB Passbook)',
    date: '2026-03-28',
    details: '14 Women members engaged in organic turmeric powder grinding and handloom weaving. Bank statement reflects ₹1.84 Lakh operational surplus.',
  },
  {
    id: 'org_02',
    name: 'Cauvery Delta Organic Millets Federation',
    type: 'Farmer Producer Co. (FPO)',
    district: 'Kumbakonam, Tamil Nadu',
    members: 320,
    bankStatus: 'Under DIC Verification',
    date: '2026-03-25',
    details: '320 Small and marginal farmers registered under FPO Companies Act. Applying for common de-stoner machinery grant under PMFME.',
  },
];

const AUDIT_TRAIL = [
  {
    action: 'Funding Rule Modified',
    target: 'PMFME Capital Subsidy Cap',
    actor: 'admin@drda.tn.gov.in',
    timestamp: '2026-03-29 14:22:10',
    status: 'Success',
  },
  {
    action: 'Scheme Gazette Link Verified',
    target: 'PMEGP 2026 KVIC Circular',
    actor: 'admin@drda.tn.gov.in',
    timestamp: '2026-03-28 11:05:44',
    status: 'Success',
  },
  {
    action: 'Organization KYC Approved',
    target: 'Narmada Organic Millets Co.',
    actor: 'admin@drda.tn.gov.in',
    timestamp: '2026-03-27 16:40:12',
    status: 'Success',
  },
];

export const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'audit'>('verification');
  const [verifications, setVerifications] = useState(PENDING_VERIFICATIONS);
  const [selectedOrg, setSelectedOrg] = useState<typeof PENDING_VERIFICATIONS[0] | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const approveOrg = (id: string, name: string) => {
    setVerifications(verifications.filter((v) => v.id !== id));
    setSelectedOrg(null);
    setStatusMsg(`Organization "${name}" successfully verified and official KYC badge issued.`);
    setTimeout(() => setStatusMsg(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Administrator & Compliance Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supervisory access: Organization verification, scheme gazette records, and audit logs.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab('verification')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            KYC Verification ({verifications.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Audit Trail ({AUDIT_TRAIL.length})
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      <div className="p-4 rounded-xl bg-[#F0F2F5] dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 text-xs sm:text-sm text-[#202B3C] dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#43836F] shrink-0 mt-0.5" />
        <div>
          <strong>Demonstration Administrator Mode:</strong> This console demonstrates how District Rural Development Agency (DRDA) and Lead District Managers approve rural SHG profiles and maintain tamper-evident audit trails.
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#43836F] shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Verification Queue */}
      {activeTab === 'verification' && (
        <Card className="p-6 space-y-4 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl">
          <CardTitle className="text-base text-[#202B3C] dark:text-slate-100">
            Pending Rural Organization Verifications
          </CardTitle>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {verifications.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-400">All pending organizations have been verified.</p>
            ) : (
              verifications.map((v) => (
                <div key={v.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{v.name}</h4>
                      <Badge variant="teal" size="sm">
                        {v.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {v.district} • {v.members} Member Group • Submitted {v.date}
                    </p>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">
                      Bank Proof: {v.bankStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setSelectedOrg(v)}
                      className="min-h-[44px] text-xs font-semibold"
                    >
                      Inspect Details
                    </Button>
                    <Button
                      variant="teal"
                      size="md"
                      onClick={() => approveOrg(v.id, v.name)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      className="min-h-[44px] bg-[#43836F] hover:bg-[#366959] text-white font-bold"
                    >
                      Approve & Verify
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Audit Trail */}
      {activeTab === 'audit' && (
        <Card className="p-6 space-y-4 border border-[#E3E7ED] dark:border-slate-800 rounded-2xl">
          <CardTitle className="text-base text-[#202B3C] dark:text-slate-100">
            Immutable Administrative Audit Log
          </CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E3E7ED] dark:border-slate-800 text-[#647184]">
                  <th className="p-3">Action</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Admin Identity</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {AUDIT_TRAIL.map((a, i) => (
                  <tr key={i}>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{a.action}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{a.target}</td>
                    <td className="p-3 font-mono text-slate-500 text-xs">{a.actor}</td>
                    <td className="p-3 text-slate-400">{a.timestamp}</td>
                    <td className="p-3">
                      <Badge variant="success" size="sm">
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Inspection Modal */}
      {selectedOrg && (
        <Modal
          isOpen={!!selectedOrg}
          onClose={() => setSelectedOrg(null)}
          title={`KYC Inspection: ${selectedOrg.name}`}
          description={`${selectedOrg.type} • ${selectedOrg.district}`}
          size="md"
          footer={
            <div className="w-full flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedOrg(null)}
                className="min-h-[44px]"
              >
                Close
              </Button>
              <Button
                variant="teal"
                size="md"
                onClick={() => approveOrg(selectedOrg.id, selectedOrg.name)}
                className="min-h-[44px] bg-[#43836F] hover:bg-[#366959] text-white font-bold"
              >
                Approve Organization
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-left">
            <div className="p-4 bg-[#F0F2F5] dark:bg-slate-800 rounded-xl space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Group Summary:</strong> {selectedOrg.details}
              </p>
              <p>
                <strong>Member Count:</strong> {selectedOrg.members} registered beneficiaries
              </p>
              <p>
                <strong>Submitted Proof:</strong> {selectedOrg.bankStatus}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
