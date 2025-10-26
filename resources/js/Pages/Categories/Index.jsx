import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Categories
                    </h2>
                    <a
                        href={route('categories.create')}
                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                    >
                        Create Category
                    </a>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {categories.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">No categories found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tickets
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {categories.map((category) => (
                                                <tr key={category.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        #{category.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {category.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {category.description || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {category.tickets_count || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(category.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <a
                                                            href={route('categories.edit', category.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Edit
                                                        </a>
                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
