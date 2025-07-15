import React from 'react';
import { Shield, Code, Key, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const TideCloakIntegration: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-accent/10 rounded-lg border border-accent/20">
        <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          TideCloak Integration Setup
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-3 bg-background rounded border">
            <p className="font-medium text-foreground mb-2">1. Configure TideCloak Adapter</p>
            <p>Update the <code className="bg-muted px-1 rounded">tidecloakAdapter.json</code> file with your realm settings:</p>
            <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
              {`{
  "realm": "your-realm",
  "auth-server-url": "https://your-tidecloak-server.com/auth",
  "resource": "your-client-id",
  "public-client": true
}`}
            </div>
          </div>
          
          <div className="p-3 bg-background rounded border">
            <p className="font-medium text-foreground mb-2">2. Set Up TideCloak Roles</p>
            <p>Configure the following roles in your TideCloak realm for encryption tags:</p>
            <ul className="mt-2 text-xs space-y-1">
              <li>• <code className="bg-muted px-1 rounded">tide_notes.selfencrypt</code> - For note encryption</li>
              <li>• <code className="bg-muted px-1 rounded">tide_notes.selfdecrypt</code> - For note decryption</li>
              <li>• <code className="bg-muted px-1 rounded">tide_demo.selfencrypt</code> - For demo encryption</li>
              <li>• <code className="bg-muted px-1 rounded">tide_demo.selfdecrypt</code> - For demo decryption</li>
            </ul>
          </div>

          <div className="p-3 bg-background rounded border">
            <p className="font-medium text-foreground mb-2">3. TideCloak Server Setup</p>
            <p>Ensure you have a running TideCloak server with your realm configured. The app will connect automatically using the adapter configuration.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
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
                  <li>• Role-based access control</li>
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
                  <li>• Tag-based permissions</li>
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
                <Book className="h-4 w-4 mr-2" />
                View Documentation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/tide-foundation/tidecloak" target="_blank" rel="noopener noreferrer">
                <Code className="h-4 w-4 mr-2" />
                GitHub Repository
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};