import { useSignUp } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import { Eye, EyeOff, Mail, UserPlus } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";

import { AuthButton, AuthTextLink } from "@/src/components/auth/AuthButton";
import { AuthField } from "@/src/components/auth/AuthField";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { PROFILE_IMAGES } from "@/src/components/profile/ProfileBackdrop";
import { navigateToDashboard } from "@/src/utils/authNavigation";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = fetchStatus === "fetching";
  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const handleSignUp = async () => {
    setFormError(null);

    if (!email.trim() || !password.trim()) {
      setFormError("Please enter your email and password.");
      return;
    }

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });

    if (error) {
      setFormError(error.message ?? "Unable to create account. Please try again.");
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    setFormError(null);

    if (!code.trim()) {
      setFormError("Enter the verification code from your email.");
      return;
    }

    await signUp.verifications.verifyEmailCode({ code: code.trim() });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          navigateToDashboard(router, decorateUrl);
        },
      });
    }
  };

  const fieldError =
    errors?.fields?.emailAddress?.message ??
    errors?.fields?.password?.message ??
    errors?.fields?.code?.message;

  const displayError = fieldError ?? formError;

  if (isVerifying) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <AuthLayout
          title="Check your inbox"
          subtitle="We sent a verification code to your email. Enter it below to activate your Style Sprout account."
          onBack={() => router.back()}
          imageUri={PROFILE_IMAGES.premium}
          badge="Almost there"
        >
          <View className="mb-2 flex-row items-center rounded-2xl bg-cream px-4 py-3">
            <Mail size={16} color="#4A6741" />
            <Text className="ml-2 flex-1 text-sm font-medium text-charcoal/70" numberOfLines={1}>
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
            error={displayError ?? undefined}
          />

          <AuthButton
            label="Verify & Join Style Sprout"
            icon={UserPlus}
            onPress={() => void handleVerify()}
            loading={isLoading}
            variant="gold"
          />

          <AuthTextLink
            prompt="Didn't get a code?"
            action="Resend email"
            onPress={() => void signUp.verifications.sendEmailCode()}
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
        title="Join Style Sprout"
        subtitle="Create your free account to save outfits, unlock premium drops, and grow your personal wardrobe."
        onBack={() => router.back()}
        imageUri={PROFILE_IMAGES.wardrobe}
        badge="Get started"
      >
        <AuthField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors?.fields?.emailAddress?.message}
        />

        <AuthField
          label="Create password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 8 characters"
          secureTextEntry={!showPassword}
          error={errors?.fields?.password?.message ?? displayError ?? undefined}
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

        <AuthButton
          label="Create Free Account"
          icon={UserPlus}
          onPress={() => void handleSignUp()}
          loading={isLoading}
          variant="gold"
        />

        <AuthTextLink
          prompt="Already have an account?"
          action="Sign in"
          onPress={() => router.replace("/(auth)/sign-in" as Href)}
        />

        <View nativeID="clerk-captcha" />
      </AuthLayout>
    </KeyboardAvoidingView>
  );
}
