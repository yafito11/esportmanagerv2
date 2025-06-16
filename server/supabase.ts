
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
export class SupabaseStorage {
  async createUser(userData: { username: string; password: string }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByUsername(username: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createTeam(teamData: any) {
    const { data, error } = await supabase
      .from('teams')
      .insert([teamData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTeamsByUserId(userId: number) {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('userId', userId);
    
    if (error) throw error;
    return data;
  }

  async getAvailablePlayers(limit: number = 150) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('isAvailable', true)
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  async getTeamPlayers(teamId: number) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('teamId', teamId);
    
    if (error) throw error;
    return data;
  }

  async signPlayer(playerId: number, teamId: number, salary: number) {
    const { data, error } = await supabase
      .from('players')
      .update({
        teamId,
        salary: salary.toString(),
        isAvailable: false,
        contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      })
      .eq('id', playerId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAvailableStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('isAvailable', true);
    
    if (error) throw error;
    return data;
  }

  async getTeamStaff(teamId: number) {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('teamId', teamId);
    
    if (error) throw error;
    return data;
  }
}
