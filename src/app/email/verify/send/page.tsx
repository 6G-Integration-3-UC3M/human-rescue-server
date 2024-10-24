import Form from "@/components/email/verify/send/form";
import { Suspense } from "react";

import AuthLayout from "@/components/layouts/authLayout";

export default function Send() {
  return (
    <AuthLayout>
      <div className="flex flex-col text-center">
        <div className="mb-4">Please verify your email first.</div>
        <Suspense>
          <Form />
        </Suspense>
      </div>
    </AuthLayout>
  )
}
