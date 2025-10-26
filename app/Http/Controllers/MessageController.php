<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Ticket;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, Ticket $ticket)
    {
        // Authorization: customers can only message on their own tickets
        if (auth()->user()->role === 'customer' && $ticket->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = $ticket->messages()->create([
            'user_id' => auth()->id(),
            'message' => $validated['message'],
        ]);

        // Load user relationship for broadcasting
        $message->load('user');

        // Broadcast the message
        broadcast(new MessageSent($message))->toOthers();

        return back()->with('success', 'Message sent!');
    }
}
