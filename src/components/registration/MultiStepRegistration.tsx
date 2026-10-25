'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode';
import PrintPassModal from '@/components/common/PrintPassModal';
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
  Printer,
  Copy,
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
  const [paymentResult, setPaymentResult] = useState<{ paymentId?: string; orderId?: string } | null>(null);
  const [copiedPassId, setCopiedPassId] = useState(false);
  const [passQrCode, setPassQrCode] = useState<string>('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    if (step === 5 && (createdTeam?.id || teamName)) {
      const verificationUrl = `https://skaleathon.skalekraft.in/dashboard/team?pass=${encodeURIComponent(createdTeam?.id || '')}`;
      QRCode.toDataURL(verificationUrl, {
        width: 360,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#171310',
          light: '#ffffff',
        },
      })
        .then(setPassQrCode)
        .catch(() => setPassQrCode(''));
    }
  }, [step, createdTeam?.id, teamName]);

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
      const orderRes = await fetch('/api/create-order', {
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
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment signature verification failed.');
      }

      setPaymentResult({
        paymentId: verifyPayload.paymentId,
        orderId: verifyPayload.orderId,
      });
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
          amount: paymentOrder.amount || event.registration_fee_inr * 100,
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
              setErrorMessage('Payment cancelled. Your team details are saved; you can try again.');
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
              <span className="text-2xl font-black text-[#e8c5b4] font-mono">
                ₹{((paymentOrder.amount || event.registration_fee_inr * 100) / 100).toFixed(2)}
              </span>
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
              * Razorpay Test Mode opens a simulated checkout. No real money is charged with test credentials.
            </p>
          </div>
        </div>
      )}

      {/* STEP 5: REGISTRATION CONFIRMATION & LUXURY RECEIPT */}
      {step === 5 && (
        <>
          {/* High-Resolution A4 Single-Page Print Pass (Hidden on screen; visible only during print) */}
          <article className="skaleathon-print-pass" aria-label="Official Skaleathon Registration Receipt">
            <div className="print-pass-frame">
              <header className="print-pass-header">
                <div className="print-pass-brand">
                  <Image
                    src="/images/skalekraft-logo.png"
                    alt="SkaleKraft"
                    width={68}
                    height={68}
                    className="print-pass-logo"
                    priority
                  />
                  <div>
                    <p>SkaleKraft presents</p>
                    <h1>SKALE<span>ATHON</span></h1>
                  </div>
                </div>
                <div className="print-pass-document-label">
                  <span>Official document</span>
                  <strong>Registration Receipt</strong>
                  <small>National Hackathon by SkaleKraft</small>
                </div>
              </header>

              <div className="print-pass-body">
                <div className="print-pass-status-row">
                  <div className="print-pass-status">
                    <span className="print-pass-status-dot" />
                    <div>
                      <small>Registration &amp; Payment Status</small>
                      <strong>Verified &amp; Paid (₹{event.registration_fee_inr.toFixed(2)})</strong>
                    </div>
                  </div>
                  <div className="print-pass-id">
                    <small>Registration Credential ID</small>
                    <strong>{(createdTeam?.id || '').toUpperCase()}</strong>
                  </div>
                </div>

                <section className="print-pass-intro">
                  <p>Official hackathon entry for</p>
                  <h2>{teamName}</h2>
                  <span>Authorized Engineering Squad</span>
                </section>

                <section className="print-pass-facts" aria-label="Squad details">
                  <div>
                    <small>Competition Track</small>
                    <strong>{currentTrackObj?.name || 'General Arena'}</strong>
                  </div>
                  <div>
                    <small>Team Leader</small>
                    <strong>{leaderName}</strong>
                  </div>
                  <div>
                    <small>Institution / Organization</small>
                    <strong>{collegeOrOrg || 'Independent Innovators'}</strong>
                  </div>
                  <div>
                    <small>Registered Location</small>
                    <strong>{city ? `${city}, ` : ''}{state || 'India'}</strong>
                  </div>
                </section>

                <section className="print-pass-roster">
                  <div className="print-pass-section-heading">
                    <div>
                      <small>Confirmed Squad Roster</small>
                      <h3>Registered Participants</h3>
                    </div>
                    <strong>{1 + members.length} Innovator{1 + members.length > 1 ? 's' : ''} Confirmed</strong>
                  </div>

                  <div className="print-pass-roster-grid">
                    {/* Leader */}
                    <div className="print-pass-member">
                      <span>01</span>
                      <div>
                        <strong>{leaderName}</strong>
                        <small>{leaderEmail} • {leaderPhone}</small>
                      </div>
                      <em>Team Lead</em>
                    </div>

                    {/* Additional members */}
                    {members.map((member, index) => (
                      <div className="print-pass-member" key={index}>
                        <span>{String(index + 2).padStart(2, '0')}</span>
                        <div>
                          <strong>{member.name}</strong>
                          <small>{member.email}{member.phone ? ` • ${member.phone}` : ''}</small>
                        </div>
                        <em>Member</em>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="print-pass-verification">
                  <div className="print-pass-qr">
                    {passQrCode ? (
                      <Image src={passQrCode} alt="Registration verification QR code" width={112} height={112} unoptimized />
                    ) : (
                      <span>QR</span>
                    )}
                  </div>
                  <div className="print-pass-verification-copy">
                    <small>Official Hackathon Record</small>
                    <h3>Scan to verify authorized squad credential</h3>
                    <p>
                      Official registration and payment receipt for SKALEATHON. Present this pass or your digital record with photo ID at hackathon checkpoints.
                    </p>
                    <div>
                      <span>Issued Date <strong>{new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                      <span>Payment Ref <strong>{paymentResult?.paymentId || paymentOrder?.orderId || 'SETTLED_RZP'}</strong></span>
                      <span>Amount Paid <strong>₹{event.registration_fee_inr.toFixed(2)} INR</strong></span>
                    </div>
                  </div>
                </section>
              </div>

              <footer className="print-pass-footer">
                <div>
                  <strong>SKALEKRAFT</strong>
                  <span>Build. Innovate. Scale.</span>
                </div>
                <p>System-generated official receipt · Authorized digital seal · skaleathon.skalekraft.in</p>
              </footer>
            </div>
          </article>

          {/* On-Screen Luxury Dark Editorial Receipt Card */}
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Confirmation Banner */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Entry // Hackathon Pass Issued</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Registration Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Congratulations! Team <strong className="text-white">{teamName}</strong> is officially entered into{' '}
                <span className="text-[#e8c5b4] font-medium">{event.name}</span> in the{' '}
                <strong className="text-white">{currentTrackObj?.name}</strong> arena.
              </p>
            </div>

            {/* Luxury Editorial Voucher Card */}
            <div className="rounded-3xl border border-[#c19a88]/30 bg-gradient-to-b from-[#181615] via-[#121110] to-[#0A0A0A] p-6 sm:p-8 relative overflow-hidden shadow-2xl shadow-black/80 space-y-6">
              {/* Top hairline gold gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c19a88] to-transparent opacity-90" />
              
              {/* Ambient radial glow */}
              <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-[#c19a88]/10 blur-[90px]" />

              {/* Receipt Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#805948] to-[#c19a88] p-[1px] shadow-lg shrink-0">
                    <div className="h-full w-full rounded-[11px] bg-black/80 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-[#e8c5b4]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#c19a88] font-mono block">
                      SkaleKraft Official Receipt
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {teamName}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    VERIFIED PAID
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Particulars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs relative z-10">
                <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Registration ID
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-white truncate text-xs" title={createdTeam?.id}>
                      {createdTeam?.id ? (createdTeam.id.length > 18 ? `${createdTeam.id.substring(0, 14)}...` : createdTeam.id) : 'PENDING'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (createdTeam?.id) {
                          navigator.clipboard.writeText(createdTeam.id);
                          setCopiedPassId(true);
                          setTimeout(() => setCopiedPassId(false), 2000);
                        }
                      }}
                      className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Full ID"
                    >
                      {copiedPassId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Track Arena
                  </span>
                  <span className="font-semibold text-[#e8c5b4] block truncate">
                    {currentTrackObj?.name || 'Assigned Track'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Team Leader
                  </span>
                  <span className="font-semibold text-white block truncate">
                    {leaderName}
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    {leaderPhone}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Total Settled
                  </span>
                  <span className="font-extrabold text-[#c19a88] text-sm block">
                    ₹{event.registration_fee_inr.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate font-mono">
                    {paymentResult?.paymentId ? `ID: ${paymentResult.paymentId.substring(0, 12)}...` : 'Flat Per Team'}
                  </span>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className="relative py-1">
                <div className="absolute -left-10 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#0A0A0A] border-r border-[#c19a88]/30 pointer-events-none" />
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#0A0A0A] border-l border-[#c19a88]/30 pointer-events-none" />
                <div className="border-t border-dashed border-white/10 w-full" />
              </div>

              {/* Squad Roster Breakdown */}
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#c19a88]" />
                    Registered Squad Roster ({1 + members.length} Innovator{1 + members.length > 1 ? 's' : ''})
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {collegeOrOrg || city || 'Independent Innovators'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Leader entry */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#805948]/30 bg-[#805948]/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-[#c19a88]">01</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate text-xs">{leaderName}</p>
                        <p className="text-[10px] text-neutral-400 truncate">{leaderEmail}</p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider bg-[#805948]/30 text-[#e8c5b4] px-2 py-0.5 rounded-full shrink-0 border border-[#c19a88]/20">
                      Leader
                    </span>
                  </div>

                  {/* Additional members */}
                  {members.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-xs text-neutral-500">{String(idx + 2).padStart(2, '0')}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-200 truncate text-xs">{m.name}</p>
                          <p className="text-[10px] text-neutral-400 truncate">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-400 px-2 py-0.5 rounded-full shrink-0">
                        Member
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Security Card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-white/10 bg-black/40 text-xs relative z-10">
                <div className="h-24 w-24 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-[#c19a88]/30 shadow-md">
                  {passQrCode ? (
                    <Image src={passQrCode} alt="Team QR Pass" width={84} height={84} unoptimized />
                  ) : (
                    <div className="h-full w-full bg-neutral-900 rounded flex items-center justify-center text-[10px] font-mono text-neutral-500">
                      QR PASS
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c19a88] block font-bold">
                    Official Hackathon Credential
                  </span>
                  <p className="text-neutral-300 font-medium text-xs leading-relaxed">
                    Present this verified digital receipt or printed pass at hackathon checkpoints.
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Order: {paymentResult?.orderId || paymentOrder?.orderId || 'Verified Settled'} • No physical ticket required
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#805948] via-[#c19a88] to-[#e8c5b4] hover:brightness-110 px-8 py-3.5 text-xs font-bold text-black shadow-lg shadow-[#805948]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Go to Team Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#c19a88]/30 bg-[#c19a88]/10 hover:bg-[#c19a88]/20 px-7 py-3.5 text-xs font-semibold text-[#e8c5b4] hover:text-white transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Printer className="h-4 w-4 text-[#c19a88]" />
                <span>Print Registration Receipt</span>
              </button>
            </div>

            <PrintPassModal
              isOpen={isPrintModalOpen}
              onClose={() => setIsPrintModalOpen(false)}
              teamId={createdTeam?.id || 'SK27-TEAM'}
              teamName={teamName}
              trackName={currentTrackObj?.name}
              leaderName={leaderName}
              leaderEmail={leaderEmail}
              membersCount={1 + members.length}
              paymentRef={paymentResult?.paymentId || paymentOrder?.orderId || 'SETTLED_RZP'}
              qrCode={passQrCode}
            />
          </div>
        </>
      )}
    </div>
  );
}
