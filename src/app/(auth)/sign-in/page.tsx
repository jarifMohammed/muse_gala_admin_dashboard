import { auth } from "@/auth";
import SignInForm from "./_components/SignInForm";

const SignIn = async () => {
  const cu = await auth();

  console.log(cu);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <SignInForm />
    </div>
  );
};

export default SignIn;
