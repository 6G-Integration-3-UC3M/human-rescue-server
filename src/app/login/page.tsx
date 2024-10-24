import Form from "@/components/login/form";
import AuthLayout from "@/components/layouts/authLayout";

export default async function LoginPage() {
  return (
    <AuthLayout>
      <Form />
    </AuthLayout>
  );
}
