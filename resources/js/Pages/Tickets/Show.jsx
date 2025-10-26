import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Show({ ticket, comments, messages: initialMessages }) {
    const { auth } = usePage().props;
    const [messages, setMessages] = useState(initialMessages || []);
    const [activeTab, setActiveTab] = useState('details');
    const messagesEndRef = useRef(null);

    // Comment form
    const commentForm = useForm({
        content: '',
    });

    // Message form
    const messageForm = useForm({
        message: '',
    });

    // Initialize Echo for real-time messages
    useEffect(() => {
        console.log('Setting up Echo connection for ticket:', ticket.id);
        console.log('Echo instance:', window.Echo);

        // Use the global Echo instance from bootstrap.js
        const channel = window.Echo.private(`ticket.${ticket.id}`)
            .listen('.message.sent', (data) => {
                console.log('✅ Real-time message received:', data);
                // The broadcast data is directly in 'data', not 'data.message'
                setMessages((prev) => [...prev, data]);
                scrollToBottom();
            });

        // Log connection status
        window.Echo.connector.pusher.connection.bind('connected', () => {
            console.log('✅ Pusher connected!');
        });

        window.Echo.connector.pusher.connection.bind('error', (err) => {
            console.error('❌ Pusher connection error:', err);
        });

        return () => {
            console.log('Leaving channel:', `ticket.${ticket.id}`);
            window.Echo.leave(`ticket.${ticket.id}`);
        };
    }, [ticket.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const submitComment = (e) => {
        e.preventDefault();
        commentForm.post(route('tickets.comments.store', ticket.id), {
            preserveScroll: true,
            onSuccess: () => {
                commentForm.reset();
            },
        });
    };

    const submitMessage = (e) => {
        e.preventDefault();
        if (!messageForm.data.message.trim()) return;

        messageForm.post(route('tickets.messages.store', ticket.id), {
            preserveScroll: true,
            onSuccess: () => {
                messageForm.reset();
            },
        });
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-blue-100 text-blue-800',
            high: 'bg-orange-100 text-orange-800',
            urgent: 'bg-red-100 text-red-800',
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        const colors = {
            open: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Ticket #{ticket.id}: {ticket.subject}
                    </h2>
                    <a
                        href={route('tickets.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Tickets
                    </a>
                </div>
            }
        >
            <Head title={`Ticket #${ticket.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Ticket Details */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Created by {ticket.user.name} on {new Date(ticket.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                                    </div>

                                    {ticket.attachment && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm font-medium text-gray-700 mb-2">Attachment:</p>
                                            <a
                                                href={`/storage/${ticket.attachment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                </svg>
                                                View Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="border-b border-gray-200">
                                    <nav className="flex -mb-px">
                                        <button
                                            onClick={() => setActiveTab('comments')}
                                            className={`py-4 px-6 text-sm font-medium ${
                                                activeTab === 'comments'
                                                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Comments ({comments.length})
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('chat')}
                                            className={`py-4 px-6 text-sm font-medium ${
                                                activeTab === 'chat'
                                                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            Live Chat ({messages.length})
                                        </button>
                                    </nav>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'comments' ? (
                                        <div>
                                            {/* Comments List */}
                                            <div className="space-y-4 mb-6">
                                                {comments.length === 0 ? (
                                                    <p className="text-center text-gray-500 py-8">No comments yet.</p>
                                                ) : (
                                                    comments.map((comment) => (
                                                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-semibold text-gray-900">
                                                                        {comment.user.name}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                                        comment.user.role === 'admin'
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-green-100 text-green-800'
                                                                    }`}>
                                                                        {comment.user.role}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm text-gray-500">
                                                                    {new Date(comment.created_at).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            {/* Add Comment Form */}
                                            <form onSubmit={submitComment}>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Add Comment
                                                </label>
                                                <textarea
                                                    value={commentForm.data.content}
                                                    onChange={(e) => commentForm.setData('content', e.target.value)}
                                                    rows="4"
                                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder="Write your comment..."
                                                    required
                                                />
                                                {commentForm.errors.content && (
                                                    <div className="mt-1 text-sm text-red-600">{commentForm.errors.content}</div>
                                                )}
                                                <div className="mt-3 flex justify-end">
                                                    <button
                                                        type="submit"
                                                        disabled={commentForm.processing}
                                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 disabled:opacity-25"
                                                    >
                                                        {commentForm.processing ? 'Posting...' : 'Post Comment'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Chat Messages */}
                                            <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                                                {messages.length === 0 ? (
                                                    <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {messages.map((msg) => (
                                                            <div
                                                                key={msg.id}
                                                                className={`flex ${msg.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                <div
                                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                                        msg.user_id === auth.user.id
                                                                            ? 'bg-indigo-600 text-white'
                                                                            : 'bg-white text-gray-900'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-xs font-semibold">
                                                                            {msg.user.name}
                                                                        </span>
                                                                        <span className={`text-xs ${msg.user_id === auth.user.id ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                                            {new Date(msg.created_at).toLocaleTimeString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm">{msg.message}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Send Message Form */}
                                            <form onSubmit={submitMessage} className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={messageForm.data.message}
                                                    onChange={(e) => messageForm.setData('message', e.target.value)}
                                                    className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder="Type your message..."
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={messageForm.processing}
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-25"
                                                >
                                                    Send
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Category</p>
                                            <p className="text-sm text-gray-900">{ticket.category.name}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Created By</p>
                                            <p className="text-sm text-gray-900">{ticket.user.name}</p>
                                            <p className="text-xs text-gray-500">{ticket.user.email}</p>
                                        </div>

                                        {ticket.assigned_admin && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                                                <p className="text-sm text-gray-900">{ticket.assigned_admin.name}</p>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Priority</p>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                            <p className="text-sm text-gray-900">{new Date(ticket.updated_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {auth.user.role === 'admin' && (
                                        <div className="mt-6 pt-6 border-t">
                                            <a
                                                href={route('tickets.edit', ticket.id)}
                                                className="w-full inline-flex justify-center items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                                            >
                                                Edit Ticket
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
