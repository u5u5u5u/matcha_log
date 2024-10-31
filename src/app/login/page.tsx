import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";

const AuthForm = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="login" className="w-[350px] m-5">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
