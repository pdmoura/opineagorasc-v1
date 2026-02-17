import { supabase } from './supabase';

// Submit new comment with IP rate limiting
export const submitComment = async (commentData) => {
	try {
		const { data, error } = await supabase
			.from('comments')
			.insert([{
				...commentData,
				status: 'pending',
				ip_address: await getClientIP(),
			}])
			.select()
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error submitting comment:', error);
		throw error;
	}
};

// Get client IP (approximation for client-side)
const getClientIP = async () => {
	try {
		const response = await fetch('https://api.ipify.org?format=json');
		const data = await response.json();
		return data.ip;
	} catch {
		return 'unknown';
	}
};

// Fetch comments with optional filters
export const getComments = async (filters = {}) => {
	try {
		let query = supabase
			.from('comments')
			.select('*, posts(title)')
			.order('created_at', { ascending: false });

		if (filters.status) {
			query = query.eq('status', filters.status);
		}
		if (filters.post_id) {
			query = query.eq('post_id', filters.post_id);
		}

		const { data, error } = await query;
		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error('Error fetching comments:', error);
		throw error;
	}
};

// Get approved comments for admin
export const getApprovedComments = async () => {
	try {
		const { data, error } = await supabase
			.from('comments')
			.select('*, posts(title)')
			.eq('status', 'approved')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	} catch (error) {
		console.error('Error fetching approved comments:', error);
		throw error;
	}
};

// Approve a comment
export const approveComment = async (id) => {
	try {
		const { data, error } = await supabase
			.from('comments')
			.update({ status: 'approved' })
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error('Error approving comment:', error);
		throw error;
	}
};

// Delete a comment
export const deleteComment = async (id) => {
	try {
		const { error } = await supabase
			.from('comments')
			.delete()
			.eq('id', id);

		if (error) throw error;
		return true;
	} catch (error) {
		console.error('Error deleting comment:', error);
		throw error;
	}
};
