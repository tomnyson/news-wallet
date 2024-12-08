<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('category', 'tags');
        return response()->json($query->get());
    }

    public function getPosts(Request $request)
    {
        try {
            $query = Post::with('category', 'tags');
            $user = $request->user();
    
            if (!$user || !$user->subscriptions()->where('expires_at', '>', now())->exists()) {
                // Restrict to free content for unauthenticated users or users without valid subscriptions
                $query->where('type', 'free');
            }
    
            $posts = $query->get();
    
            return response()->json([
                'message' => 'Posts retrieved successfully',
                'data' => $posts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve posts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required',
                'category_id' => 'required|exists:categories,id',
                "type" => "required|string|max:255|in:free,paid",
                "image" => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'tags' => 'array',
                'tags.*' => 'exists:tags,id',
            ]);

            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public'); // Save to 'storage/app/public/images'
                $validated['image'] = $imagePath;
            }


            $post = Post::create($validated);
            $post->tags()->attach($request->tags);
            return response()->json($post->load('category', 'tags'), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
       
    }

    public function show(Post $post)
    {
        return $post->load('category', 'tags');
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes',
            'category_id' => 'sometimes|exists:categories,id',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            "image" => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete the old image if exists
            if ($post->image) {
                Storage::delete('public/' . $post->image);
            }

            $imagePath = $request->file('image')->store('images', 'public');
            $validated['image'] = $imagePath;
        }

        $post->update($validated);
        if ($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return response()->json($post->load('category', 'tags'));
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully']);
    }
}
