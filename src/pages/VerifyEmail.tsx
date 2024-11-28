import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export function VerifyEmail() {
  const { currentUser, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to send verification email.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Verify your email</h2>
        <p className="text-gray-600">
          We've sent a verification email to {currentUser?.email}. Please check your inbox and click
          the verification link.
        </p>
        <button
          onClick={handleResendVerification}
          className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
}