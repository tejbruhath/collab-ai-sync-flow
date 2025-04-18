
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAIAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const callAIFunction = async (endpoint: string, content: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.generatedText;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const improveText = async (content: string) => {
    return callAIFunction('improve-text', content);
  };

  const generateContent = async (topic: string) => {
    return callAIFunction('generate-content', topic);
  };

  return {
    improveText,
    generateContent,
    isLoading,
  };
};
