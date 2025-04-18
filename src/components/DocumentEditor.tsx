
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Save, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";

const DocumentEditor = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const { improveText, generateContent, isLoading: isAILoading } = useAIAssistant();

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setContent(data.content || "");
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const { error } = await supabase
        .from('documents')
        .update({ content: newContent })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImprove = async () => {
    const improvedText = await improveText(content);
    if (improvedText) {
      setContent(improvedText);
    }
  };

  const handleGenerate = async () => {
    const generatedText = await generateContent(document?.title || "");
    if (generatedText) {
      setContent((prev) => prev + "\n\n" + generatedText);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{document?.title}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={isAILoading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button
            variant="outline"
            onClick={handleImprove}
            disabled={isAILoading}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Improve
          </Button>
          <Button
            onClick={() => updateMutation.mutate(content)}
            disabled={updateMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[500px] font-mono"
        placeholder="Start writing your document..."
      />
    </div>
  );
};

export default DocumentEditor;
