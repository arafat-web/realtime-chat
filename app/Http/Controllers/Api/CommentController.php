<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Ticket;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Get all comments for a ticket
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

        $comments = $ticket->comments()->with('user')->latest()->get();

        return response()->json($comments);
    }

    /**
     * Add a comment to a ticket
     */
    public function store(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check authorization
        if ($user->isCustomer() && $ticket->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to comment on this ticket',
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $ticket->comments()->create([
            'user_id' => $user->id,
            'content' => $validated['content'],
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment,
        ], 201);
    }

    /**
     * Update a comment
     */
    public function update(Request $request, Comment $comment)
    {
        $user = $request->user();

        // Only the comment owner can update it
        if ($comment->user_id !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized to update this comment',
            ], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $comment->update($validated);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment,
        ]);
    }

    /**
     * Delete a comment
     */
    public function destroy(Request $request, Comment $comment)
    {
        $user = $request->user();

        // Only the comment owner or admin can delete
        if ($comment->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized to delete this comment',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }
}
