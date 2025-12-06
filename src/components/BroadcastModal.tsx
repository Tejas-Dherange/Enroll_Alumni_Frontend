import { useState } from 'react';
import Modal from './Modal';

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (title: string, content: string, sendEmail: boolean, sendSMS: boolean) => Promise<void>;
    title: string;
}

export default function BroadcastModal({ isOpen, onClose, onSend, title }: BroadcastModalProps) {
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [content, setContent] = useState('');
    const [sendEmail, setSendEmail] = useState(false);
    const [sendSMS, setSendSMS] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSend = async () => {
        if (!announcementTitle.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSend(announcementTitle, content, sendEmail, sendSMS);
            // Reset form
            setAnnouncementTitle('');
            setContent('');
            setSendEmail(false);
            setSendSMS(false);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAnnouncementTitle('');
        setContent('');
        setSendEmail(false);
        setSendSMS(false);
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={title}>
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Announcement title"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label">Content</label>
                    <textarea
                        className="input min-h-[120px]"
                        placeholder="Announcement content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Send email notification</span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendSMS}
                            onChange={(e) => setSendSMS(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Send SMS notification</span>
                    </label>

                    <p className="text-xs text-gray-500 mt-2">
                        Note: Email and SMS notifications require external service integration
                    </p>
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="btn btn-primary flex-1"
                    >
                        {loading ? 'Sending...' : 'Send Announcement'}
                    </button>
                    <button onClick={handleClose} className="btn btn-secondary flex-1">
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}
