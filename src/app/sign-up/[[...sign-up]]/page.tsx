import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-16 bg-[#0B0B0B] overflow-hidden">
      {/* SkaleKraft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#805948]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10">
        <SignUp />
      </div>
    </div>
  );
}
