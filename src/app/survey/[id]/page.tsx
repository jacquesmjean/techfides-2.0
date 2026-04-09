'use client';

import React, { useState } from 'react';

interface SurveyData {
  projectDelivery: number;
  technicalAccuracy: number;
  easeOfImplementation: number;
  communication: number;
  problemSolving: number;
  systemEasiness: number;
  nps: number;
  testimonial: string;
  improvement: string;
  consentTestimonial: boolean;
  consentLogo: boolean;
  consentSocial: boolean;
  consentVideo: boolean;
  consentCaseStudy: boolean;
  referralName: string;
  referralEmail: string;
  referralCompany: string;
}

const ScoreQuestion = ({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: number;
  onChange: (val: number) => void;
}) => {
  const getScoreColor = (score: number) => {
    if (score === 0) return 'bg-slate-700';
    if (score <= 3) return 'bg-red-600';
    if (score <= 6) return 'bg-amber-600';
    if (score <= 8) return 'bg-lime-600';
    return 'bg-green-600';
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(i + 1)}
              className={`h-8 w-8 rounded-full transition-all ${
                value >= i + 1
                  ? getScoreColor(i + 1)
                  : 'bg-slate-800 hover:bg-slate-700'
              } border border-slate-700 hover:border-slate-600`}
              aria-label={`Score ${i + 1}`}
            />
          ))}
        </div>
        {value > 0 && (
          <span className="ml-4 text-lg font-semibold text-slate-200">{value}</span>
        )}
      </div>
    </div>
  );
};

