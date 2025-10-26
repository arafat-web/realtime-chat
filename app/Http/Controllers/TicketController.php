<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Ticket::with(['category', 'user', 'assignedAdmin'])
            ->orderBy('created_at', 'desc');

        // Customer can only see their own tickets
        if ($user->role === 'customer') {
            $query->where('user_id', $user->id);
        }

        // Apply filters
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority !== '') {
            $query->where('priority', $request->priority);
        }

        if ($request->has('category') && $request->category !== '') {
            $query->where('category_id', $request->category);
        }

        $tickets = $query->paginate(10)->withQueryString();

        $categories = Category::all();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'categories' => $categories,
            'filters' => $request->only(['status', 'priority', 'category']),
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        // Get all users if admin is creating ticket
        $users = null;
        if (auth()->user()->role === 'admin') {
            $users = User::select('id', 'name', 'email', 'role')
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('Tickets/Create', [
            'categories' => $categories,
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        // Different validation rules for admin vs customer
        $rules = [
            'category_id' => 'required|exists:categories,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
        ];

        // Only admins need to specify user_id
        if ($request->user()->role === 'admin') {
            $rules['user_id'] = 'required|exists:users,id';
        }

        $validated = $request->validate($rules);

        // Set user_id based on role
        if ($request->user()->role === 'customer') {
            $validated['user_id'] = $request->user()->id;
        }
        // Admin's user_id is already in $validated from the form

        $validated['status'] = 'open';

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $validated['attachment'] = $request->file('attachment')->store('attachments', 'public');
        }

        $ticket = Ticket::create($validated);

        return redirect()->route('tickets.show', $ticket->id)
            ->with('success', 'Ticket created successfully!');
    }

    public function show(Ticket $ticket)
    {
        // Authorization: customers can only view their own tickets
        // Use loose comparison (!=) instead of strict (!==) to handle type differences
        if (auth()->user()->role === 'customer' && $ticket->user_id != auth()->id()) {
            \Log::info('403 Debug', [
                'ticket_user_id' => $ticket->user_id,
                'ticket_user_id_type' => gettype($ticket->user_id),
                'auth_id' => auth()->id(),
                'auth_id_type' => gettype(auth()->id()),
                'comparison_strict' => $ticket->user_id !== auth()->id(),
                'comparison_loose' => $ticket->user_id != auth()->id(),
            ]);
            abort(403, 'Unauthorized access. Ticket belongs to user ' . $ticket->user_id . ' but you are user ' . auth()->id());
        }

        $ticket->load(['category', 'user', 'assignedAdmin']);

        $comments = $ticket->comments()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        $messages = $ticket->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'comments' => $comments,
            'messages' => $messages,
        ]);
    }

    public function edit(Ticket $ticket)
    {
        // Only admins can edit tickets
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can edit tickets');
        }

        $ticket->load(['category', 'user', 'assignedAdmin']);

        $categories = Category::all();
        $admins = User::where('role', 'admin')->get();

        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket,
            'categories' => $categories,
            'admins' => $admins,
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        // Only admins can update tickets
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can update tickets');
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:open,in_progress,resolved,closed',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $ticket->update($validated);

        return redirect()->route('tickets.show', $ticket->id)
            ->with('success', 'Ticket updated successfully!');
    }

    public function destroy(Ticket $ticket)
    {
        // Only admins can delete tickets
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Only administrators can delete tickets');
        }

        // Delete attachment if exists
        if ($ticket->attachment) {
            \Storage::disk('public')->delete($ticket->attachment);
        }

        $ticket->delete();

        return redirect()->route('tickets.index')
            ->with('success', 'Ticket deleted successfully!');
    }
}
