// components/shared/dashboard/profile/security.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Key, Eye, EyeOff, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  useRequestPasswordOtp,
  useVerifyPasswordOtp,
  useChangePassword,
  useSecurity,
  useUpdate2fa,
  useDeactivateAccount,
} from "@/hooks/use-profile";
import { showToast } from "@/components/shared/toast";
import { useLogout } from "@/hooks/use-auth";

const inputClass =
  "w-full px-3 py-2.5 text-[14px] text-white bg-[#1a1a1a] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all placeholder:text-white/20";

const PASS_STEPS = { idle: "idle", otp_sent: "otp_sent", otp_verified: "otp_verified", done: "done" };

export default function Security() {
  const { data: securityData, isLoading: secLoading } = useSecurity();
  const requestOtp = useRequestPasswordOtp();
  const verifyOtp = useVerifyPasswordOtp();
  const changePassword = useChangePassword();
  const update2fa = useUpdate2fa();
  const deactivate = useDeactivateAccount();
  const logout = useLogout();

  const [passStep, setPassStep] = useState(PASS_STEPS.idle);
  const [currentPassword, setCurrentPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const twoFaEnabled = securityData?.twoFactorEnabled ?? securityData?.is2faEnabled ?? false;

  const handleRequestOtp = () => {
    if (!currentPassword) return;
    requestOtp.mutate(currentPassword, {
      onSuccess: () => {
        setPassStep(PASS_STEPS.otp_sent);
        showToast.success({ title: "OTP Sent", message: "Check your email for the verification code." });
      },
      onError: (err) => showToast.error({ title: "Error", message: err.message }),
    });
  };

  const handleVerifyOtp = () => {
    if (!otpCode) return;
    verifyOtp.mutate(otpCode, {
      onSuccess: () => {
        setPassStep(PASS_STEPS.otp_verified);
        showToast.success({ title: "Verified", message: "OTP verified. Set your new password." });
      },
      onError: (err) => showToast.error({ title: "Invalid OTP", message: err.message }),
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast.error({ title: "Mismatch", message: "Passwords do not match." });
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword, confirmNewPassword: confirmPassword },
      {
        onSuccess: () => {
          showToast.success({ title: "Password Changed", message: "Your password has been updated." });
          setPassStep(PASS_STEPS.done);
          setCurrentPassword(""); setOtpCode(""); setNewPassword(""); setConfirmPassword("");
          setTimeout(() => setPassStep(PASS_STEPS.idle), 2000);
        },
        onError: (err) => showToast.error({ title: "Error", message: err.message }),
      },
    );
  };

  const resetPasswordFlow = () => {
    setPassStep(PASS_STEPS.idle);
    setCurrentPassword(""); setOtpCode(""); setNewPassword(""); setConfirmPassword("");
  };

  const handle2faToggle = () => {
    update2fa.mutate(!twoFaEnabled, {
      onSuccess: () =>
        showToast.success({
          title: twoFaEnabled ? "2FA Disabled" : "2FA Enabled",
          message: twoFaEnabled
            ? "Two-factor authentication has been turned off."
            : "Two-factor authentication is now active.",
        }),
      onError: (err) => showToast.error({ title: "Error", message: err.message }),
    });
  };

  const handleDeactivate = () => {
    deactivate.mutate(undefined, {
      onSuccess: () => {
        showToast.success({ title: "Account Deactivated", message: "Your account has been deactivated." });
        logout.mutate();
      },
      onError: (err) => showToast.error({ title: "Error", message: err.message }),
    });
  };

  const iconContainer = "w-9 h-9 rounded-lg flex items-center justify-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* ── Change Password ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/08 p-6 space-y-5" style={{ background: "#0d0b08" }}>
        <div className="flex items-center gap-3">
          <div className={iconContainer} style={{ background: "rgba(212,175,55,0.10)" }}>
            <Lock className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-white">Change Password</h2>
            <p className="text-[12px] text-white/35">A verification code will be sent to your email.</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {passStep === PASS_STEPS.idle && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <PasswordField
                label="Current Password" value={currentPassword} onChange={setCurrentPassword}
                show={showCurrentPw} onToggle={() => setShowCurrentPw((v) => !v)} placeholder="Enter current password"
              />
              <button
                onClick={handleRequestOtp}
                disabled={!currentPassword || requestOtp.isPending}
                className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
              >
                {requestOtp.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Verification Code
              </button>
            </motion.div>
          )}

          {/* Step 2 */}
          {passStep === PASS_STEPS.otp_sent && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div
                className="p-3 rounded-lg text-[13px] text-blue-300"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.20)" }}
              >
                A 6-digit code was sent to your email. Enter it below.
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-white/40 uppercase tracking-widest">Verification Code</label>
                <input
                  type="text" inputMode="numeric" maxLength={6} value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-3 py-2.5 text-[18px] font-mono tracking-[0.4em] text-center text-white bg-[#1a1a1a] border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={resetPasswordFlow} className="px-4 py-2 text-[14px] font-medium text-white/50 border border-white/10 rounded-lg hover:bg-white/05 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length < 4 || verifyOtp.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                >
                  {verifyOtp.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Verify Code
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 */}
          {passStep === PASS_STEPS.otp_verified && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div
                className="p-3 rounded-lg text-[13px] text-green-400"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.20)" }}
              >
                ✓ Identity verified. Set your new password.
              </div>
              <PasswordField
                label="New Password" value={newPassword} onChange={setNewPassword}
                show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} placeholder="Minimum 8 characters"
              />
              <PasswordField
                label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword}
                show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} placeholder="Repeat new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[12px] text-red-400">Passwords do not match</p>
              )}
              <div className="flex gap-3">
                <button onClick={resetPasswordFlow} className="px-4 py-2 text-[14px] font-medium text-white/50 border border-white/10 rounded-lg hover:bg-white/05 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={!newPassword || newPassword !== confirmPassword || changePassword.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" }}
                >
                  {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Change Password
                </button>
              </div>
            </motion.div>
          )}

          {passStep === PASS_STEPS.done && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-400 text-[14px] font-medium py-2">
              <ShieldCheck className="w-5 h-5" /> Password changed successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Two-Factor Authentication ─────────────────────────────── */}
      <div className="rounded-2xl border border-white/08 p-6" style={{ background: "#0d0b08" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={iconContainer} style={{ background: "rgba(212,175,55,0.10)" }}>
              <Key className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-white">Two-Factor Authentication</h2>
              <p className="text-[12px] text-white/35">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <Toggle enabled={twoFaEnabled} onToggle={handle2faToggle} loading={update2fa.isPending || secLoading} />
        </div>
        {twoFaEnabled && (
          <div
            className="mt-4 p-3 rounded-lg text-[13px] text-green-400 flex items-center gap-2"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.20)" }}
          >
            <ShieldCheck className="w-4 h-4" /> Two-factor authentication is active.
          </div>
        )}
      </div>

      {/* ── Danger Zone ───────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#0d0b08", border: "1px solid rgba(239,68,68,0.20)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={iconContainer} style={{ background: "rgba(239,68,68,0.10)" }}>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-red-400">Danger Zone</h2>
            <p className="text-[12px] text-white/35">Irreversible actions for your account.</p>
          </div>
        </div>

        <div
          className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <div>
            <p className="text-[14px] font-semibold text-white">Deactivate Account</p>
            <p className="text-[12px] text-white/35 mt-0.5">Your account will be disabled and you will be logged out.</p>
          </div>
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            className="px-4 py-2 text-[13px] font-medium text-red-400 rounded-lg hover:bg-red-900/20 transition-colors"
            style={{ border: "1px solid rgba(239,68,68,0.30)" }}
          >
            Deactivate
          </button>
        </div>

        <AnimatePresence>
          {showDeactivateConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 p-4 rounded-xl space-y-3"
              style={{ background: "rgba(239,68,68,0.08)", border: "2px solid rgba(239,68,68,0.30)" }}
            >
              <p className="text-[14px] font-semibold text-red-400">Are you sure you want to deactivate?</p>
              <p className="text-[13px] text-white/40">This action cannot be undone from this interface. Contact support to reactivate.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="px-4 py-2 text-[13px] font-medium text-white/50 border border-white/10 rounded-lg hover:bg-white/05 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={deactivate.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deactivate.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Yes, Deactivate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-white/40 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pr-10`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function Toggle({ enabled, onToggle, loading }) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50"
      style={{ background: enabled ? "linear-gradient(135deg, #D4AF37 0%, #b8962e 100%)" : "rgba(255,255,255,0.12)" }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}
