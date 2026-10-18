import React from 'react';
import { HeartHandshake, Shield, Sparkles } from 'lucide-react';

export default function CodeOfConductPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4">
            <HeartHandshake className="h-3.5 w-3.5" />
            <span>Community Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Code of Conduct</h1>
          <p className="mt-2 text-xs text-slate-400">Applicable to all participants, mentors, judges, and administrators.</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed rounded-2xl border border-white/10 bg-[#0c111e] p-8">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyanAccent-400" />
              <span>1. Our Pledge</span>
            </h2>
            <p>
              Skaleathon 2027 is dedicated to providing a safe, respectful, and harassment-free competition experience for everyone, regardless of gender, gender identity, sexual orientation, disability, physical appearance, race, ethnicity, age, or religion.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-400" />
              <span>2. Expected Behavior</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Communicate with professional courtesy in all discussion channels, forums, and GitHub discussions.</li>
              <li>Give constructive, respectful feedback during evaluations.</li>
              <li>Respect the intellectual property and attribution of fellow builders.</li>
              <li>Focus on building solutions that create positive real-world value.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Unacceptable Behavior</h2>
            <p>
              Harassment, offensive commentary, unauthorized sharing of personal contact data (doxxing), trolling, code sabotage, or attempts to bribe judges or administrators are strictly prohibited and will result in permanent ban and immediate disqualification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Reporting Violations</h2>
            <p>
              If you experience or witness unacceptable conduct, please immediately contact the SkaleKraft organizer board at <strong>contact@skalekraft.in</strong>. All reports will be handled promptly with confidentiality.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
