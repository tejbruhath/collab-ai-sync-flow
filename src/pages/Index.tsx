
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome {user?.email}!</h1>
        <p className="text-xl text-gray-600 mb-8">You are now signed in.</p>
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  );
};

export default Index;
