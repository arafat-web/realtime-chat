<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;

class MessageController extends Controller
{
    /**
     * Get all messages for a ticket
     */
    public function index(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check authorization
        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized access to this ticket',
            ], 403);
        }

        $messages = $ticket->messages()->with('user')->oldest()->get();

        // Mark messages as read
        $ticket->messages()
            ->where('user_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    /**
     * Send a message in a ticket
     */
    public function store(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check authorization
        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to send messages in this ticket',
            ], 403);
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = $ticket->messages()->create([
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        $message->load('user');

        // Broadcast the message (for real-time updates)
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        return response()->json([
            'message' => 'Message sent successfully',
            'data' => $message,
        ], 201);
    }

    /**
     * Get unread message count for user
     */
    public function unreadCount(Request $request)
    {
        $user = $request->user();

        if ($user->isCustomer()) {
            $count = Message::whereHas('ticket', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->where('user_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();
        } else {
            $count = Message::whereHas('ticket', function ($query) use ($user) {
                $query->where('assigned_to', $user->id);
            })
            ->where('user_id', '!=', $user->id)
            ->where('is_read', false)
            ->count();
        }

        return response()->json(['unread_count' => $count]);
    }
}
