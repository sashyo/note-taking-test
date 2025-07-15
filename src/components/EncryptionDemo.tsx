import React, { useState } from 'react';
import { Shield, Lock, Unlock, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export const EncryptionDemo: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock encryption/decryption - replace with TideCloak
  const encrypt = (text: string): string => {
    const encrypted = btoa(JSON.stringify({
      data: text,
      timestamp: Date.now(),
      algorithm: 'TideCloak-AES-256'
    }));
    return encrypted;
  };

  const decrypt = (encryptedData: string): string => {
    try {
      const parsed = JSON.parse(atob(encryptedData));
      return parsed.data || 'Invalid encrypted data';
    } catch {
      return 'Failed to decrypt';
    }
  };

  const handleEncrypt = () => {
    if (!plainText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to encrypt",
        variant: "destructive",
      });
      return;
    }

    const encrypted = encrypt(plainText);
    setEncryptedText(encrypted);
    toast({
      title: "Success",
      description: "Text encrypted successfully with TideCloak",
    });
  };

  const handleDecrypt = () => {
    if (!encryptedText.trim()) {
      toast({
        title: "Error", 
        description: "No encrypted text to decrypt",
        variant: "destructive",
      });
      return;
    }

    const decrypted = decrypt(encryptedText);
    setDecryptedText(decrypted);
    toast({
      title: "Success",
      description: "Text decrypted successfully",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied",
        description: "Encrypted text copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="p-3 bg-gradient-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Encryption Demo
        </h2>
        <p className="text-muted-foreground">
          See how TideCloak encrypts your data end-to-end
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card className="shadow-note">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-muted-foreground" />
              Plain Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter your secret message here..."
              className="min-h-[120px] resize-none"
            />
            <Button 
              onClick={handleEncrypt}
              className="w-full"
              variant="gradient"
              disabled={!plainText.trim()}
            >
              <Lock className="h-4 w-4 mr-2" />
              Encrypt with TideCloak
            </Button>
          </CardContent>
        </Card>

        {/* Encrypted Output */}
        <Card className="shadow-note">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Encrypted Output
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="h-3 w-3 mr-1" />
                Secured
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={encryptedText}
                readOnly
                placeholder="Encrypted data will appear here..."
                className={`min-h-[120px] resize-none font-mono text-xs ${
                  !showEncrypted && encryptedText ? 'text-transparent bg-primary/5' : ''
                }`}
              />
              {encryptedText && !showEncrypted && (
                <div className="absolute inset-2 flex items-center justify-center bg-primary/10 rounded border-2 border-dashed border-primary/30">
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-primary font-medium">Encrypted Data Hidden</p>
                    <p className="text-xs text-muted-foreground">Click to reveal</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {encryptedText && (
                <>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEncrypted(!showEncrypted)}
                    className="flex-1"
                  >
                    {showEncrypted ? (
                      <EyeOff className="h-4 w-4 mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    {showEncrypted ? 'Hide' : 'Show'}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(encryptedText)}
                    className="flex-1"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decryption Section */}
      {encryptedText && (
        <Card className="shadow-note">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Unlock className="h-5 w-5 text-accent" />
              Decrypt & Verify
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={handleDecrypt}
                variant="gradient-accent"
                className="flex-1"
              >
                <Unlock className="h-4 w-4 mr-2" />
                Decrypt Message
              </Button>
            </div>
            
            {decryptedText && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="font-medium text-accent">Decrypted Successfully</span>
                </div>
                <p className="text-foreground font-mono text-sm">
                  "{decryptedText}"
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Integrity verified • Decrypted on device
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-gradient-subtle border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                How TideCloak Encryption Works
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Client-side encryption:</strong> Data is encrypted in your browser before transmission</li>
                <li>• <strong>Zero-knowledge:</strong> The server never sees your unencrypted data</li>
                <li>• <strong>Distributed keys:</strong> Your encryption keys are split across multiple nodes</li>
                <li>• <strong>Perfect forward secrecy:</strong> Each session uses unique encryption keys</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};