import { useSignIn } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import { Eye, EyeOff, LogIn, Mail, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { AuthButton, AuthTextLink } from "@/src/components/auth/AuthButton";
import { AuthField } from "@/src/components/auth/AuthField";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { PROFILE_IMAGES } from "@/src/components/profile/ProfileBackdrop";
import { navigateToDashboard } from "@/src/utils/authNavigation";

type SignInStep = "credentials" | "verify_email" | "verify_totp";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [step, setStep] = useState<SignInStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";

  const completeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setFormError(
            "Your account needs an extra setup step. Check your Clerk dashboard.",
          );
          return;
        }

        navigateToDashboard(router, decorateUrl);
      },
    });
  };

  const handleSignIn = async () => {
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Please enter your email and password.");
      return;
    }

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setFormError(error.message ?? "Invalid credentials. Please try again.");
      return;
    }

    if (signIn.status === "complete") {
      await completeSignIn();
      return;
    }

    if (
      signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor"
    ) {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "email_code",
      );
      const totpFactor = signIn.supportedSecondFactors?.find(
        (factor) => factor.strategy === "totp",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        setStep("verify_email");
        return;
      }

      if (totpFactor) {
        setStep("verify_totp");
        return;
      }

      setFormError(
        "Additional verification is required. Enable email codes in Clerk or use another sign-in method.",
      );
      return;
    }

    setFormError(
      "Sign-in could not be completed. Please check your credentials and try again.",
    );
  };

  const handleVerifyEmailCode = async () => {
    setFormError(null);

    if (!code.trim()) {
      setFormError("Enter the verification code from your email.");
      return;
    }

    const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });

    if (error) {
      setFormError(error.message ?? "Invalid code. Please try again.");
      return;
    }

    if (signIn.status === "complete") {
      await completeSignIn();
      return;
    }

    setFormError("Verification did not complete. Please try again.");
  };

  const handleVerifyTotp = async () => {
    setFormError(null);

    if (!code.trim()) {
      setFormError("Enter the code from your authenticator app.");
      return;
    }

    const { error } = await signIn.mfa.verifyTOTP({ code: code.trim() });

    if (error) {
      setFormError(error.message ?? "Invalid code. Please try again.");
      return;
    }

    if (signIn.status === "complete") {
      await completeSignIn();
      return;
    }

    setFormError("Verification did not complete. Please try again.");
  };

  const clerkError =
    errors?.fields?.identifier?.message ??
    errors?.fields?.password?.message ??
    errors?.fields?.code?.message ??
    (errors && "message" in errors ? String(errors.message) : null) ??
    formError;

  if (step === "verify_email") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <AuthLayout
          title="Verify it's you"
          subtitle="We sent a one-time code to your email. This extra step keeps your Style Sprout account secure."
          onBack={() => {
            setCode("");
            setFormError(null);
            setStep("credentials");
          }}
          imageUri={PROFILE_IMAGES.premium}
          badge="Secure sign-in"
        >
          <View className="mb-2 flex-row items-center rounded-2xl bg-cream px-4 py-3">
            <Mail size={16} color="#4A6741" />
            <Text
              className="ml-2 flex-1 text-sm font-medium text-charcoal/70"
              numberOfLines={1}
            >
              {email}
            </Text>
          </View>

          <AuthField
            label="Verification code"
            value={code}
            onChangeText={setCode}
            placeholder="6-digit code"
            keyboardType="number-pad"
            autoCapitalize="none"
            error={clerkError ?? undefined}
          />

          <AuthButton
            label="Verify & continue"
            icon={ShieldCheck}
            onPress={() => void handleVerifyEmailCode()}
            loading={isLoading}
            variant="gold"
          />

          <AuthTextLink
            prompt="Didn't get a code?"
            action="Resend email"
            onPress={() => void signIn.mfa.sendEmailCode()}
          />
        </AuthLayout>
      </KeyboardAvoidingView>
    );
  }

  if (step === "verify_totp") {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <AuthLayout
          title="Authenticator code"
          subtitle="Enter the 6-digit code from your authenticator app to finish signing in."
          onBack={() => {
            setCode("");
            setFormError(null);
            setStep("credentials");
          }}
          imageUri={PROFILE_IMAGES.premium}
          badge="Two-factor auth"
        >
          <AuthField
            label="Authenticator code"
            value={code}
            onChangeText={setCode}
            placeholder="6-digit code"
            keyboardType="number-pad"
            autoCapitalize="none"
            error={clerkError ?? undefined}
          />

          <AuthButton
            label="Verify & continue"
            icon={ShieldCheck}
            onPress={() => void handleVerifyTotp()}
            loading={isLoading}
            variant="gold"
          />
        </AuthLayout>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to access your saved outfits, premium collections, and curated SHEIN drops."
        onBack={() => router.back()}
      >
        <AuthField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors?.fields?.identifier?.message}
        />

        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          error={errors?.fields?.password?.message}
          rightElement={
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-4"
              hitSlop={8}
            >
              {showPassword ? (
                <EyeOff size={20} color="#1A1A1A55" />
              ) : (
                <Eye size={20} color="#1A1A1A55" />
              )}
            </Pressable>
          }
        />

        {clerkError ? (
          <Text className="mb-4 text-sm font-medium text-red-500">{clerkError}</Text>
        ) : null}

        <AuthButton
          label="Sign In to Style Sprout"
          icon={LogIn}
          onPress={() => void handleSignIn()}
          loading={isLoading}
          style={{ marginTop: 8 }}
        />

        <AuthTextLink
          prompt="New to Style Sprout?"
          action="Create free account"
          onPress={() => router.replace("/(auth)/sign-up" as Href)}
        />
      </AuthLayout>
    </KeyboardAvoidingView>
  );
}
