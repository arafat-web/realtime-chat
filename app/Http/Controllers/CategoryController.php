<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        // Only admins can manage categories
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can manage categories');
        }

        $categories = Category::withCount('tickets')
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can manage categories');
        }

        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can manage categories');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
        ]);

        Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully!');
    }

    public function edit(Category $category)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can manage categories');
        }

        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can manage categories');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully!');
    }

    public function destroy(Category $category)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can manage categories');
        }

        // Check if category has tickets
        if ($category->tickets()->count() > 0) {
            return back()->with('error', 'Cannot delete category with existing tickets!');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully!');
    }
}
