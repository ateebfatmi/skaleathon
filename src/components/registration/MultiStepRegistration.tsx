'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  Building,
  Mail,
  Phone,
  BrainCircuit,
  Globe,
  Smartphone,
  ShieldCheck,
  Clock,
  Shield,
  UserCheck,
} from 'lucide-react';
import { EventData, EventTrack } from '@/lib/db/types';
import { LocationInput } from './LocationInput';
import { INDIAN_STATES, MAJOR_INDIAN_CITIES } from '@/data/indiaLocations';

interface Member {
  name: string;
  email: string;
  phone: string;
  college_or_org: string;
}

let razorpayLoader: Promise<boolean> | null = null;

function loadRazorpayCheckout(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayLoader) return razorpayLoader;

  razorpayLoader = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    const script = existing || document.createElement('script');

    script.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
    script.addEventListener('error', () => resolve(false), { once: true });
    if (!existing) {
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return razorpayLoader;
}

export default function MultiStepRegistration({
  tracks,
  event,
  initialTrackId,
  isModal = false,
  onClose,
}: {
  tracks: EventTrack[];
  event: EventData;
  initialTrackId?: string;
  isModal?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTrack = initialTrackId || searchParams.get('track') || tracks[0]?.id || 'track-ai-ml';

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const hasPreselectedTrack = Boolean(initialTrackId || searchParams?.get('track'));
  const [isChangingTrack, setIsChangingTrack] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(preselectedTrack);

  useEffect(() => {
    if (initialTrackId) {
      setSelectedTrack(initialTrackId);
      setIsChangingTrack(false);
    }
  }, [initialTrackId]);
  const [collegeOrOrg, setCollegeOrOrg] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');

  const availableCities = useMemo(() => {
    if (state.trim()) {
      const matchState = state.trim().toLowerCase();
      return MAJOR_INDIAN_CITIES.filter(
        (c) => c.state.toLowerCase() === matchState
      );
    }
    return [];
  }, [state]);

  const handleStateChange = (newState: string) => {
    setState(newState);
    if (city.trim() && newState.trim()) {
      const matchState = newState.trim().toLowerCase();
      const belongs = MAJOR_INDIAN_CITIES.some(
        (c) =>
          c.name.toLowerCase() === city.trim().toLowerCase() &&
          c.state.toLowerCase() === matchState
      );
      if (!belongs) {
        setCity('');
      }
    } else if (!newState.trim()) {
      setCity('');
    }
  };

  // Leader details
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmailTouched, setLeaderEmailTouched] = useState(false);
  const [leaderPhoneTouched, setLeaderPhoneTouched] = useState(false);
  const [step2Attempted, setStep2Attempted] = useState(false);
  const [touchedMemberEmails, setTouchedMemberEmails] = useState<{ [key: number]: boolean }>({});
  const [touchedMemberPhones, setTouchedMemberPhones] = useState<{ [key: number]: boolean }>({});

  // Email format validator
  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  };

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
          setLeaderName((prev) => prev || data.session.fullName);
          setLeaderEmail((prev) => prev || data.session.email);
        }
      })
      .catch(() => {});
  }, []);

  const addMember = () => {
    if (members.length < event.max_team_size - 1) {
      setMembers([...members, { name: '', email: '', phone: '', college_or_org: '' }]);
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleLeaderPhoneChange = (val: string) => {
    // Restrict strictly to digits only, up to 10 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setLeaderPhone(cleaned);
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const updated = [...members];
    if (field === 'phone') {
      // Restrict strictly to digits only, up to 10 digits
      updated[index][field] = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'email') {
      updated[index][field] = value.trim();
    } else {
      updated[index][field] = value;
    }
    setMembers(updated);
  };

  // STEP 1 Validation -> Proceed to Step 2
  const handleProceedToStep2 = () => {
    setErrorMessage(null);
    if (!teamName.trim() || teamName.length < 3) {
      setErrorMessage('Team name must have at least 3 characters.');
      return;
    }
    if (!state.trim()) {
      setErrorMessage('Please select a state first.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage(`Please select or enter a city for ${state}.`);
      return;
    }
    setStep(2);
  };

  // STEP 2 Validation -> Proceed to Step 3 (Review)
  const handleProceedToStep3 = () => {
    setErrorMessage(null);
    setStep2Attempted(true);

    if (!leaderName.trim() || leaderName.length < 2) {
      setErrorMessage('Team Leader name is required.');
      return;
    }
    if (!leaderEmail.trim() || !isValidEmail(leaderEmail)) {
      setErrorMessage('Please write the email in the correct format (e.g. name@example.com) for the Team Leader.');
      return;
    }
    if (!leaderPhone.trim() || leaderPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for the Team Leader.');
      return;
    }

    // Validate additional members
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim()) {
        setErrorMessage(`Please enter a full name for Member #${i + 2}.`);
        return;
      }
      if (!m.email.trim() || !isValidEmail(m.email)) {
        setErrorMessage(`Please write the email in the correct format (e.g. name@example.com) for Member #${i + 2}.`);
        return;
      }
      if (m.phone && m.phone.length > 0 && m.phone.length !== 10) {
        setErrorMessage(`Phone number for Member #${i + 2} must be a 10-digit number, or left empty.`);
        return;
      }
      if (m.email.toLowerCase().trim() === leaderEmail.toLowerCase().trim()) {
        setErrorMessage(`Member #${i + 2} cannot have the same email as the Team Leader.`);
        return;
      }
    }

    // Check for duplicate emails among members
    const memberEmails = members.map((m) => m.email.toLowerCase().trim());
    const duplicates = memberEmails.filter((item, index) => memberEmails.indexOf(item) !== index);
    if (duplicates.length > 0) {
      setErrorMessage('Each squad member must have a distinct email address.');
      return;
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

  // STEP 4 -> Open Razorpay Modal & Verify Payment Signature
  const handleVerifyPayment = async () => {
    setLoading(true);
    setErrorMessage(null);

    const executeVerification = async (verifyPayload: {
      orderId: string;
      paymentId: string;
      signature: string;
    }) => {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment signature verification failed.');
      }

      setPaymentConfirmed(true);
      setStep(5);
    };

    try {
      const checkoutLoaded = await loadRazorpayCheckout();

      // Check if window.Razorpay is available for Standard Web Checkout
      if (checkoutLoaded && typeof window !== 'undefined' && window.Razorpay) {
        const keyId =
          paymentOrder.keyId ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          '';

        if (!keyId) {
          throw new Error('Payment gateway is not configured. Please contact the organizer.');
        }

        const rzp = new window.Razorpay({
          key: keyId,
          amount: (paymentOrder.amount || event.registration_fee_inr) * 100,
          currency: paymentOrder.currency || 'INR',
          name: `SkaleKraft — ${event.name}`,
          description: `Team Registration: ${teamName}`,
          image: '/icon.png',
          order_id: paymentOrder.orderId,
          prefill: {
            name: leaderName,
            email: leaderEmail,
            contact: leaderPhone || undefined,
          },
          notes: {
            teamName,
            track: currentTrackObj?.name || '',
          },
          theme: {
            color: '#805948',
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              setLoading(true);
              await executeVerification({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
            } catch (err: any) {
              setErrorMessage(err.message);
            } finally {
              setLoading(false);
            }
          },
        });

        rzp.on('payment.failed', function (failureRes: any) {
          const msg =
            failureRes?.error?.description ||
            failureRes?.error?.reason ||
            'Payment failed. Please try again.';
          setErrorMessage(msg);
          setLoading(false);
        });

        rzp.open();
        return;
      }

      throw new Error('Unable to load Razorpay Checkout. Please check your connection and try again.');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTrackObj = tracks.find((t) => t.id === selectedTrack);

  return (
    <div className={isModal ? "w-full" : "max-w-3xl mx-auto"}>
      {/* Progress Stepper Bar */}
      <div
        className={
          isModal
            ? "mb-5"
            : "mb-8 rounded-2xl border border-white/10 bg-[#121212]/80 p-4 sm:p-5 backdrop-blur-xl shadow-xl shadow-black/50 relative overflow-hidden"
        }
      >
        {!isModal && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c19a88]/40 to-transparent" />
        )}
        <div className="relative">
          {/* Continuous connecting bar behind circles */}
          <div className="absolute top-4 sm:top-5 left-6 right-6 h-[2px] bg-white/[0.08] -z-0" />
          <div
            className="absolute top-4 sm:top-5 left-6 h-[2px] bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] transition-all duration-500 -z-0 shadow-[0_0_12px_rgba(193,154,136,0.6)]"
            style={{
              width: `${((step - 1) / 4) * 100}%`,
              maxWidth: 'calc(100% - 48px)',
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            {['Team Profile', 'Members', 'Review', 'Payment', 'Confirmed'].map((label, i) => {
              const stepNum = i + 1;
              const isCompleted = step > stepNum;
              const isCurrent = step === stepNum;

              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`flex ${
                      isModal ? 'h-7 w-7 text-[11px]' : 'h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm'
                    } items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#805948] to-[#c19a88] text-white shadow-md shadow-[#805948]/30 ring-2 ring-[#c19a88]/40'
                        : isCurrent
                        ? 'bg-gradient-to-br from-[#c19a88] to-[#805948] text-white ring-4 ring-[#805948]/30 shadow-[0_0_20px_rgba(193,154,136,0.45)] scale-105'
                        : 'border border-white/10 bg-[#161616] text-neutral-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className={isModal ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5'} />
                    ) : (
                      <span className="font-mono">{stepNum}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 ${
                      isModal ? 'text-[9px]' : 'text-[10px] sm:text-[11px]'
                    } font-bold uppercase tracking-wider transition-colors text-center ${
                      isCurrent
                        ? 'text-[#e8c5b4]'
                        : isCompleted
                        ? 'text-white/80'
                        : 'text-neutral-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: TEAM INFORMATION */}
      {step === 1 && (
        <div className={isModal ? "space-y-4" : "rounded-[28px] border border-white/15 bg-gradient-to-b from-[#141414]/95 via-[#101010]/98 to-[#0B0B0B] p-6 sm:p-9 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(193,154,136,0.06)] backdrop-blur-2xl relative overflow-hidden"}>
          {!isModal && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c19a88] to-transparent opacity-80" />
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                  Stage 01 of 05
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono text-neutral-400">Team Blueprint</span>
              </div>
              <h2 className={`${isModal ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-white tracking-tight`}>
                Team & Track Information
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Provide your team identifier and select your primary competition track.
              </p>
            </div>
            {!isModal && (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-full self-start sm:self-auto">
                <Clock className="h-3 w-3 text-[#c19a88]" />
                <span>Est: ~2 mins</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="team-name" className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Team Name <span className="text-red-400">*</span></span>
                <span className="text-[10px] text-neutral-500 font-normal">Unique squad handle</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Users className="h-4 w-4" />
                </div>
                <input
                  id="team-name"
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. NeuralCoders"
                  className="w-full rounded-xl border border-white/10 bg-[#141414] pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="block text-xs font-semibold text-neutral-300" id="track-label">
                  Competition Track <span className="text-red-400">*</span>
                </span>
                {hasPreselectedTrack && !isChangingTrack && (
                  <button
                    type="button"
                    onClick={() => setIsChangingTrack(true)}
                    className="text-[11px] font-mono text-[#c19a88] hover:text-[#e8c5b4] underline cursor-pointer"
                  >
                    Change Track
                  </button>
                )}
                {hasPreselectedTrack && isChangingTrack && (
                  <button
                    type="button"
                    onClick={() => setIsChangingTrack(false)}
                    className="text-[11px] font-mono text-white/40 hover:text-white cursor-pointer"
                  >
                    Done
                  </button>
                )}
              </div>

              {hasPreselectedTrack && !isChangingTrack && currentTrackObj ? (
                <div className="rounded-xl border border-[#c19a88]/40 bg-[#805948]/15 p-3 sm:p-3.5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg border border-[#c19a88]/40 bg-[#c19a88]/20 flex items-center justify-center text-[#e8c5b4] shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{currentTrackObj.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                          Selected
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 line-clamp-1 mt-0.5 font-light">
                        {currentTrackObj.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-3 ${isModal ? 'gap-2.5' : 'gap-3.5'}`}>
                  {tracks.map((track) => {
                    const isAi = track.slug.includes('ai');
                    const isWeb = track.slug.includes('web');
                    const isSelected = selectedTrack === track.id;

                    return (
                      <button
                        key={track.id}
                        type="button"
                        aria-describedby="track-label"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setSelectedTrack(track.id);
                          if (hasPreselectedTrack) setIsChangingTrack(false);
                        }}
                        className={`group relative p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 overflow-hidden ${
                          isSelected
                            ? 'border-[#c19a88] bg-gradient-to-b from-[#805948]/25 via-[#c19a88]/10 to-[#141414] text-white shadow-[0_0_25px_rgba(193,154,136,0.22)] ring-1 ring-[#c19a88]/50'
                            : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/20 hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg bg-[#c19a88] text-[9px] font-mono font-bold text-black uppercase">
                            Selected
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSelected
                                ? 'border-[#c19a88]/50 bg-[#c19a88]/20 text-[#e8c5b4]'
                                : 'border-white/10 bg-white/5 text-neutral-400 group-hover:text-white'
                            }`}
                          >
                            {isAi ? (
                              <BrainCircuit className="h-4 w-4" />
                            ) : isWeb ? (
                              <Globe className="h-4 w-4" />
                            ) : (
                              <Smartphone className="h-4 w-4" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-white leading-tight">
                            {track.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                          {track.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LocationInput
                label="State"
                required
                value={state}
                onChange={handleStateChange}
                onSelectOption={(item) => {
                  const stateVal = typeof item === 'string' ? item : item.value;
                  handleStateChange(stateVal);
                }}
                options={INDIAN_STATES}
                placeholder="Select or search state"
                helperText="Select state first"
              />

              <LocationInput
                label="City"
                required
                disabled={!state.trim()}
                value={city}
                onChange={setCity}
                options={availableCities}
                placeholder={state.trim() ? `Search or type city in ${state}` : 'Select a state first'}
                helperText={
                  state.trim()
                    ? 'Select from list or type your city'
                    : 'Requires state selection'
                }
              />
            </div>

            <div>
              <label htmlFor="college-or-org" className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>College or Organization <span className="text-neutral-500 font-normal">(Optional)</span></span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  id="college-or-org"
                  type="text"
                  value={collegeOrOrg}
                  onChange={(e) => setCollegeOrOrg(e.target.value)}
                  placeholder="e.g. IIT Delhi / Independent"
                  className="w-full rounded-xl border border-white/10 bg-[#141414] pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="team-description" className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                <span>Short Team Description <span className="text-neutral-500 font-normal">(Optional)</span></span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-3 text-neutral-500">
                  <FileText className="h-4 w-4" />
                </div>
                <textarea
                  id="team-description"
                  rows={isModal ? 2 : 2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your team's background, vision, or area of interest..."
                  className="w-full rounded-xl border border-white/10 bg-[#141414] pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/10">
            <span className="text-[11px] font-mono text-neutral-500">
              * Required fields to proceed
            </span>
            <button
              type="button"
              onClick={handleProceedToStep2}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#805948] via-[#9c6d58] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-7 py-3 text-xs font-bold text-white shadow-xl shadow-[#805948]/30 hover:shadow-[0_0_30px_rgba(193,154,136,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Continue to Members (Step 2)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TEAM MEMBERS */}
      {step === 2 && (
        <div className={isModal ? "space-y-4" : "rounded-[28px] border border-white/15 bg-gradient-to-b from-[#141414]/95 via-[#101010]/98 to-[#0B0B0B] p-6 sm:p-9 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(193,154,136,0.06)] backdrop-blur-2xl relative overflow-hidden"}>
          {!isModal && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c19a88] to-transparent opacity-80" />
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                  Stage 02 of 05
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono text-neutral-400">Roster Setup</span>
              </div>
              <h2 className={`${isModal ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-white tracking-tight`}>
                Team Members ({event.min_team_size}–{event.max_team_size} Builders)
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Participate individually or add up to {event.max_team_size - 1} teammates. The flat ₹{event.registration_fee_inr} fee covers the entire squad.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#e8c5b4] bg-[#805948]/20 border border-[#c19a88]/30 px-3 py-1 rounded-full self-start sm:self-auto">
              <UserCheck className="h-3.5 w-3.5 text-[#c19a88]" />
              <span>{1 + members.length} of {event.max_team_size} Enrolled</span>
            </div>
          </div>

          {/* Leader Card */}
          <div className={`rounded-2xl border border-[#805948]/30 bg-[#805948]/10 ${isModal ? 'p-3.5 space-y-3' : 'p-5 space-y-4'} relative overflow-hidden`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#e8c5b4] uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#c19a88]" />
                Member #1: Team Leader (Primary Contact)
              </span>
              <span className="text-[10px] font-semibold bg-[#805948]/40 border border-[#c19a88]/30 px-2.5 py-0.5 rounded-full text-[#e8c5b4]">
                Authorized Submitter
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="leader-name" className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <input
                    id="leader-name"
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="Leader Name"
                    className="w-full rounded-xl border border-white/10 bg-[#141414] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="leader-email" className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <input
                    id="leader-email"
                    type="email"
                    required
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value.trim())}
                    onBlur={() => setLeaderEmailTouched(true)}
                    placeholder="leader@example.com"
                    className={`w-full rounded-xl border bg-[#141414] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all ${
                      (leaderEmailTouched || step2Attempted) && leaderEmail.length > 0 && !isValidEmail(leaderEmail)
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : isValidEmail(leaderEmail)
                        ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-white/10 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20'
                    }`}
                  />
                </div>
                {(leaderEmailTouched || step2Attempted) && leaderEmail.length > 0 && !isValidEmail(leaderEmail) && (
                  <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Please write the email in the correct format (e.g. name@example.com)
                  </p>
                )}
                {isValidEmail(leaderEmail) && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="h-3 w-3 shrink-0" />
                    Valid email format
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="leader-phone" className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <input
                    id="leader-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={leaderPhone}
                    onChange={(e) => handleLeaderPhoneChange(e.target.value)}
                    onBlur={() => setLeaderPhoneTouched(true)}
                    placeholder="10-digit mobile"
                    className={`w-full rounded-xl border bg-[#141414] pl-9 pr-14 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono ${
                      (leaderPhoneTouched || step2Attempted) && leaderPhone.length > 0 && leaderPhone.length < 10
                        ? 'border-amber-500/70 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        : leaderPhone.length === 10
                        ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-white/10 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500 pointer-events-none">
                    {leaderPhone.length}/10
                  </div>
                </div>
                {(leaderPhoneTouched || step2Attempted) && leaderPhone.length > 0 && leaderPhone.length < 10 && (
                  <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Phone number must be exactly 10 digits ({leaderPhone.length}/10 entered)
                  </p>
                )}
                {leaderPhone.length === 10 && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="h-3 w-3 shrink-0" />
                    Valid 10-digit mobile number
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Members */}
          <div className="space-y-4">
            {members.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 relative hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-neutral-500" />
                    Member #{idx + 2}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="p-1 rounded text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <input
                      aria-label={`Member ${idx + 2} full name`}
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => updateMember(idx, 'name', e.target.value)}
                      placeholder="Full Name *"
                      className="w-full rounded-xl border border-white/10 bg-[#141414] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <Mail className="h-3.5 w-3.5" />
                      </div>
                      <input
                        aria-label={`Member ${idx + 2} email address`}
                        type="email"
                        required
                        value={member.email}
                        onChange={(e) => updateMember(idx, 'email', e.target.value)}
                        onBlur={() => setTouchedMemberEmails((prev) => ({ ...prev, [idx]: true }))}
                        placeholder="Email Address *"
                        className={`w-full rounded-xl border bg-[#141414] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all ${
                          (touchedMemberEmails[idx] || step2Attempted) && member.email.length > 0 && !isValidEmail(member.email)
                            ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : isValidEmail(member.email)
                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-white/10 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20'
                        }`}
                      />
                    </div>
                    {(touchedMemberEmails[idx] || step2Attempted) && member.email.length > 0 && !isValidEmail(member.email) && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                        Please write email in correct format (name@example.com)
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                        <Phone className="h-3.5 w-3.5" />
                      </div>
                      <input
                        aria-label={`Member ${idx + 2} phone number`}
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={member.phone}
                        onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                        onBlur={() => setTouchedMemberPhones((prev) => ({ ...prev, [idx]: true }))}
                        placeholder="Phone (10 digits)"
                        className={`w-full rounded-xl border bg-[#141414] pl-9 pr-12 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono ${
                          (touchedMemberPhones[idx] || step2Attempted) && member.phone.length > 0 && member.phone.length < 10
                            ? 'border-amber-500/70 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                            : member.phone.length === 10
                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-white/10 focus:border-[#c19a88] focus:ring-2 focus:ring-[#c19a88]/20'
                        }`}
                      />
                      {member.phone.length > 0 && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500 pointer-events-none">
                          {member.phone.length}/10
                        </div>
                      )}
                    </div>
                    {(touchedMemberPhones[idx] || step2Attempted) && member.phone.length > 0 && member.phone.length < 10 && (
                      <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                        Must be 10 digits ({member.phone.length}/10)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {members.length < 5 && (
              <button
                type="button"
                onClick={addMember}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-xs font-semibold text-neutral-300 hover:border-[#c19a88] hover:text-[#c19a88] hover:bg-white/[0.02] transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Another Member ({1 + members.length} of 6 configured)</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToStep3}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#805948] via-[#9c6d58] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-7 py-3 text-xs font-bold text-white shadow-xl shadow-[#805948]/30 hover:shadow-[0_0_30px_rgba(193,154,136,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Review Details (Step 3)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONSENT */}
      {step === 3 && (
        <div className={isModal ? "space-y-4" : "rounded-[28px] border border-white/15 bg-gradient-to-b from-[#141414]/95 via-[#101010]/98 to-[#0B0B0B] p-6 sm:p-9 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(193,154,136,0.06)] backdrop-blur-2xl relative overflow-hidden"}>
          {!isModal && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c19a88] to-transparent opacity-80" />
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                  Stage 03 of 05
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono text-neutral-400">Verification</span>
              </div>
              <h2 className={`${isModal ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-white tracking-tight`}>
                Review & Policy Consent
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Verify your team composition and review applicable event policies.
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className={`rounded-2xl border border-white/10 bg-[#141414] ${isModal ? 'p-4 space-y-3' : 'p-6 space-y-4'} text-xs shadow-inner`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-neutral-400">Team Name</span>
              <span className="font-bold text-white text-sm">{teamName}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-neutral-400">Selected Track</span>
              <span className="font-bold text-[#c19a88] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {currentTrackObj?.name}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-neutral-400">Location</span>
              <span className="text-neutral-200">{city}, {state}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-neutral-400">Total Team Size</span>
              <span className="font-bold text-white">{1 + members.length} Innovator(s)</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-neutral-400">Team Leader</span>
              <span className="text-neutral-200">{leaderName} ({leaderEmail})</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-neutral-300 font-bold">Total Registration Fee</span>
              <span className="text-lg font-black text-[#e8c5b4] font-mono">₹{event.registration_fee_inr.toFixed(2)} (Flat Per Team)</span>
            </div>
          </div>

          {/* Mandatory Policy Consent */}
          <div className="rounded-2xl border border-[#805948]/30 bg-[#805948]/10 p-4.5 hover:border-[#c19a88]/40 transition-colors">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-[#141414] text-[#c19a88] focus:ring-[#c19a88] accent-[#c19a88]"
              />
              <span className="text-xs text-neutral-300 leading-relaxed">
                I hereby certify that all information provided is accurate and all team members consent to participation. I accept the{' '}
                <a href="/rules" target="_blank" rel="noopener noreferrer" className="text-[#c19a88] hover:text-[#e8c5b4] underline">Official Rules</a>,{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#c19a88] hover:text-[#e8c5b4] underline">Terms & Conditions</a>,{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#c19a88] hover:text-[#e8c5b4] underline">Privacy Policy</a>, and the{' '}
                <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-[#c19a88] hover:text-[#e8c5b4] underline">Refund Policy</a>.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleRegisterAndPay}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#805948] via-[#9c6d58] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-7 py-3 text-xs font-bold text-white shadow-xl shadow-[#805948]/30 hover:shadow-[0_0_30px_rgba(193,154,136,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              <span>{loading ? 'Registering Team...' : `Proceed to Payment (₹${event.registration_fee_inr})`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT (RAZORPAY) */}
      {step === 4 && paymentOrder && (
        <div className={isModal ? "space-y-4" : "rounded-[28px] border border-white/15 bg-gradient-to-b from-[#141414]/95 via-[#101010]/98 to-[#0B0B0B] p-6 sm:p-9 space-y-6 shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(193,154,136,0.06)] backdrop-blur-2xl relative overflow-hidden"}>
          {!isModal && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c19a88] to-transparent opacity-80" />
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] font-bold">
                  Stage 04 of 05
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] font-mono text-neutral-400">Checkout</span>
              </div>
              <h2 className={`${isModal ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold text-white tracking-tight`}>
                Secure Razorpay Payment
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Finalize your team registration fee of ₹{event.registration_fee_inr} via Razorpay.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#c19a88] bg-[#805948]/20 border border-[#c19a88]/30 px-3 py-1 rounded-full self-start sm:self-auto">
              <Lock className="h-3.5 w-3.5" />
              <span>256-bit Encrypted</span>
            </div>
          </div>

          {/* Payment Invoice Summary */}
          <div className={`rounded-2xl border border-white/10 bg-[#141414] ${isModal ? 'p-4 space-y-3' : 'p-6 space-y-4'} shadow-inner`}>
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <span className="text-neutral-400">Team</span>
              <span className="font-bold text-white">{teamName}</span>
            </div>
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <span className="text-neutral-400">Order Reference</span>
              <span className="font-mono text-neutral-300">{paymentOrder.orderId}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-neutral-400">Amount Due</span>
              <span className="text-2xl font-black text-[#e8c5b4] font-mono">₹{paymentOrder.amount}.00</span>
            </div>
          </div>

          {/* Gateway Status Box */}
          <div className={`rounded-2xl border border-[#805948]/30 bg-[#805948]/10 ${isModal ? 'p-3.5 space-y-2' : 'p-5 space-y-3'}`}>
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-[#c19a88] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Server-Verified Gateway Integration</h4>
                <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
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
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#805948] via-[#9c6d58] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#805948]/30 hover:shadow-[0_0_30px_rgba(193,154,136,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              <CreditCard className="h-4 w-4" />
              <span>{loading ? 'Verifying Gateway Signature...' : `Pay ₹${event.registration_fee_inr} & Verify Signature`}</span>
            </button>
            <p className="text-center text-[10px] text-neutral-500 font-mono">
              * In sandbox mode without live merchant keys, the system executes an automated cryptographic signature exchange with server-side audit logging.
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: REGISTRATION CONFIRMATION */}
      {step === 5 && (
        <div className={isModal ? "rounded-2xl border border-[#c19a88]/30 bg-[#0E0E0E] p-6 sm:p-8 text-center space-y-4 shadow-xl" : "rounded-[28px] border border-[#c19a88]/30 bg-gradient-to-b from-[#141414] via-[#101010] to-[#0A0A0A] p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-black/80 relative overflow-hidden"}>
          {!isModal && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c19a88] to-transparent opacity-80" />
          )}

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#805948]/20 border border-[#c19a88]/40 text-[#c19a88] mx-auto shadow-inner ring-4 ring-[#805948]/20 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19a88] font-mono">
              ✦ Authoritatively Verified // {event.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Registration Confirmed!</h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              Congratulations! Team <strong>{teamName}</strong> is officially registered for {event.name} under the <strong>{currentTrackObj?.name}</strong>.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="rounded-2xl border border-white/10 bg-black/50 p-6 text-left max-w-md mx-auto text-xs space-y-3 shadow-inner">
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-neutral-400">Registration ID:</span>
              <span className="font-mono font-bold text-white">{createdTeam?.id}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-neutral-400">Order Reference:</span>
              <span className="font-mono text-neutral-300">{paymentOrder?.orderId}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-white/10">
              <span className="text-neutral-400">Payment Status:</span>
              <span className="font-bold text-[#c19a88]">Verified Paid (₹{event.registration_fee_inr.toFixed(2)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Registered Members:</span>
              <span className="text-neutral-200">{1 + members.length} Member(s)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] to-[#c19a88] hover:from-[#9c6d58] hover:to-[#d3a58f] px-8 py-3 text-xs font-bold text-white shadow-lg shadow-[#805948]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Go to Team Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-6 py-3 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
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
