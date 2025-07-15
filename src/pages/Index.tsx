import React, { useState } from 'react';
import { Shield, BookOpen, Key, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthWrapper } from '@/components/AuthWrapper';
import { NotesApp } from '@/components/NotesApp';
import { EncryptionDemo } from '@/components/EncryptionDemo';
import { TideCloakIntegration } from '@/components/TideCloakProvider';

const Index = () => {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header Navigation */}
      <div className="bg-header-bg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SecureNotes</h1>
                <p className="text-xs text-muted-foreground">Powered by TideCloak</p>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Notes App
                </TabsTrigger>
                <TabsTrigger value="demo" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Encryption Demo
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Integration
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsContent value="notes" className="h-full m-0">
          <AuthWrapper>
            <NotesApp />
          </AuthWrapper>
        </TabsContent>

        <TabsContent value="demo" className="m-0 p-6">
          <div className="max-w-4xl mx-auto">
            <EncryptionDemo />
          </div>
        </TabsContent>

        <TabsContent value="integration" className="m-0 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="p-4 bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-10 w-10 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                TideCloak Integration Guide
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Learn how to integrate TideCloak's end-to-end encryption and authentication 
                into your React applications for maximum security.
              </p>
            </div>

            <TideCloakIntegration />

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-note">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Authentication Features
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Passwordless authentication</li>
                        <li>• Multi-factor authentication</li>
                        <li>• Session management</li>
                        <li>• SSO integration</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-note">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Key className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Encryption Capabilities
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• End-to-end encryption</li>
                        <li>• Client-side key management</li>
                        <li>• Zero-knowledge architecture</li>
                        <li>• Perfect forward secrecy</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-subtle border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">
                  Ready to get started?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Visit the TideCloak documentation to learn more about implementation.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="gradient" asChild>
                    <a href="https://docs.tidecloak.com" target="_blank" rel="noopener noreferrer">
                      View Documentation
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://github.com/tide-foundation/tidecloak" target="_blank" rel="noopener noreferrer">
                      GitHub Repository
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
