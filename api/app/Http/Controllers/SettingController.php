<?php
namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    // Store a newly created setting in storage
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'key' => 'required|unique:settings|max:255',
            'value' => 'nullable',
        ]);

        $setting = Setting::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Setting created successfully.',
            'data' => $setting,
        ], 201);
    }

    // Show the specified setting
    public function show($id)
    {
        $setting = Setting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $setting,
        ]);
    }

    // Update the specified setting in storage
    public function update(Request $request, $id)
    {
        $setting = Setting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found.',
            ], 404);
        }

        $validatedData = $request->validate([
            'key' => 'required|max:255|unique:settings,key,' . $id,
            'value' => 'nullable',
        ]);

        $setting->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Setting updated successfully.',
            'data' => $setting,
        ]);
    }

    // Remove the specified setting from storage
    public function destroy($id)
    {
        $setting = Setting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found.',
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Setting deleted successfully.',
        ]);
    }
}