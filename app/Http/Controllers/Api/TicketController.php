<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Ticket::with(['user', 'category', 'assignedAdmin', 'comments.user']);

        // Customers only see their own tickets
        if ($user->isCustomer()) {
            $query->where('user_id', $user->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $tickets = $query->latest()->paginate(15);

        return response()->json($tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        $validated['user_id'] = $request->user()->id;

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('tickets', 'public');
            $validated['attachment'] = $path;
        }

        $ticket = Ticket::create($validated);
        $ticket->load(['user', 'category']);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check authorization
        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized access to this ticket',
            ], 403);
        }

        $ticket->load(['user', 'category', 'assignedAdmin', 'comments.user', 'messages.user']);

        return response()->json($ticket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check authorization
        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to update this ticket',
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'subject' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
            'attachment' => 'nullable|file|max:10240',
        ]);

        // Only admins can change status and assignment
        if ($user->isCustomer()) {
            unset($validated['status'], $validated['assigned_to']);
        }

        // Handle file upload
        if ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($ticket->attachment) {
                Storage::disk('public')->delete($ticket->attachment);
            }
            $path = $request->file('attachment')->store('tickets', 'public');
            $validated['attachment'] = $path;
        }

        $ticket->update($validated);
        $ticket->load(['user', 'category', 'assignedAdmin']);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Only admins or ticket owner can delete
        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this ticket',
            ], 403);
        }

        // Delete attachment if exists
        if ($ticket->attachment) {
            Storage::disk('public')->delete($ticket->attachment);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ]);
    }
}
