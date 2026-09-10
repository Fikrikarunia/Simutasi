<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required'],
        ], [
            'email.required' => 'Email atau NPSN wajib diisi.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        $loginInput = trim($request->input('email'));
        $password = $request->input('password');
        $remember = $request->boolean('remember');

        // Check if login input is NPSN (digits without @)
        if (!str_contains($loginInput, '@')) {
            $user = User::whereHas('school', function ($q) use ($loginInput) {
                $q->where('npsn', $loginInput);
            })->first();

            if (!$user) {
                $user = User::where('email', "operator.{$loginInput}@sekolah.id")->first();
            }

            if ($user && Auth::attempt(['email' => $user->email, 'password' => $password], $remember)) {
                $request->session()->regenerate();
                return redirect()->intended(route('dashboard'));
            }
        } else {
            if (Auth::attempt(['email' => $loginInput, 'password' => $password], $remember)) {
                $request->session()->regenerate();
                return redirect()->intended(route('dashboard'));
            }
        }

        return back()->withErrors([
            'email' => 'Email / NPSN atau kata sandi yang Anda masukkan tidak sesuai.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
