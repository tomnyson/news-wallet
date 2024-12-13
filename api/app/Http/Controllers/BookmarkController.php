<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bookmark;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
class BookmarkController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
            'post_id' => 'required|exists:posts,id',
            ]);

            // Check if the bookmark already exists
            $existingBookmark = Bookmark::where('user_id', Auth::id())
                                        ->where('post_id', $validated['post_id'])
                                        ->first();

            if ($existingBookmark) {
                return response()->json(['message' => 'Bookmark already exists', 'bookmark' => $existingBookmark], 200);
            }

            // Create a new bookmark
            $bookmark = Bookmark::create([
                'user_id' => Auth::id(),
                'post_id' => $validated['post_id'],
            ]);

            return response()->json(['message' => 'Bookmark added successfully', 'bookmark' => $bookmark], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add bookmark', 'message' => $e->getMessage()], 500);
        }
    }

    // Get bookmarks for the authenticated user
    public function index()
    {
        try {
            $bookmarks = Auth::user()->bookmarks()->with('post')->get();
            return response()->json($bookmarks);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to retrieve bookmarks', 'message' => $e->getMessage()], 500);
        }
    }

    // Remove a bookmark
    public function destroy($id)
    {
        $bookmark = Bookmark::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $bookmark->delete();

        return response()->json(['message' => 'Bookmark removed successfully'], 200);
    }

}
