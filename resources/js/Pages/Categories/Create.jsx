import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Category
                </h2>
            }
        >
            <Head title="Create Category" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="e.g., Technical Support"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-sm text-red-600">{errors.name}</div>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Describe this category..."
                                    />
                                    {errors.description && (
                                        <div className="mt-1 text-sm text-red-600">{errors.description}</div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center justify-between">
                                    <a
                                        href={route('categories.index')}
                                        className="text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 disabled:opacity-25"
                                    >
                                        {processing ? 'Creating...' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