const NPSButton = ({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) => {
  let bgColor = 'bg-slate-800 hover:bg-slate-700';
  let textColor = 'text-slate-300';

  if (selected) {
    if (value <= 6) {
      bgColor = 'bg-red-600';
      textColor = 'text-white';
    } else if (value <= 8) {
      bgColor = 'bg-amber-600';
      textColor = 'text-white';
    } else {
      bgColor = 'bg-green-600';
      textColor = 'text-white';
    }
  }

  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 rounded-lg border border-slate-700 font-semibold transition-all ${bgColor} ${textColor}`}
    >
      {value}
    </button>
  );
};

const ToggleSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) => {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-electric-500' : 'bg-slate-700'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
};

const StepProgressBar = ({ current, total }: { current: number; total: number }) => {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`h-2 w-2 rounded-full transition-all ${
              i < current ? 'w-6 bg-electric-500' : 'bg-slate-700'
            }`}
          />
          {i < total - 1 && (
            <div
              className={`h-0.5 w-6 transition-all ${
                i < current - 1 ? 'bg-electric-500' : 'bg-slate-700'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AnimatedCheckmark = () => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative h-24 w-24">
        <svg
          className="h-full w-full animate-pulse"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" stroke="#22c55e" strokeWidth="2" />
          <path
            d="M 35 50 L 45 60 L 65 40"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray="40"
            strokeDashoffset="40"
            style={{
              animation: 'dash 0.8s ease-in-out 0.3s forwards',
            }}
          />
        </svg>
        <style>{`
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

const ConsentRow = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
    <div className="flex-1">
      <h4 className="font-medium text-slate-100">{label}</h4>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
    <ToggleSwitch enabled={enabled} onChange={onChange} />
  </div>
);

export default function SurveyPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SurveyData>({
    projectDelivery: 0,
    technicalAccuracy: 0,
    easeOfImplementation: 0,
    communication: 0,
    problemSolving: 0,
    systemEasiness: 0,
    nps: -1,
    testimonial: '',
    improvement: '',
    consentTestimonial: false,
    consentLogo: false,
    consentSocial: false,
    consentVideo: false,
    consentCaseStudy: false,
    referralName: '',
    referralEmail: '',
    referralCompany: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Service-aware lead data lookup by survey/lead ID
  // In production, fetch from API using params.id
  const LEAD_DATABASE: Record<string, { name: string; company: string; service: string }> = {
    // Sovereign AI clients
    'lead-001': { name: 'Sarah Mitchell', company: 'Mitchell & Associates Law Firm', service: 'Sovereign AI' },
    'lead-002': { name: 'Dr. Michael Chen', company: 'BrightSmile Dental Group', service: 'Sovereign AI' },
    'lead-003': { name: 'Marcus Johnson', company: 'Johnson HVAC & Plumbing', service: 'Sovereign AI' },
    'lead-004': { name: 'Angela Torres', company: 'Texas AutoPlex', service: 'Sovereign AI' },
    // Transformation Management
    'lead-005': { name: 'Robert Williams', company: 'Premier Properties Management', service: 'Transformation Management' },
    // AI Readiness 360™
    'lead-006': { name: 'Lisa Park', company: 'Park Family Law', service: 'AI Readiness 360™' },
    // TEDOS™
    'lead-007': { name: 'David Ramirez', company: 'Ramirez Electrical Services', service: 'TEDOS™' },
    // Demo / default
    'demo': { name: 'David Ramirez', company: 'Ramirez Electrical Services', service: 'TEDOS™' },
  };

  const leadData = LEAD_DATABASE[params.id] || {
    name: 'Valued Client',
    company: 'Your Company',
    service: 'TechFides Service',
  };

  const handleScoreChange = (field: keyof SurveyData, value: number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConsentChange = (field: keyof SurveyData, value: boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTextChange = (field: keyof SurveyData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedToStep3 = () => {
    return (
      data.projectDelivery > 0 &&
      data.technicalAccuracy > 0 &&
      data.easeOfImplementation > 0 &&
      data.communication > 0 &&
      data.problemSolving > 0 &&
      data.systemEasiness > 0
    );
  };

  const getNPSLabel = () => {
    if (data.nps <= 6) return 'Detractor';
    if (data.nps <= 8) return 'Passive';
    return 'Promoter';
  };

  const getAverageScore = () => {
    const scores = [
      data.projectDelivery,
      data.technicalAccuracy,
      data.easeOfImplementation,
      data.communication,
      data.problemSolving,
      data.systemEasiness,
    ];
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / 6);
  };

  const handleSubmit = () => {
    // In production, send to backend
    console.log('Survey submitted:', data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <AnimatedCheckmark />

          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100">
              Thank you, {leadData.name}!
            </h1>
            <p className="mt-3 text-slate-400">
              Your feedback has been recorded.
            </p>

            <div className="mt-12 rounded-lg border border-slate-800 bg-slate-900 p-8">
              <p className="text-sm uppercase tracking-widest text-slate-500">
                Your Average Score
              </p>
              <div className="mt-4 flex items-center justify-center">
                <div className="relative h-32 w-32">
                  <svg
                    className="h-full w-full transform -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="#334155"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      stroke="#0ea5e9"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(getAverageScore() / 10) * 339.3} 339.3`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-electric-400">
                      {getAverageScore()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3 text-left">
                {data.consentTestimonial &&
                  data.consentLogo &&
                  data.consentSocial &&
                  data.consentVideo &&
                  data.consentCaseStudy && (
                    <p className="rounded-lg bg-green-500/10 p-4 text-sm text-green-400">
                      Your success story will help more businesses own their AI.
                    </p>
                  )}
                {(data.referralName || data.referralEmail || data.referralCompany) && (
                  <p className="rounded-lg bg-electric-500/10 p-4 text-sm text-electric-400">
                    Thanks for the referral! We&apos;ll reach out to{" "}
                    <strong>{data.referralName}</strong> personally.
                  </p>
                )}
                <p className="rounded-lg bg-amber-500/10 p-4 text-sm text-amber-400">
                  A $250 Success Credit has been applied to your account.
                </p>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-800 pt-8">
              <p className="text-lg font-semibold text-slate-200">TechFides</p>
              <p className="mt-2 text-sm text-slate-400">Own Your AI</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        {/* TechFides mini header */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-slate-950">T</div>
          <span className="text-lg font-bold text-slate-100">TechFides</span>
          <span className="text-xs text-slate-500">|</span>
          <span className="text-xs text-slate-400">Post-Project Survey</span>
        </div>
        <StepProgressBar current={step} total={5} />

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-100">TechFides</h1>
              <p className="mt-1 text-sm text-slate-400">Own Your AI</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-100">
                Thank you for choosing TechFides
              </h2>

              <div className="mt-6 space-y-2">
                <p className="text-lg font-semibold text-electric-400">
                  {leadData.name}
                </p>
                <p className="text-slate-400">{leadData.company}</p>
                <p className="text-sm text-slate-500">{leadData.service}</p>
              </div>

              <p className="mt-8 text-slate-300">
                Your feedback powers our improvement and helps other businesses
                discover sovereign AI.
              </p>

              <p className="mt-4 text-xs text-slate-500">
                Takes about 3 minutes
              </p>

              <button
                onClick={() => setStep(2)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-electric-500 px-6 py-3 font-semibold text-white transition-all hover:bg-electric-600 hover:shadow-lg hover:shadow-electric-500/20"
              >
                Begin Survey
                <span className="text-lg">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Performance & Velocity Scores */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-100">
                How did we deliver?
              </h2>
              <p className="mt-2 text-slate-400">
                Rate your experience on each dimension
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <div className="space-y-8">
                <ScoreQuestion
                  title="Project Delivery"
                  description="Was the project completed on time and to spec?"
                  value={data.projectDelivery}
                  onChange={(val) =>
                    handleScoreChange('projectDelivery', val)
                  }
                />
                <div className="border-t border-slate-800" />

                <ScoreQuestion
                  title="Technical Accuracy"
                  description="Was the AI system configured correctly for your needs?"
                  value={data.technicalAccuracy}
                  onChange={(val) =>
                    handleScoreChange('technicalAccuracy', val)
                  }
                />
                <div className="border-t border-slate-800" />

                <ScoreQuestion
                  title="Ease of Implementation"
                  description="How smooth was the installation and setup process?"
                  value={data.easeOfImplementation}
                  onChange={(val) =>
                    handleScoreChange('easeOfImplementation', val)
                  }
                />
                <div className="border-t border-slate-800" />

                <ScoreQuestion
                  title="Communication"
                  description="How well did the TechFides team keep you informed?"
                  value={data.communication}
                  onChange={(val) =>
                    handleScoreChange('communication', val)
                  }
                />
                <div className="border-t border-slate-800" />

                <ScoreQuestion
                  title="Problem Solving"
                  description="How effectively did we handle any issues that arose?"
                  value={data.problemSolving}
                  onChange={(val) =>
                    handleScoreChange('problemSolving', val)
                  }
                />
                <div className="border-t border-slate-800" />

                <ScoreQuestion
                  title="System Easiness (UI/UX)"
                  description="How easy is your AI system to use day-to-day?"
                  value={data.systemEasiness}
                  onChange={(val) =>
                    handleScoreChange('systemEasiness', val)
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceedToStep3()}
                className="flex-1 rounded-lg bg-electric-500 px-6 py-3 font-medium text-white transition-all hover:bg-electric-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience & NPS */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-100">
                Your experience matters
              </h2>
              <p className="mt-2 text-slate-400">
                Help us understand your journey
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 space-y-8">
              {/* NPS Question */}
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  How likely are you to recommend TechFides to a colleague?
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  On a scale of 0 (not at all likely) to 10 (extremely likely)
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <NPSButton
                      key={i}
                      value={i}
                      selected={data.nps === i}
                      onClick={() =>
                        handleScoreChange('nps', i)
                      }
                    />
                  ))}
                </div>

                {data.nps >= 0 && (
                  <div className="mt-4 inline-block rounded-lg bg-slate-800/50 px-4 py-2 text-sm font-semibold">
                    <span
                      className={`${
                        data.nps <= 6
                          ? 'text-red-400'
                          : data.nps <= 8
                            ? 'text-amber-400'
                            : 'text-green-400'
                      }`}
                    >
                      {getNPSLabel()}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800" />

              {/* Testimonial */}
              <div>
                <label className="block font-semibold text-slate-100">
                  Tell us about your experience with TechFides
                </label>
                <textarea
                  value={data.testimonial}
                  onChange={(e) =>
                    handleTextChange('testimonial', e.target.value)
                  }
                  placeholder="What impact has your sovereign AI system had on your business?"
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 transition-all focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  rows={4}
                />
              </div>

              <div className="border-t border-slate-800" />

              {/* Improvement */}
              <div>
                <label className="block font-semibold text-slate-100">
                  What could we do better?
                </label>
                <textarea
                  value={data.improvement}
                  onChange={(e) =>
                    handleTextChange('improvement', e.target.value)
                  }
                  placeholder="Any suggestions for improvement?"
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 transition-all focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={data.nps < 0}
                className="flex-1 rounded-lg bg-electric-500 px-6 py-3 font-medium text-white transition-all hover:bg-electric-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Social Proof & Consent */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-100">
                Help us spread the word
              </h2>
              <p className="mt-2 text-slate-400">
                Your success story can help other businesses discover sovereign
                AI. All sharing is optional.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 space-y-4">
              <ConsentRow
                label="Publish my testimonial on techfides.com"
                description="Share your feedback publicly to help other businesses"
                enabled={data.consentTestimonial}
                onChange={(val) =>
                  handleConsentChange('consentTestimonial', val)
                }
              />
              <ConsentRow
                label="Use my company logo in marketing materials"
                description="Feature your business in our case studies and resources"
                enabled={data.consentLogo}
                onChange={(val) => handleConsentChange('consentLogo', val)}
              />
              <ConsentRow
                label="Share my success on social media (LinkedIn, X)"
                description="Highlight your achievement across our social channels"
                enabled={data.consentSocial}
                onChange={(val) => handleConsentChange('consentSocial', val)}
              />
              <ConsentRow
                label="Participate in a video testimonial"
                description="Record a short video sharing your TechFides experience"
                enabled={data.consentVideo}
                onChange={(val) => handleConsentChange('consentVideo', val)}
              />
              <ConsentRow
                label="Feature my business in a TechFides case study"
                description="Become a featured customer in our in-depth case study"
                enabled={data.consentCaseStudy}
                onChange={(val) =>
                  handleConsentChange('consentCaseStudy', val)
                }
              />
            </div>

            {/* Conditional: Referral Section */}
            {data.nps >= 9 && (
              <div className="rounded-2xl border border-electric-500/30 bg-electric-500/5 p-8">
                <h3 className="text-lg font-bold text-slate-100">
                  You&apos;re a TechFides Champion!
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Know someone who could benefit from sovereign AI?
                </p>

                <div className="mt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Referral name"
                    value={data.referralName}
                    onChange={(e) =>
                      handleTextChange('referralName', e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                  <input
                    type="email"
                    placeholder="Referral email"
                    value={data.referralEmail}
                    onChange={(e) =>
                      handleTextChange('referralEmail', e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                  <input
                    type="text"
                    placeholder="Referral company"
                    value={data.referralCompany}
                    onChange={(e) =>
                      handleTextChange('referralCompany', e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 transition-all focus:border-electric-500 focus:outline-none focus:ring-1 focus:ring-electric-500"
                  />
                  <p className="text-xs text-slate-500">
                    We&apos;ll reach out personally — no spam, ever.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 rounded-lg bg-electric-500 px-6 py-3 font-medium text-white transition-all hover:bg-electric-600"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Completion */}
        {step === 5 && (
          <div className="space-y-8">
            <button
              onClick={handleSubmit}
              className="w-full rounded-lg bg-electric-500 px-6 py-3 font-medium text-white transition-all hover:bg-electric-600"
            >
              Submit Survey
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(4)}
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
