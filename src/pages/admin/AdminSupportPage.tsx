import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Phone, 
  Send, 
  Trash2, 
  User, 
  AlertCircle,
  X
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { dataStore } from '../../services/dataStore';
import { SupportRequest } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminSupportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success, error } = useToast();

  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Selected for Response Modal
  const [selectedReq, setSelectedReq] = useState<SupportRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<'PENDING' | 'IN_PROGRESS' | 'RESOLVED'>('IN_PROGRESS');

  const loadData = () => {
    setRequests(dataStore.getSupportRequests());
  };

  useEffect(() => {
    loadData();
  }, []);

  const openRespondModal = (req: SupportRequest) => {
    setSelectedReq(req);
    setReplyText(req.admin_reply || '');
    setStatusUpdate(req.status);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    dataStore.updateSupportRequest(selectedReq.id, {
      admin_reply: replyText.trim(),
      status: statusUpdate
    });

    success(`Inquiry from ${selectedReq.name} updated with status ${statusUpdate}.`);
    setSelectedReq(null);
    loadData();
  };

  const handleQuickResolve = (req: SupportRequest) => {
    dataStore.updateSupportRequest(req.id, {
      status: 'RESOLVED',
      admin_reply: req.admin_reply || 'Issue resolved by Accounts Administrator.'
    });
    success(`Inquiry marked as RESOLVED.`);
    loadData();
  };

  const handleDelete = (id: string) => {
    dataStore.deleteSupportRequest(id);
    success('Inquiry record deleted from ledger.');
    loadData();
  };

  const filtered = requests.filter(r => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.email.toLowerCase().includes(search.toLowerCase()) ||
                          r.subject.toLowerCase().includes(search.toLowerCase()) ||
                          r.message.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Student Support & Helpdesk Requests"
          subtitle="Review student inquiries, fee grievance tickets, and dispatch official email responses"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search inquiries by student, email, or subject..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">All Statuses ({requests.length})</option>
                <option value="PENDING">Pending ({requests.filter(r => r.status === 'PENDING').length})</option>
                <option value="IN_PROGRESS">In Progress ({requests.filter(r => r.status === 'IN_PROGRESS').length})</option>
                <option value="RESOLVED">Resolved ({requests.filter(r => r.status === 'RESOLVED').length})</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filtered.map(req => {
              const isResolved = req.status === 'RESOLVED';
              const isPending = req.status === 'PENDING';
              return (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {req.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{req.name}</span>
                          <span className="text-[11px] font-normal text-slate-400 font-mono">
                            {req.email}
                          </span>
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                          {req.subject}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    "{req.message}"
                  </p>

                  {req.admin_reply && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Official Administrator Response</span>
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 text-xs italic">
                        {req.admin_reply}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ticket #{req.id} {req.phone ? `• ${req.phone}` : ''}
                    </span>

                    <div className="flex items-center gap-2">
                      {!isResolved && (
                        <button
                          onClick={() => handleQuickResolve(req)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}

                      <button
                        onClick={() => openRespondModal(req)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{req.admin_reply ? 'Edit Response' : 'Respond'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8">
              <Headphones className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No support requests</h4>
              <p className="text-xs text-slate-400 mt-1">Student submissions from the Contact Support page will appear here.</p>
            </div>
          )}
        </main>
      </div>

      {/* Response Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Respond to Support Ticket
                </h3>
                <p className="text-xs text-slate-500">{selectedReq.name} ({selectedReq.email})</p>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Student Query: {selectedReq.subject}
              </span>
              <p className="text-slate-600 dark:text-slate-400 italic">
                "{selectedReq.message}"
              </p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Ticket Status
                </label>
                <select
                  value={statusUpdate}
                  onChange={e => setStatusUpdate(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                >
                  <option value="IN_PROGRESS">In Progress (Under Review)</option>
                  <option value="RESOLVED">Resolved (Action Completed)</option>
                  <option value="PENDING">Pending (Awaiting Student Documents)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Official Administrative Reply *
                </label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Provide clarification, bank transaction resolution, or instructions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
