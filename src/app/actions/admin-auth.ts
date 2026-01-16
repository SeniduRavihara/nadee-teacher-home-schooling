'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserPassword(userId: string, newPassword: string) {
  const supabase = await createClient();

  // 1. Authenticate the caller
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // 2. Authorization: Check if caller is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden: Admin access required' };
  }

  // 3. Perform the update using Service Role
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    console.error('Error updating password:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/students');
  return { success: true };
}
