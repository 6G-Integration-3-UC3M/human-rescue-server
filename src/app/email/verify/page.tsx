import VerifyEmail from "@/components/email/verify/verify-email";
import { Suspense } from "react";

import AuthLayout from "@/components/layouts/authLayout";

export default function Verify() {
  return (
    <AuthLayout>
      <Suspense>
        <div className='flex flex-col'>
          <VerifyEmail />
        </div>
      </Suspense>
    </AuthLayout>
  )
}
