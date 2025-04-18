
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DocumentListProps {
  onDocumentClick: (id: string) => void;
}

const DocumentList = ({ onDocumentClick }: DocumentListProps) => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading documents...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents?.map((doc) => (
        <Card 
          key={doc.id} 
          className="cursor-pointer hover:bg-accent transition-colors"
          onClick={() => onDocumentClick(doc.id)}
        >
          <CardHeader>
            <CardTitle>{doc.title}</CardTitle>
            <CardDescription>
              Last updated: {new Date(doc.updated_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
