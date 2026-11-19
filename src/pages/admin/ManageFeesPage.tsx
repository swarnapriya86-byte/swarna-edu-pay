import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  Edit, 
  Clock, 
  Save 
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { Modal } from '../../components/common/Modal';
import { dataStore } from '../../services/dataStore';
import { StudentFee, FeeCategory } from '../../types';
import { useToast } from '../../context/ToastContext';

export const ManageFeesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success, error } = useToast();

  const [categories, setCategories] = useState<FeeCategory[]>(dataStore.getFeeCategories());
  const [fees, setFees] = useState<StudentFee[]>(dataStore.getFees());
  const students = dataStore.getStudents();

  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignStudentId, setAssignStudentId] = useState(students[0]?.id || '');
  const [assignCatId, setAssignCatId] = useState(categories[0]?.id || '');
  const [assignAmount, setAssignAmount] = useState(5000);
  const [assignDueDate, setAssignDueDate] = useState('2024-12-30');

  // Edit fee amount modal
  const [editingFee, setEditingFee] = useState<StudentFee | null>(null);
  const [editAmount, setEditAmount] = useState(0);
  const [editDueDate, setEditDueDate] = useState('');

  const refreshData = () => {
    setCategories(dataStore.getFeeCategories());
    setFees(dataStore.getFees());
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    dataStore.addFeeCategory(newCatName, newCatDesc);
    success(`Fee category "${newCatName}" created.`);
    setIsCategoryModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    refreshData();
  };

  const handleAssignFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignStudentId || !assignCatId || assignAmount <= 0) {
      error('Please fill all fields with valid amounts.');
      return;
    }
    dataStore.assignFeeToStudent(assignStudentId, assignCatId, Number(assignAmount), assignDueDate);
    success('Fee assigned to student successfully.');
    setIsAssignModalOpen(false);
    refreshData();
  };

  const handleOpenEdit = (fee: StudentFee) => {
    setEditingFee(fee);
    setEditAmount(fee.total_amount);
    setEditDueDate(fee.due_date);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;
    dataStore.updateFeeAmount(editingFee.id, Number(editAmount), editDueDate);
    success('Fee amount and due date updated.');
    setEditingFee(null);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Institutional Fee Management"
          subtitle="Configure fee categories, assign semester dues, and update payment deadlines"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Academic Fee Categories ({categories.length})
              </h3>
              <p className="text-xs text-slate-500">Standard fee categories applied across courses</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>

              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Assign Fee to Student</span>
              </button>
            </div>
          </div>

          {/* Categories Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Institutional
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cat.description || 'Core academic fee component'}
                </p>
              </div>
            ))}
          </div>

          {/* Assigned Fees Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Student Fee Ledgers & Deadlines ({fees.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Student ID</th>
                    <th className="py-3 px-3">Fee Category</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Paid Amount</th>
                    <th className="py-3 px-3">Pending Balance</th>
                    <th className="py-3 px-3">Payment Due Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {fees.map(f => {
                    const studentItem = students.find(s => s.id === f.student_id);
                    const pending = Math.max(0, f.total_amount - (f.paid_amount || 0));

                    return (
                      <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                          {studentItem?.profile?.full_name || 'Student'}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-blue-600 dark:text-blue-400">
                          {studentItem?.student_id || 'STU-000'}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                          {f.category?.name || 'Fee Category'}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          ₹{Number(f.total_amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-600">
                          ₹{Number(f.paid_amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-600">
                          ₹{pending.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                          {new Date(f.due_date).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Fee Amount or Due Date"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Fee Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add New Fee Category"
      >
        <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Transportation / Hostel Fee"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={newCatDesc}
              onChange={e => setNewCatDesc(e.target.value)}
              placeholder="Provide details about what this fee covers..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            Create Category
          </button>
        </form>
      </Modal>

      {/* Assign Fee to Student Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Fee to Student"
      >
        <form onSubmit={handleAssignFee} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
              Select Student *
            </label>
            <select
              value={assignStudentId}
              onChange={e => setAssignStudentId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.profile?.full_name} ({s.student_id}) - {s.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
              Fee Category *
            </label>
            <select
              value={assignCatId}
              onChange={e => setAssignCatId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
              Total Amount (INR) *
            </label>
            <input
              type="number"
              required
              min={100}
              value={assignAmount}
              onChange={e => setAssignAmount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
              Due Date *
            </label>
            <input
              type="date"
              required
              value={assignDueDate}
              onChange={e => setAssignDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            Assign Fee Ledger
          </button>
        </form>
      </Modal>

      {/* Edit Fee Amount Modal */}
      {editingFee && (
        <Modal
          isOpen={!!editingFee}
          onClose={() => setEditingFee(null)}
          title="Update Fee Amount & Due Date"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Total Amount (INR)
              </label>
              <input
                type="number"
                required
                min={editingFee.paid_amount || 0}
                value={editAmount}
                onChange={e => setEditAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Cannot be lower than already paid amount (₹{editingFee.paid_amount || 0})
              </span>
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={editDueDate}
                onChange={e => setEditDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
            >
              Save Fee Updates
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
