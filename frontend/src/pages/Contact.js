import React, { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { Reveal } from "@/components/Reveal";
import { MagneticButton } from "@/components/MagneticButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NextSteps } from "@/components/NextSteps";
import { PopIllustration } from "@/components/PopIllustration";
import { useRevealObserver } from "@/lib/motion";
import { submitContact, track } from "@/lib/api";

const STAGES = ["Idea", "Early", "Growing", "Scaling", "Established", "Turnaround"];
const RANGES = ["Under ₹2L", "₹2–10L", "₹10–50L", "₹50L+", "Let's discuss"];
const TIMELINES = ["Yesterday", "This month", "This quarter", "Exploring"];

const FieldLabel = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="sys-chip mb-2 block text-[#232A2A]/65">
    {children} {required && <span className="text-[#E54A25]">*</span>}
  </label>
);

export default function Contact() {
  const ref = useRevealObserver();
  const startedRef = useRef(false);
  const [form, setForm] = useState({ name: "", company: "", role: "", website: "", message: "", stage: "", investmentRange: "", timeline: "", email: "", phone: "", orgField: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const started = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      track("contact_started");
    }
  };

  const set = (k) => (e) => {
    started();
    setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name || form.name.trim().length < 2) er.name = "A name helps. Even a nickname works.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "That email looks off. One more try?";
    if (!form.message || form.message.trim().length < 10) er.message = "Give us a little more — ten characters of chaos minimum.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const first = document.querySelector("[data-error='true']");
      if (first) first.focus();
      return;
    }
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ""));
      await submitContact(payload);
      setSuccess(true);
      track("contact_completed");
    } catch (err) {
      const msg = err?.response?.status === 429 ? "Too many messages in a row. Give it a few minutes — we are not going anywhere." : "That didn't send. The irony is not lost on us. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div ref={ref} className="pt-[84px]" data-testid="contact-page">
      <Seo title="Say Hi — hiAnzy" description="Tell us what you are building, what feels stuck, what changed, or what opportunity refuses to leave your head. A person will read it." />
      <section className="container-page section-pad">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal as="p" className="sys-chip flex items-center gap-3 text-[#232A2A]/60">
              <span className="inline-block h-[3px] w-10 rounded-full bg-[#F19020]" /> CONTACT
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display mt-5 leading-[0.92] text-[#232A2A] text-[clamp(3.4rem,7vw,6.4rem)]" data-testid="contact-h1">
                Say Hi<span className="text-[#E54A25]">.</span>
              </h1>
            </Reveal>
            <Reveal delay={160} as="p" className="mt-6 max-w-md text-base leading-relaxed text-[#232A2A]/85">
              You do not need to know the solution. Tell us what you are building, what feels stuck, what changed,
              what gets delayed, what costs too much, or what opportunity refuses to leave your head.
            </Reveal>
            <Reveal delay={220} as="p" className="font-mono-sys mt-5 text-[13px] leading-relaxed text-[#232A2A]/55">Attachments? Mention them in the message and we will ask for a link. Simple systems first.
            </Reveal>
            <Reveal delay={280}>
              <figure className="float-el mt-10 hidden max-w-[250px] lg:block" style={{ "--rot": "-1.5deg" }} data-testid="contact-walkers-art">
                <div className="scrap">
                  <img src="/brand/char-walkers.jpg" alt="Two camera-headed figures walking in — halftone collage" loading="lazy" />
                </div>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            {success ? (
              <div className="panel-dark relative overflow-hidden p-10 sm:p-14" data-testid="contact-form-success-message" role="status">
                <div className="h-[4px] w-24 rounded-full bg-[#F19020]" />
                <p className="font-display mt-6 text-5xl leading-none text-[#F7F5EE]">Got it.</p>
                <p className="mt-4 max-w-md text-lg text-[#F7F5EE]/85">A person will read this. Still one of our favourite technologies.</p>
                <p className="font-mono-sys mt-6 text-[12.5px] text-[#F7F5EE]/45">Expect a reply from a human, not a sequence.</p>
                <MagneticButton to="/work" className="btn-orange mt-8" testId="contact-success-work-link">
                  Read some proof meanwhile <ArrowRight size={15} />
                </MagneticButton>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="panel-paper p-7 sm:p-10" data-testid="contact-form">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="cf-name" required>NAME</FieldLabel>
                    <Input id="cf-name" data-testid="contact-form-field-name" data-error={!!errors.name} value={form.name} onChange={set("name")} placeholder="Who's asking?" aria-invalid={!!errors.name} aria-describedby={errors.name ? "cf-name-err" : undefined} className="h-11 border-[#232A2A]/30 bg-[#F7F5EE]" />
                    {errors.name && <p id="cf-name-err" role="alert" data-testid="contact-form-error-name" className="mt-1.5 text-[12px] font-semibold text-[#E54A25]">{errors.name}</p>}
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-email" required>EMAIL</FieldLabel>
                    <Input id="cf-email" type="email" data-testid="contact-form-field-email" data-error={!!errors.email} value={form.email} onChange={set("email")} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "cf-email-err" : undefined} className="h-11 border-[#232A2A]/30 bg-[#F7F5EE]" />
                    {errors.email && <p id="cf-email-err" role="alert" data-testid="contact-form-error-email" className="mt-1.5 text-[12px] font-semibold text-[#E54A25]">{errors.email}</p>}
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-company">COMPANY</FieldLabel>
                    <Input id="cf-company" data-testid="contact-form-field-company" value={form.company} onChange={set("company")} placeholder="Or the idea's working title" className="h-11 border-[#232A2A]/30 bg-[#F7F5EE]" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-role">ROLE</FieldLabel>
                    <Input id="cf-role" data-testid="contact-form-field-role" value={form.role} onChange={set("role")} placeholder="Founder, CMO, the person who noticed" className="h-11 border-[#232A2A]/30 bg-[#F7F5EE]" />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="cf-website">WEBSITE</FieldLabel>
                    <Input id="cf-website" data-testid="contact-form-field-website" value={form.website} onChange={set("website")} placeholder="https:// — if it exists yet" className="h-11 border-[#232A2A]/30 bg-[#F7F5EE]" />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel htmlFor="cf-message" required>WHAT IS GOING ON?</FieldLabel>
                    <Textarea id="cf-message" rows={6} data-testid="contact-form-field-message" data-error={!!errors.message} value={form.message} onChange={set("message")} placeholder="Messy is fine. Screenshots-described-in-words is fine. 'Something feels off' is a perfectly good brief." aria-invalid={!!errors.message} aria-describedby={errors.message ? "cf-message-err" : undefined} className="border-[#232A2A]/30 bg-[#F7F5EE]" />
                    {errors.message && <p id="cf-message-err" role="alert" data-testid="contact-form-error-message" className="mt-1.5 text-[12px] font-semibold text-[#E54A25]">{errors.message}</p>}
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-stage">CURRENT STAGE</FieldLabel>
                    <select id="cf-stage" data-testid="contact-form-field-stage" className="select-native" value={form.stage} onChange={(e) => { started(); setForm((f) => ({ ...f, stage: e.target.value })); }}>
                      <option value="">Pick one</option>
                      {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-range">INVESTMENT RANGE</FieldLabel>
                    <select id="cf-range" data-testid="contact-form-field-investment" className="select-native" value={form.investmentRange} onChange={(e) => { started(); setForm((f) => ({ ...f, investmentRange: e.target.value })); }}>
                      <option value="">Roughly</option>
                      {RANGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-timeline">TIMELINE</FieldLabel>
                    <select id="cf-timeline" data-testid="contact-form-field-timeline" className="select-native" value={form.timeline} onChange={(e) => { started(); setForm((f) => ({ ...f, timeline: e.target.value })); }}>
                      <option value="">Honestly</option>
                      {TIMELINES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel htmlFor="cf-phone">PHONE (OPTIONAL)</FieldLabel>
                    <Input id="cf-phone" data-testid="contact-form-field-phone" value={form.phone} onChange={set("phone")} placeholder="If calls are your thing" className="h-11 border-[#232A2A]/30 bg-[#F7F5EE]" />
                  </div>
                  {/* honeypot — humans never see or fill this */}
                  <div className="absolute -left-[9999px] top-auto" aria-hidden="true">
                    <label htmlFor="cf-org">Organisation field</label>
                    <input id="cf-org" tabIndex={-1} autoComplete="off" value={form.orgField} onChange={(e) => setForm((f) => ({ ...f, orgField: e.target.value }))} />
                  </div>
                </div>
                <div className="relative mt-8 flex flex-wrap items-center gap-5">
                  <PopIllustration
                    src="/brand/pop-white-flag.png"
                    width={120}
                    rotate={3}
                    drift={14}
                    halo={false}
                    className="absolute -top-14 right-0"
                    testId="pop-contact"
                  />
                  <MagneticButton type="submit" className="btn-ink" testId="contact-form-submit-button">
                    {submitting ? "Sending…" : "Send It"} <ArrowRight size={15} />
                  </MagneticButton>
                  <p className="font-mono-sys text-[12.5px] text-[#232A2A]/50">Read by a person. Replied to by the same person.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      <NextSteps from="/contact" />
    </div>
  );
}
