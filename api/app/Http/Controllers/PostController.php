<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        try {
            $limit = intval($request->input('limit', 5));
            $page = intval($request->input('page', 1));

            if ($limit <= 0 || $page <= 0) {
                return response()->json([
                    'message' => 'Invalid pagination parameters. Limit and page must be positive integers.',
                ], 400);
            }

            $posts = Post::orderBy('created_at', 'desc')
                ->with(['category', 'tags'])
                ->paginate($limit, ['*'], 'page', $page);

            return response()->json($posts, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve posts.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getPosts(Request $request)
    {
        try {
            $query = Post::with('category', 'tags');
            $user = $request->user();
            // Filter for free posts if the user doesn't have an active subscription
            if (!$user || !$user->subscriptions()->where('expires_at', '>', now())->exists()) {
                $query->where('type', 'free');
            }

            // Filter by category ID if provided
            if ($request->filled('categoryId')) {
                $query->where('category_id', $request->input('categoryId'));
            }

            // Filter by tag ID if provided
            if ($request->filled('tagId')) {
                $tagId = $request->input('tagId');
                $query->whereHas('tags', function ($q) use ($tagId) {
                    $q->where('tags.id', $tagId);
                });
            }

            // Filter by keyword if provided
            if ($request->filled('keyword')) {
                $keyword = $request->input('keyword');
                $query->where('title', 'LIKE', '%' . $keyword . '%');
            }
            // filter by type if provided
            if ($request->filled('type')) {
                $type = $request->input('type');
                $query->where('type', $type);
            }
            // filter by limit if provided
            if ($request->filled('limit')) {
                $limit = $request->input('limit');
                $query->limit($limit);
            }

            // filter by order if provided
            if ($request->filled('order')) {
                $order = $request->input('order');
                $query->orderBy('created_at', $order);
            }

            

            // Retrieve the posts
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
        try {
            // Load the category and tags relationships
            $postWithRelations = $post->load('category', 'tags');

            // Return the response as JSON
            return response()->json([
                'status' => 'success',
                'data' => $postWithRelations
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve the post.',
                'error' => $e->getMessage()
            ], 500);
        }
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

    public function getDetail($id, request $request)
    {
        try {
            $post = Post::with('category', 'tags')->find($id);
    
            if (!$post) {
                return response()->json(['message' => 'Post not found'], 404);
            }
            $post->increment('views');
    
          
            $isBookmarked = false;
            $bookmarkId = null;
            if ($user = $request->user()) {
                $isBookmarked = $user->bookmarks()->where('post_id', $id)->exists();
                if ($isBookmarked) {
                    $bookmarkId = $user->bookmarks()->where('post_id', $id)->first()->id;
                }
            }
    
            $post->isBookmarked = $isBookmarked;
            $post->bookmarkId = $bookmarkId;
    
            return response()->json($post, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
