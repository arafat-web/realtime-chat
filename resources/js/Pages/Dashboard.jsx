import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Statistics Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Tickets */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Total Tickets</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.total}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Open Tickets */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Open</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.open}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-yellow-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">In Progress</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.in_progress}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resolved */}
                        <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">Resolved</dt>
                                            <dd className="text-3xl font-semibold text-gray-900">{stats.resolved}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                        <div className="p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Link
                                    href={route('tickets.create')}
                                    className="flex items-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition hover:border-indigo-500 hover:bg-gray-50"
                                >
                                    <div className="flex-shrink-0 rounded-full bg-indigo-100 p-2">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Create New Ticket</p>
                                        <p className="text-xs text-gray-500">Submit a support request</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('tickets.index')}
                                    className="flex items-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition hover:border-blue-500 hover:bg-gray-50"
                                >
                                    <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">View All Tickets</p>
                                        <p className="text-xs text-gray-500">Browse your tickets</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('tickets.index', { status: 'open' })}
                                    className="flex items-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition hover:border-yellow-500 hover:bg-gray-50"
                                >
                                    <div className="flex-shrink-0 rounded-full bg-yellow-100 p-2">
                                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Open Tickets</p>
                                        <p className="text-xs text-gray-500">View pending tickets</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
