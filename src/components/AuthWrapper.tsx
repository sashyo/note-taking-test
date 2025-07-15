import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTideCloak, Authenticated, Unauthenticated } from '@tidecloak/react';
import { toast } from '@/hooks/use-toast';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const LoginForm: React.FC = () => {
  const { login, authenticated } = useTideCloak();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      toast({
        title: "Success",
        description: "Logged in successfully with end-to-end encryption enabled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate with TideCloak",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="p-4 bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-elegant">
            <Shield className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SecureNotes</h1>
          <p className="text-muted-foreground">
            End-to-end encrypted note taking with TideCloak
          </p>
        </div>

        <Card className="shadow-elegant border-border">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Secure Authentication
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click below to authenticate with TideCloak
                </p>
              </div>

              <Button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Login with TideCloak
                  </>
                )}
              </Button>

              <Alert className="border-accent/20 bg-accent/10">
                <Shield className="h-4 w-4 text-accent" />
                <AlertDescription className="text-sm">
                  <strong className="text-accent">End-to-End Encryption:</strong><br />
                  Your notes are encrypted on your device before being stored. 
                  Only you can decrypt and read them with your TideCloak credentials.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AuthenticatedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, token, tokenExp, getValueFromToken } = useTideCloak();
  
  const userEmail = getValueFromToken('email') || getValueFromToken('preferred_username') || 'User';
  const expirationTime = tokenExp ? new Date(tokenExp * 1000) : null;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      {/* User info and logout - positioned as overlay in top right */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
        <div className="text-right text-sm">
          <p className="font-medium text-foreground">{userEmail}</p>
          {expirationTime && (
            <p className="text-xs text-muted-foreground">
              Session expires: {expirationTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="bg-background/80 backdrop-blur-sm"
        >
          <LogIn className="h-4 w-4 mr-2 rotate-180" />
          Logout
        </Button>
      </div>
      
      {children}
    </div>
  );
};

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <>
      <Unauthenticated>
        <LoginForm />
      </Unauthenticated>
      
      <Authenticated>
        <AuthenticatedContent>
          {children}
        </AuthenticatedContent>
      </Authenticated>
    </>
  );
};