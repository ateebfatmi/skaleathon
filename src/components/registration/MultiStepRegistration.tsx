'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Lock,
  Sparkles,
  Download,
  ExternalLink,
} from 'lucide-react';
import { EventTrack } from '@/lib/db/types';

interface Member {
  name: string;
  email: string;
  phone: string;
  college_or_org: string;
}

export default function MultiStepRegistration({ tracks }: { tracks: EventTrack[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTrack = searchParams.get('track') || tracks[0]?.id || 'track-ai-ml';

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [teamName, setTeamName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(preselectedTrack);
  const [collegeOrOrg, setCollegeOrOrg] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');

  // Leader details
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');

  // Additional Members (0 to 5)
  const [members, setMembers] = useState<Member[]>([]);

  // Policy consent
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  // Created team & payment data
  const [createdTeam, setCreatedTeam] = useState<any>(null);
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Check current session to prepopulate leader if logged in
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session) {
          if (!leaderName) setLeaderName(data.session.fullName);
          if (!leaderEmail) setLeaderEmail(data.session.email);
        }
      })
      .catch(() => {});
  }, []);

  const addMember = () => {
    if (members.length < 5) {
      setMembers([...members, { name: '', email: '', phone: '', college_or_org: '' }]);
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  // STEP 1 Validation -> Proceed to Step 2
  const handleProceedToStep2 = () => {
    setErrorMessage(null);
    if (!teamName.trim() || teamName.length < 3) {
      setErrorMessage('Team name must have at least 3 characters.');
      return;
    }
    if (!city.trim() || !state.trim()) {
      setErrorMessage('Please provide both city and state.');
      return;
    }
    setStep(2);
  };

  // STEP 2 Validation -> Proceed to Step 3 (Review)
  const handleProceedToStep3 = () => {
    setErrorMessage(null);
    if (!leaderName.trim() || leaderName.length < 2) {
      setErrorMessage('Team Leader name is required.');
      return;
    }
    if (!leaderEmail.trim() || !leaderEmail.includes('@')) {
      setErrorMessage('Valid Team Leader email address is required.');
      return;
    }
    if (!leaderPhone.trim() || leaderPhone.length < 10) {
      setErrorMessage('Valid 10-digit phone number is required for the Team Leader.');
      return;
    }

    // Validate additional members
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim() || !m.email.trim() || !m.email.includes('@')) {
        setErrorMessage(`Please enter a valid name and email for Member #${i + 2}.`);
        return;
      }
      if (m.email.toLowerCase().trim() === leaderEmail.toLowerCase().trim()) {
        setErrorMessage(`Member #${i + 2} cannot have the same email as the Team Leader.`);
        return;
      }
    }

    setStep(3);
  };

  // STEP 3 -> Submit Registration to Server & Create Payment Order
  const handleRegisterAndPay = async () => {
    setErrorMessage(null);
    if (!acceptedPolicies) {
      setErrorMessage('You must accept the official rules, terms, and privacy policy.');
      return;
    }

    setLoading(true);
    try {
      // 1. Submit Registration
      const regRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          track_id: selectedTrack,
          college_or_org: collegeOrOrg,
          city,
          state,
          description,
          leader_name: leaderName,
          leader_email: leaderEmail,
          leader_phone: leaderPhone,
          members,
          acceptedPolicies,
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || 'Registration failed');
      }

      setCreatedTeam(regData.team);

      // 2. Create Razorpay Payment Order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: regData.team.id }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

      setPaymentOrder(orderData);
      setStep(4);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 4 -> Verify Payment
  const handleVerifyPayment = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Complete signature verification
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paymentOrder.orderId,
          paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
          signature: `sandbox_sig_${Math.random().toString(36).substring(2, 16)}`,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment signature verification failed.');
      }

      setPaymentConfirmed(true);
      setStep(5);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTrackObj = tracks.find((t) => t.id === selectedTrack);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Stepper Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {['Team Profile', 'Members', 'Review', 'Payment', 'Confirmed'].map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 shadow-md shadow-brand-500/30'
                      : 'border border-white/10 bg-white/5 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNum}
                </div>
                <span
                  className={`mt-2 text-[10px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-cyanAccent-500 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: TEAM INFORMATION */}
      {step === 1 && (
        <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Step 1: Team & Track Information</h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide your team identifier and select your primary competition track.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Team Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. NeuralCoders"
                className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Competition Track <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => setSelectedTrack(track.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedTrack === track.id
                        ? 'border-cyanAccent-400 bg-cyanAccent-950/40 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{track.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {track.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  State <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                College or Organization <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={collegeOrOrg}
                onChange={(e) => setCollegeOrOrg(e.target.value)}
                placeholder="e.g. IIT Delhi / Independent"
                className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Short Team Description <span className="text-slate-400">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your team's background or area of interest..."
                className="w-full rounded-xl border border-white/10 bg-[#080d17] px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
            >
              <span>Continue to Members (Step 2)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TEAM MEMBERS */}
      {step === 2 && (
        <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Step 2: Team Members (1–6 Members)</h2>
            <p className="text-xs text-slate-400 mt-1">
              You can participate as an individual builder or add up to 5 additional members (Total size: 1–6).
            </p>
          </div>

          {/* Leader Card */}
          <div className="rounded-2xl border border-brand-500/30 bg-brand-950/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Member #1: Team Leader (Primary Contact)
              </span>
              <span className="text-[10px] font-semibold bg-brand-900/60 px-2 py-0.5 rounded text-brand-200">
                Authorized Submitter
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="Leader Name"
                  className="w-full rounded-xl border border-white/10 bg-[#080d17] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={leaderEmail}
                  onChange={(e) => setLeaderEmail(e.target.value)}
                  placeholder="leader@example.com"
                  className="w-full rounded-xl border border-white/10 bg-[#080d17] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full rounded-xl border border-white/10 bg-[#080d17] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Additional Members */}
          <div className="space-y-4">
            {members.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#080d17] p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Member #{idx + 2}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="p-1 rounded text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => updateMember(idx, 'name', e.target.value)}
                      placeholder="Full Name *"
                      className="w-full rounded-xl border border-white/10 bg-[#060911] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={member.email}
                      onChange={(e) => updateMember(idx, 'email', e.target.value)}
                      placeholder="Email Address *"
                      className="w-full rounded-xl border border-white/10 bg-[#060911] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                      placeholder="Phone (Optional)"
                      className="w-full rounded-xl border border-white/10 bg-[#060911] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            {members.length < 5 && (
              <button
                type="button"
                onClick={addMember}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-xs font-semibold text-slate-300 hover:border-cyanAccent-400 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Member ({1 + members.length} of 6 configured)</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToStep3}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
            >
              <span>Review Details (Step 3)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONSENT */}
      {step === 3 && (
        <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white">Step 3: Review & Policy Consent</h2>
            <p className="text-xs text-slate-400 mt-1">
              Verify your team composition and review applicable event policies.
            </p>
          </div>

          {/* Summary Box */}
          <div className="rounded-2xl border border-white/10 bg-[#080d17] p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">Team Name</span>
              <span className="font-bold text-white text-sm">{teamName}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">Selected Track</span>
              <span className="font-bold text-cyanAccent-300">{currentTrackObj?.name}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">Location</span>
              <span className="text-slate-200">{city}, {state}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">Total Team Size</span>
              <span className="font-bold text-white">{1 + members.length} Innovator(s)</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-slate-400">Team Leader</span>
              <span className="text-slate-200">{leaderName} ({leaderEmail})</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300 font-bold">Total Registration Fee</span>
              <span className="text-lg font-black text-amber-400">₹99.00 (Flat Per Team)</span>
            </div>
          </div>

          {/* Mandatory Policy Consent */}
          <div className="rounded-2xl border border-brand-500/20 bg-brand-950/20 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-[#080d17] text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby certify that all information provided is accurate and all team members consent to participation. I accept the{' '}
                <a href="/rules" target="_blank" className="text-cyanAccent-400 underline">Official Rules</a>,{' '}
                <a href="/terms" target="_blank" className="text-cyanAccent-400 underline">Terms & Conditions</a>,{' '}
                <a href="/privacy" target="_blank" className="text-cyanAccent-400 underline">Privacy Policy</a>, and the{' '}
                <a href="/refund-policy" target="_blank" className="text-cyanAccent-400 underline">Refund Policy</a>.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleRegisterAndPay}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
            >
              <span>{loading ? 'Registering Team...' : 'Proceed to Payment (₹99)'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT (RAZORPAY) */}
      {step === 4 && paymentOrder && (
        <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-8 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Step 4: Secure Razorpay Payment</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Finalize your team registration fee of ₹99 via Razorpay.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Lock className="h-4 w-4" />
                <span>256-bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Payment Invoice Summary */}
          <div className="rounded-2xl border border-white/10 bg-[#080d17] p-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Team</span>
              <span className="font-bold text-white">{teamName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Order Reference</span>
              <span className="font-mono text-slate-300">{paymentOrder.orderId}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Amount Due</span>
              <span className="text-xl font-black text-amber-400">₹{paymentOrder.amount}.00</span>
            </div>
          </div>

          {/* Gateway Status Box */}
          <div className="rounded-2xl border border-cyanAccent-500/20 bg-cyanAccent-950/20 p-5 space-y-3">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-cyanAccent-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Server-Verified Gateway Integration</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Our payment workflow strictly enforces server-side Razorpay order generation, cryptographic HMAC signature verification, and idempotent webhook reconciliation.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              disabled={loading}
              onClick={handleVerifyPayment}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition-all"
            >
              <CreditCard className="h-4 w-4" />
              <span>{loading ? 'Verifying Gateway Signature...' : 'Pay ₹99 & Verify Signature'}</span>
            </button>
            <p className="text-center text-[10px] text-slate-400">
              * In sandbox mode without live merchant keys, the system executes an automated cryptographic signature exchange with server-side audit logging.
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: REGISTRATION CONFIRMATION */}
      {step === 5 && (
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-[#0f192b] to-[#0a0e1a] p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-emerald-500/10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Authoritatively Verified
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Registration Confirmed!</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Congratulations! Team <strong>{teamName}</strong> is officially registered for Skaleathon 2027 under the <strong>{currentTrackObj?.name}</strong>.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-left max-w-md mx-auto text-xs space-y-3">
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Registration ID:</span>
              <span className="font-mono font-bold text-white">{createdTeam?.id}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Order Reference:</span>
              <span className="font-mono text-slate-300">{paymentOrder?.orderId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">Payment Status:</span>
              <span className="font-bold text-emerald-400">Verified Paid (₹99.00)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Registered Members:</span>
              <span className="text-slate-200">{1 + members.length} Member(s)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-3 text-xs font-bold text-white shadow-lg hover:bg-brand-500 transition-colors"
            >
              <span>Go to Team Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Print Registration Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
