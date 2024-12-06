<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    // Get all packages
    public function index()
    {
        return response()->json(Package::all(), 200);
    }

    // Create a new package
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:packages',
            'duration' => 'required|integer|min:1', // Duration in days
            'price' => 'required|numeric|min:0',   // Price in currency
        ]);

        $package = Package::create($validated);

        return response()->json(['message' => 'Package created successfully', 'package' => $package], 201);
    }

    // Get a specific package
    public function show(Package $package)
    {
        return response()->json($package, 200);
    }

    // Update an existing package
    public function update(Request $request, Package $package)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:packages,name,' . $package->id,
            'duration' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $package->update($validated);

        return response()->json(['message' => 'Package updated successfully', 'package' => $package], 200);
    }

    // Delete a package
    public function destroy(Package $package)
    {
        $package->delete();

        return response()->json(['message' => 'Package deleted successfully'], 200);
    }
}
