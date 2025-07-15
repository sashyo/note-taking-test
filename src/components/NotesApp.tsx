import React, { useState, useEffect } from 'react';
import { Plus, Search, Lock, Shield, FileText, Trash2, Edit3, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTideCloak } from '@tidecloak/react';
import { toast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  encryptedContent: string; // Store encrypted content
  encrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export const NotesApp: React.FC = () => {
  const { doEncrypt, doDecrypt, getValueFromToken } = useTideCloak();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

  const userEmail = getValueFromToken('email') || 'user';

  // Decrypt note content when a note is selected
  useEffect(() => {
    const decryptNote = async () => {
      if (selectedNote && selectedNote.encryptedContent) {
        setIsLoading(true);
        try {
          const [decrypted] = await doDecrypt([
            { encrypted: selectedNote.encryptedContent, tags: ['notes'] }
          ]);
          setDecryptedContent(decrypted || 'Failed to decrypt content');
        } catch (error) {
          console.error('Decryption failed:', error);
          setDecryptedContent('Failed to decrypt content - check your permissions');
          toast({
            title: "Decryption Error",
            description: "Unable to decrypt note content. Check your TideCloak permissions.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (selectedNote) {
      decryptNote();
    }
  }, [selectedNote, doDecrypt]);

  const createNote = async () => {
    if (!newNote.title.trim()) {
      toast({
        title: "Error",
        description: "Note title is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Encrypt the note content using TideCloak
      const [encryptedContent] = await doEncrypt([
        { data: newNote.content, tags: ['notes'] }
      ]);

      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        encryptedContent,
        encrypted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      setNotes(prev => [note, ...prev]);
      setNewNote({ title: '', content: '', tags: '' });
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Note encrypted and saved successfully with TideCloak",
      });
    } catch (error) {
      console.error('Encryption failed:', error);
      toast({
        title: "Encryption Error",
        description: "Failed to encrypt note. Check your TideCloak permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
    toast({
      title: "Success",
      description: "Note deleted successfully",
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gradient-subtle">
      {/* Sidebar */}
      <div className="w-80 bg-sidebar-bg border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-header-bg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SecureNotes</h1>
              <p className="text-sm text-muted-foreground">End-to-end encrypted</p>
            </div>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Create Encrypted Note
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your encrypted note..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newNote.tags}
                    onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="work, personal, ideas..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={createNote}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Encrypting...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Create & Encrypt
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No notes found' : 'No notes yet'}
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-note ${
                  selectedNote?.id === note.id 
                    ? 'ring-2 ring-primary shadow-elegant' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-primary" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    🔒 Encrypted content - click to decrypt and view
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {note.updatedAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="p-6 border-b border-border bg-header-bg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-accent rounded-lg">
                    <Edit3 className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedNote.title}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Lock className="h-3 w-3" />
                      TideCloak Encrypted • Last updated {selectedNote.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    <Shield className="h-3 w-3 mr-1" />
                    End-to-End Encrypted
                  </Badge>
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Decrypting...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 p-6">
              <Card className="h-full bg-note-bg border-note-border shadow-note">
                <CardContent className="p-6 h-full">
                  <div className="h-full">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Decrypting note with TideCloak...</p>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        value={decryptedContent}
                        readOnly
                        className="w-full h-full resize-none border-0 bg-transparent text-base leading-relaxed focus:ring-0 focus:outline-none"
                        placeholder="Decrypted content will appear here..."
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="p-4 bg-gradient-primary rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Your Secure Vault
              </h3>
              <p className="text-muted-foreground mb-6">
                Select a note to decrypt and view its content, or create a new encrypted note with TideCloak.
              </p>
              <Button 
                onClick={() => setIsCreating(true)}
                className="bg-gradient-primary hover:opacity-90 shadow-elegant"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};