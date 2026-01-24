'use client';

import { GradePaymentStats, analyzePaymentsByGrade } from '@/utils/paymentAnalysis';
import { BarChart3, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface GradePaymentAnalysisProps {
  payments: Array<{
    grade: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
  }>;
}

export default function GradePaymentAnalysis({ payments }: GradePaymentAnalysisProps) {
  const gradeStats = analyzePaymentsByGrade(payments);

  if (gradeStats.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 size={20} className="text-orange-500" />
          Grade-wise Payment Analysis
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Grade</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Total Count</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                <span className="flex items-center justify-center gap-1">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Approved
                </span>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                <span className="flex items-center justify-center gap-1">
                  <Clock size={16} className="text-yellow-500" />
                  Pending
                </span>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                <span className="flex items-center justify-center gap-1">
                  <XCircle size={16} className="text-red-500" />
                  Rejected
                </span>
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amount Collected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {gradeStats.map((stat) => (
              <tr key={stat.grade} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 font-semibold rounded-lg text-sm">
                    Grade {stat.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-sm min-w-12">
                    {stat.totalPayments}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-full text-sm min-w-12">
                    {stat.approvedPayments}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 font-semibold rounded-full text-sm min-w-12">
                    {stat.pendingPayments}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-full text-sm min-w-12">
                    {stat.rejectedPayments}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-semibold text-gray-900">
                    LKR {stat.approvedAmount.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total</span>
            <p className="font-bold text-gray-900 text-lg">
              {gradeStats.reduce((sum, s) => sum + s.totalPayments, 0)}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Approved</span>
            <p className="font-bold text-green-600 text-lg">
              {gradeStats.reduce((sum, s) => sum + s.approvedPayments, 0)}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Pending</span>
            <p className="font-bold text-yellow-600 text-lg">
              {gradeStats.reduce((sum, s) => sum + s.pendingPayments, 0)}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Rejected</span>
            <p className="font-bold text-red-600 text-lg">
              {gradeStats.reduce((sum, s) => sum + s.rejectedPayments, 0)}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-600">Total Collected</span>
            <p className="font-bold text-gray-900 text-lg">
              LKR {gradeStats.reduce((sum, s) => sum + s.approvedAmount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
