"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/useraction";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SignUpForm = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (type === "name") {
      setValues({ ...values, name: e.target.value });
    } else if (type === "email") {
      setValues({ ...values, email: e.target.value });
    } else if (type === "password") {
      setValues({ ...values, password: e.target.value });
    } else if (type === "confirmPassword") {
      setValues({ ...values, confirmPassword: e.target.value });
    }
  };

  const [state, formAction] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  console.log(state.message);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => handleChange(e, "name")}
          />
          {state.errors?.name && (
            <p className="form-error">{state.errors?.name}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            value={values.email}
            onChange={(e) => handleChange(e, "email")}
          />
          {state.errors?.email && (
            <p className="form-error">{state.errors?.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            value={values.password}
            onChange={(e) => handleChange(e, "password")}
          />
          {state.errors?.password && (
            <p className="form-error">{state.errors?.password}</p>
          )}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            value={values.confirmPassword}
            onChange={(e) => handleChange(e, "confirmPassword")}
          />
          {state.errors?.confirmPassword && (
            <p className="form-error">{state.errors?.confirmPassword}</p>
          )}
        </div>
        <div>
          <SignUpButton />
        </div>
        {state && !state.success && (
          <div className="text-center text-destructive">{state.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" target="_self" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
