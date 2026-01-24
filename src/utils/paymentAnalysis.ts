export interface GradePaymentStats {
  grade: string;
  totalPayments: number;
  approvedPayments: number;
  pendingPayments: number;
  rejectedPayments: number;
  totalAmount: number;
  approvedAmount: number;
}

export const analyzePaymentsByGrade = (
  payments: Array<{
    grade: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
  }>
): GradePaymentStats[] => {
  const gradeStats = new Map<string, GradePaymentStats>();

  payments.forEach((payment) => {
    if (!gradeStats.has(payment.grade)) {
      gradeStats.set(payment.grade, {
        grade: payment.grade,
        totalPayments: 0,
        approvedPayments: 0,
        pendingPayments: 0,
        rejectedPayments: 0,
        totalAmount: 0,
        approvedAmount: 0,
      });
    }

    const stats = gradeStats.get(payment.grade)!;
    stats.totalPayments += 1;
    stats.totalAmount += payment.amount || 0;

    if (payment.status === 'approved') {
      stats.approvedPayments += 1;
      stats.approvedAmount += payment.amount || 0;
    } else if (payment.status === 'pending') {
      stats.pendingPayments += 1;
    } else if (payment.status === 'rejected') {
      stats.rejectedPayments += 1;
    }
  });

  return Array.from(gradeStats.values()).sort((a, b) => {
    const aNum = parseInt(a.grade);
    const bNum = parseInt(b.grade);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.grade.localeCompare(b.grade);
  });
};
