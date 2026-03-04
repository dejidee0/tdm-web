// components/shared/dashboard/profile/security.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
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

// ── Password Change – 3 steps ────────────────────────────────────────────────
const PASS_STEPS = {
  idle: "idle",
  otp_sent: "otp_sent",
  otp_verified: "otp_verified",
  done: "done",
};

export default function Security() {
  const { data: securityData, isLoading: secLoading } = useSecurity();
  const requestOtp = useRequestPasswordOtp();
  const verifyOtp = useVerifyPasswordOtp();
  const changePassword = useChangePassword();
  const update2fa = useUpdate2fa();
  const deactivate = useDeactivateAccount();
  const logout = useLogout();

  // Password flow
  const [passStep, setPassStep] = useState(PASS_STEPS.idle);
  const [currentPassword, setCurrentPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Deactivate
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const twoFaEnabled =
    securityData?.twoFactorEnabled ?? securityData?.is2faEnabled ?? false;

  // Step 1: request OTP
  const handleRequestOtp = () => {
    if (!currentPassword) return;
    requestOtp.mutate(currentPassword, {
      onSuccess: () => {
        setPassStep(PASS_STEPS.otp_sent);
        showToast.success({
          title: "OTP Sent",
          message: "Check your email for the verification code.",
        });
      },
      onError: (err) =>
        showToast.error({ title: "Error", message: err.message }),
    });
  };

  // Step 2: verify OTP
  const handleVerifyOtp = () => {
    if (!otpCode) return;
    verifyOtp.mutate(otpCode, {
      onSuccess: () => {
        setPassStep(PASS_STEPS.otp_verified);
        showToast.success({
          title: "Verified",
          message: "OTP verified. Set your new password.",
        });
      },
      onError: (err) =>
        showToast.error({ title: "Invalid OTP", message: err.message }),
    });
  };

  // Step 3: change password
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast.error({
        title: "Mismatch",
        message: "Passwords do not match.",
      });
      return;
    }
    changePassword.mutate(
      { currentPassword, newPassword, confirmNewPassword: confirmPassword },
      {
        onSuccess: () => {
          showToast.success({
            title: "Password Changed",
            message: "Your password has been updated.",
          });
          setPassStep(PASS_STEPS.done);
          setCurrentPassword("");
          setOtpCode("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => setPassStep(PASS_STEPS.idle), 2000);
        },
        onError: (err) =>
          showToast.error({ title: "Error", message: err.message }),
      },
    );
  };

  const resetPasswordFlow = () => {
    setPassStep(PASS_STEPS.idle);
    setCurrentPassword("");
    setOtpCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // 2FA toggle
  const handle2faToggle = () => {
    update2fa.mutate(!twoFaEnabled, {
      onSuccess: () =>
        showToast.success({
          title: twoFaEnabled ? "2FA Disabled" : "2FA Enabled",
          message: twoFaEnabled
            ? "Two-factor authentication has been turned off."
            : "Two-factor authentication is now active.",
        }),
      onError: (err) =>
        showToast.error({ title: "Error", message: err.message }),
    });
  };

  // Deactivate account
  const handleDeactivate = () => {
    deactivate.mutate(undefined, {
      onSuccess: () => {
        showToast.success({
          title: "Account Deactivated",
          message: "Your account has been deactivated.",
        });
        logout.mutate();
      },
      onError: (err) =>
        showToast.error({ title: "Error", message: err.message }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* ── Change Password ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-primary">
              Change Password
            </h2>
            <p className="text-[12px] text-[#888]">
              A verification code will be sent to your email.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 – enter current password */}
          {passStep === PASS_STEPS.idle && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                show={showCurrentPw}
                onToggle={() => setShowCurrentPw((v) => !v)}
                placeholder="Enter current password"
              />
              <button
                onClick={handleRequestOtp}
                disabled={!currentPassword || requestOtp.isPending}
                className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {requestOtp.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Send Verification Code
              </button>
            </motion.div>
          )}

          {/* Step 2 – enter OTP */}
          {passStep === PASS_STEPS.otp_sent && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-[13px] text-blue-700">
                  A 6-digit code was sent to your email. Enter it below.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-[#555]">
                  Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  className="w-full px-3 py-2.5 text-[18px] font-mono tracking-[0.4em] text-center text-primary border border-[#e5e5e5] rounded-lg bg-[#fafafa] focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={resetPasswordFlow}
                  className="px-4 py-2 text-[14px] font-medium text-[#666] border border-[#e5e5e5] rounded-lg hover:bg-[#f8f8f8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length < 4 || verifyOtp.isPending}
                  className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {verifyOtp.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Verify Code
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 – new password */}
          {passStep === PASS_STEPS.otp_verified && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-[13px] text-green-700">
                  ✓ Identity verified. Set your new password.
                </p>
              </div>
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNewPw}
                onToggle={() => setShowNewPw((v) => !v)}
                placeholder="Minimum 8 characters"
              />
              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPw}
                onToggle={() => setShowConfirmPw((v) => !v)}
                placeholder="Repeat new password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[12px] text-red-500">
                  Passwords do not match
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={resetPasswordFlow}
                  className="px-4 py-2 text-[14px] font-medium text-[#666] border border-[#e5e5e5] rounded-lg hover:bg-[#f8f8f8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={
                    !newPassword ||
                    newPassword !== confirmPassword ||
                    changePassword.isPending
                  }
                  className="flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {changePassword.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Change Password
                </button>
              </div>
            </motion.div>
          )}

          {passStep === PASS_STEPS.done && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-green-600 text-[14px] font-medium py-2"
            >
              <ShieldCheck className="w-5 h-5" /> Password changed successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Two-Factor Authentication ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-primary">
                Two-Factor Authentication
              </h2>
              <p className="text-[12px] text-[#888]">
                Add an extra layer of security to your account.
              </p>
            </div>
          </div>
          <Toggle
            enabled={twoFaEnabled}
            onToggle={handle2faToggle}
            loading={update2fa.isPending || secLoading}
          />
        </div>
        {twoFaEnabled && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
            <p className="text-[13px] text-green-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Two-factor authentication is
              active.
            </p>
          </div>
        )}
      </div>

      {/* ── Danger Zone ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-red-600">
              Danger Zone
            </h2>
            <p className="text-[12px] text-[#888]">
              Irreversible actions for your account.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/40">
          <div>
            <p className="text-[14px] font-semibold text-primary">
              Deactivate Account
            </p>
            <p className="text-[12px] text-[#888] mt-0.5">
              Your account will be disabled and you will be logged out.
            </p>
          </div>
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            className="px-4 py-2 text-[13px] font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
          >
            Deactivate
          </button>
        </div>

        {/* Confirm dialog */}
        <AnimatePresence>
          {showDeactivateConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 p-4 border-2 border-red-300 rounded-xl bg-red-50 space-y-3"
            >
              <p className="text-[14px] font-semibold text-red-700">
                Are you sure you want to deactivate?
              </p>
              <p className="text-[13px] text-[#888]">
                This action cannot be undone from this interface. Contact
                support to reactivate.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeactivateConfirm(false)}
                  className="px-4 py-2 text-[13px] font-medium text-[#666] border border-[#ddd] rounded-lg hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={deactivate.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {deactivate.isPending && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
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

// ── Reusable sub-components ───────────────────────────────────────────────────
function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-[#555]">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-3 pr-10 py-2.5 text-[14px] text-primary border border-[#e5e5e5] rounded-lg bg-[#fafafa] focus:outline-none focus:border-primary focus:bg-white transition-colors placeholder:text-[#ccc]"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-primary transition-colors"
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
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${enabled ? "bg-primary" : "bg-[#ddd]"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
}
