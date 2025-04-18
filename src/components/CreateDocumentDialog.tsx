
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDocumentDialog = ({ open, onOpenChange }: CreateDocumentDialogProps) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your document",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([{ title, content: "" }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document created successfully",
      });

      onOpenChange(false);
      navigate(`/document/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button 
            className="w-full" 
            onClick={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentDialog;
