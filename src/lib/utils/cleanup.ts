
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Remove reservas expiradas do banco de dados para uma rifa específica.
 * Isso dispara eventos de Realtime que atualizam o grid para todos os usuários.
 */
export async function cleanupExpiredReservations(raffleId: string) {
    const supabase = await createAdminClient();
    const now = new Date().toISOString();

    // 1. Buscar todas as reservas não pagas que já passaram do tempo
    const { data: expired } = await supabase
        .from('reserved_numbers')
        .select('id, purchase_id')
        .eq('raffle_id', raffleId)
        .neq('status', 'paid')
        .lte('expires_at', now);

    if (expired && expired.length > 0) {
        const ids = expired.map((rn: any) => rn.id);
        const purchaseIds = Array.from(new Set(expired.map((rn: any) => rn.purchase_id).filter(Boolean)));

        // 2. Deletar reservas do banco
        await supabase
            .from('reserved_numbers')
            .delete()
            .in('id', ids);

        // 3. Marcar as compras como canceladas no banco (isso dispara Realtime na tabela purchases)
        if (purchaseIds.length > 0) {
            await supabase
                .from('purchases')
                .update({ status: 'cancelled' })
                .in('id', purchaseIds)
                .eq('status', 'pending'); // Só cancela se ainda estiver pendente
        }

        console.log(`[Cleanup] ${ids.length} reservas removidas e ${purchaseIds.length} compras canceladas para a rifa ${raffleId}`);
    }
}
